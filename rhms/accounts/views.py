from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.throttling import AnonRateThrottle
from rest_framework.response import Response
from rest_framework import status, mixins
from .models import CustomUser, Profile, IncidentLog, TeamMember
from .serializers import CustomUserSerializer, ProfileSerializer, IncidentLogSerializer, TeamMemberSerializer
from .authentication import generate_user_token
from .permissions import IsAdmin, IsAdminOrCoordinator, IsAdminOrReadOnly, IsSelfOrAdmin


class LoginAnonThrottle(AnonRateThrottle):
    rate = '10/minute'


class CustomUserViewSet(ModelViewSet):
    queryset = CustomUser.objects.all().order_by('-date_creation')
    serializer_class = CustomUserSerializer

    def get_permissions(self):
        if self.action == 'create':
            # Inscription ouverte au public
            return [AllowAny()]
        elif self.action in ['list', 'destroy']:
            # Seul l'administrateur peut lister tous les utilisateurs ou supprimer un compte
            return [IsAdmin()]
        # Consultation / Modification : soit soi-même, soit l'administrateur
        return [IsSelfOrAdmin()]

    def create(self, request, *args, **kwargs):
        """Crée un utilisateur — rôle forcé et approbation requise par défaut."""
        data = request.data.copy()
        password = data.pop('password', None)
        if isinstance(password, (list, tuple)):
            password = password[0] if password else None

        # Protection contre l'élévation de privilèges à l'inscription
        is_request_admin = bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role == 'administrateur' or request.user.is_superuser)
        )

        if not is_request_admin:
            # Un utilisateur externe ne peut s'auto-attribuer le rôle admin
            requested_role = data.get('role', 'visiteur')
            if requested_role not in ['visiteur', 'benevole']:
                data['role'] = 'visiteur'
            data['is_approved'] = False
            data['is_staff'] = False
            data['is_superuser'] = False

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        if password:
            user.set_password(password)

        if not is_request_admin:
            user.is_approved = False

        user.save()

        # Journalisation de sécurité
        IncidentLog.objects.create(
            level='INFO',
            source='AUTH',
            message=f"Nouvelle inscription : {user.username} ({user.email}) - Rôle: {user.role}",
            user=user if is_request_admin else None
        )

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """Met à jour un utilisateur, empêche le Mass Assignment et hash le mot de passe."""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data.copy()
        password = data.pop('password', None)

        is_request_admin = bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role == 'administrateur' or request.user.is_superuser)
        )

        # Seul un admin peut modifier le rôle, l'approbation ou les droits système
        if not is_request_admin:
            data.pop('role', None)
            data.pop('is_approved', None)
            data.pop('is_staff', None)
            data.pop('is_superuser', None)

        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        if password:
            user.set_password(password)
            user.save()

        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)


class ProfileViewSet(ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsSelfOrAdmin]

    def get_queryset(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            return Profile.objects.none()
        if user.role == 'administrateur' or user.is_superuser or user.is_staff:
            return Profile.objects.all()
        return Profile.objects.filter(user=user)


class IncidentLogViewSet(mixins.CreateModelMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin, GenericViewSet):
    """
    Journaux d'incidents et de sécurité :
    - Consultation et création autorisées aux administrateurs/coordinateurs.
    - Toute suppression ou modification est formellement interdite pour préserver l'intégrité de l'audit.
    """
    queryset = IncidentLog.objects.all().order_by('-created_at')
    serializer_class = IncidentLogSerializer
    permission_classes = [IsAdminOrCoordinator]


@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([LoginAnonThrottle])
def api_login(request):
    """Point d'entrée de connexion sécurisé avec Throttling anti-brute-force."""
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({'error': 'Email et mot de passe requis'}, status=status.HTTP_400_BAD_REQUEST)

    # Recherche de l'utilisateur par email ou username
    user = CustomUser.objects.filter(email=email).first()
    if not user:
        user = CustomUser.objects.filter(username=email).first()

    if not user or not user.check_password(password):
        IncidentLog.objects.create(
            level='WARNING',
            source='AUTH',
            message=f"Tentative de connexion échouée pour : {email}"
        )
        return Response({'error': 'Identifiants invalides'}, status=status.HTTP_401_UNAUTHORIZED)

    if not user.is_active:
        return Response({'error': 'Compte utilisateur désactivé.'}, status=status.HTTP_403_FORBIDDEN)

    # Vérifier si le compte est approuvé par l'admin (sauf superusers)
    if not user.is_approved and not user.is_superuser:
        return Response(
            {'error': 'pending_approval', 'message': "Votre compte est en attente d'approbation par l'administrateur."},
            status=status.HTTP_403_FORBIDDEN
        )

    name = f"{user.first_name} {user.last_name}".strip() or user.username
    token = generate_user_token(user)

    IncidentLog.objects.create(
        level='INFO',
        source='AUTH',
        message=f"Connexion réussie : {user.username} ({user.role})",
        user=user
    )

    return Response({
        'token': token,
        'user': {
            'id': user.id,
            'username': user.username,
            'name': name,
            'email': user.email,
            'role': user.role or 'visiteur'
        }
    })


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def api_me(request):
    """Point d'accès retournant les informations vérifiées de l'utilisateur connecté."""
    user = request.user
    if request.method == 'PATCH':
        data = request.data.copy() if hasattr(request.data, 'copy') else dict(request.data)
        password = data.pop('password', None)
        # Protection : un utilisateur ne peut pas s'auto-promouvoir via son profil
        if not (request.user.role == 'administrateur' or request.user.is_superuser):
            data.pop('role', None)
            data.pop('is_approved', None)
            data.pop('is_staff', None)
            data.pop('is_superuser', None)

        serializer = CustomUserSerializer(user, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        if password:
            pwd_val = password[0] if isinstance(password, list) else password
            user.set_password(pwd_val)
            user.save()

    name = f"{user.first_name} {user.last_name}".strip() or user.username
    photo_url = user.photo.url if user.photo else None
    return Response({
        'id': user.id,
        'username': user.username,
        'name': name,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email,
        'role': user.role or 'visiteur',
        'phone': user.phone,
        'address': user.address,
        'photo': photo_url,
        'is_approved': user.is_approved,
        'is_staff': user.is_staff,
        'is_superuser': user.is_superuser,
    })


class TeamMemberViewSet(ModelViewSet):
    """
    Gestion des membres de l'équipe RoBomed :
    - Consultation publique (list, retrieve)
    - Modifications réservées aux administrateurs / coordinateurs
    """
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        is_admin = bool(
            self.request.user and
            self.request.user.is_authenticated and
            (self.request.user.role in ['administrateur', 'coordinateur'] or self.request.user.is_superuser or self.request.user.is_staff)
        )
        if not is_admin:
            return qs.filter(actif=True)
        return qs
