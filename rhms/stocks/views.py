from rest_framework.viewsets import ModelViewSet
from .models import Produit, Stock
from .serializers import ProduitSerializer, StockSerializer
from accounts.permissions import IsAdminOrCoordinator


class ProduitViewSet(ModelViewSet):
    queryset = Produit.objects.all()
    serializer_class = ProduitSerializer
    permission_classes = [IsAdminOrCoordinator]


class StockViewSet(ModelViewSet):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer
    permission_classes = [IsAdminOrCoordinator]
