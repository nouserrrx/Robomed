from rest_framework.viewsets import ModelViewSet
from .models import Beneficiaire
from .serializers import BeneficiaireSerializer
from accounts.permissions import IsAdminOrCoordinator


class BeneficiaireViewSet(ModelViewSet):
    """
    Protection stricte des données sensibles des bénéficiaires vulnérables (PII, RGPD, Loi 25).
    Accès réservé aux administrateurs et coordinateurs de terrain.
    """
    queryset = Beneficiaire.objects.all()
    serializer_class = BeneficiaireSerializer
    permission_classes = [IsAdminOrCoordinator]
