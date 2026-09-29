from rest_framework.viewsets import ModelViewSet
from .models import Distribution
from .serializers import DistributionSerializer
from accounts.permissions import IsAdminOrCoordinator


class DistributionViewSet(ModelViewSet):
    queryset = Distribution.objects.all()
    serializer_class = DistributionSerializer
    permission_classes = [IsAdminOrCoordinator]
