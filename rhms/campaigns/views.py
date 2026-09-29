from rest_framework.viewsets import ModelViewSet
from .models import Campagne
from .serializers import CampagneSerializer
from accounts.permissions import IsAdminOrReadOnly


class CampagneViewSet(ModelViewSet):
    queryset = Campagne.objects.all().order_by('-date_debut')
    serializer_class = CampagneSerializer
    permission_classes = [IsAdminOrReadOnly]
