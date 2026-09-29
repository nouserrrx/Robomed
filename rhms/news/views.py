from rest_framework.viewsets import ModelViewSet
from .models import Actualite, Evenement


from .serializers import ActualiteSerializer, EvenementSerializer
from accounts.permissions import IsAdminOrReadOnly


class ActualiteViewSet(ModelViewSet):
    queryset = Actualite.objects.all().order_by('-date_publication')
    serializer_class = ActualiteSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        is_staff = bool(user and user.is_authenticated and (user.role in ['administrateur', 'coordinateur'] or user.is_superuser or user.is_staff))
        if is_staff:
            return Actualite.objects.all().order_by('-date_publication')
        return Actualite.objects.filter(statut='publie').order_by('-date_publication')


class EvenementViewSet(ModelViewSet):
    queryset = Evenement.objects.all().order_by('-date_debut')
    serializer_class = EvenementSerializer
    permission_classes = [IsAdminOrReadOnly]
