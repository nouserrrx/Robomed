from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
import time
from .models import Benevole
from .serializers import BenevoleSerializer
from accounts.permissions import IsAdminOrCoordinator


class BenevoleViewSet(ModelViewSet):
    """
    Gestion des candidatures et dossiers de bénévoles :
    - Dépôt de candidature ouvert à tous (create).
    - Consultation de son dossier par un bénévole authentifié.
    - Consultation globale, validation et gestion réservées aux coordinateurs/administrateurs.
    """
    queryset = Benevole.objects.all().order_by('-date_inscription')
    serializer_class = BenevoleSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAdminOrCoordinator()]

    def get_queryset(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            return Benevole.objects.none()
        if user.role in ['administrateur', 'coordinateur'] or user.is_superuser or user.is_staff:
            return Benevole.objects.all().order_by('-date_inscription')
        return Benevole.objects.filter(utilisateur=user)

    def perform_create(self, serializer):
        user = self.request.user if (self.request.user and self.request.user.is_authenticated) else None

        applicant_email = serializer.validated_data.pop('applicant_email', None)
        applicant_name = serializer.validated_data.pop('applicant_name', None)
        applicant_phone = serializer.validated_data.pop('applicant_phone', '')

        if not user and applicant_email:
            from accounts.models import CustomUser
            username = applicant_email.split('@')[0].lower().replace('.', '_')
            user, _ = CustomUser.objects.get_or_create(
                email=applicant_email,
                defaults={
                    'username': f"{username}_{int(time.time())}",
                    'first_name': applicant_name.split()[0] if applicant_name else '',
                    'last_name': ' '.join(applicant_name.split()[1:]) if applicant_name else '',
                    'phone': applicant_phone,
                    'role': 'benevole',
                    'is_approved': False,
                }
            )

        serializer.save(
            utilisateur=serializer.validated_data.get('utilisateur') or user,
            statut=False
        )

    @action(detail=True, methods=['post'], permission_classes=[IsAdminOrCoordinator])
    def approve(self, request, pk=None):
        benevole = self.get_object()
        benevole.statut = True
        benevole.save()
        if benevole.utilisateur:
            benevole.utilisateur.is_approved = True
            benevole.utilisateur.role = 'benevole'
            benevole.utilisateur.save()
            from backend.emails import send_volunteer_approval_email
            send_volunteer_approval_email(benevole)
        return Response({'status': 'approved', 'message': 'Candidature approuvée avec succès.'})

    @action(detail=True, methods=['post'], permission_classes=[IsAdminOrCoordinator])
    def reject(self, request, pk=None):
        benevole = self.get_object()
        benevole.statut = False
        benevole.save()
        return Response({'status': 'rejected', 'message': 'Candidature refusée ou désactivée.'})

