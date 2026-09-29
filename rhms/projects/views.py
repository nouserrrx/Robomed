from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Projet, Mission
from .serializers import ProjetSerializer, MissionSerializer
from accounts.permissions import IsAdminOrReadOnly


class ProjetViewSet(ModelViewSet):
    queryset = Projet.objects.all().order_by('-date_debut')
    serializer_class = ProjetSerializer
    permission_classes = [IsAdminOrReadOnly]


class MissionViewSet(ModelViewSet):
    queryset = Mission.objects.all().order_by('-date_debut')
    serializer_class = MissionSerializer
    permission_classes = [IsAdminOrReadOnly]

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def apply(self, request, pk=None):
        mission = self.get_object()
        user = request.user
        # Assigner ou enregistrer la candidature du bénévole
        if hasattr(user, 'benevole'):
            benevole = user.benevole
        else:
            from volunteers.models import Benevole
            benevole, _ = Benevole.objects.get_or_create(
                utilisateur=user,
                defaults={'competences': 'Candidat spontané', 'statut': False}
            )

        if not mission.benevole:
            mission.benevole = benevole
            mission.save()
            return Response({'status': 'assigned', 'message': f'Vous avez été inscrit à la mission "{mission.titre}".'})
        else:
            return Response(
                {'status': 'pending', 'message': f'Candidature enregistrée pour la mission "{mission.titre}". Le coordinateur examinera votre profil.'}
            )
