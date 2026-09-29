from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
import time
from .models import Don
from .serializers import DonSerializer
from accounts.permissions import IsAdminOrCoordinator


class DonViewSet(ModelViewSet):
    """
    Gestion sécurisée des dons :
    - Enregistrement d'un don ouvert à tous (create).
    - Consultation de ses propres dons par un donateur authentifié.
    - Consultation globale et gestion des reçus réservées aux administrateurs/coordinateurs.
    """
    queryset = Don.objects.all().order_by('-date_don')
    serializer_class = DonSerializer

    def get_permissions(self):
        if self.action in ['create', 'recu']:
            return [AllowAny()]
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAdminOrCoordinator()]

    def get_queryset(self):
        if self.action == 'recu':
            return Don.objects.all()
        user = self.request.user
        if not user or not user.is_authenticated:
            return Don.objects.none()
        if user.role in ['administrateur', 'coordinateur'] or user.is_superuser or user.is_staff:
            return Don.objects.all().order_by('-date_don')
        # Un donateur ne voit que ses propres dons
        return Don.objects.filter(donateur=user).order_by('-date_don')

    def perform_create(self, serializer):
        user = self.request.user if (self.request.user and self.request.user.is_authenticated) else None
        is_admin = bool(
            user and (user.role in ['administrateur', 'coordinateur'] or user.is_superuser or user.is_staff)
        )
        reference = serializer.validated_data.get('reference')
        if not reference:
            reference = f"RBM-{int(time.time() * 1000)}"

        # Forcer statut = 'en_attente' si la création est publique / non-admin
        initial_status = serializer.validated_data.get('statut', 'en_attente')
        if not is_admin:
            initial_status = 'en_attente'

        don = serializer.save(
            donateur=serializer.validated_data.get('donateur') or user,
            reference=reference,
            statut=initial_status,
        )

        # Si le don est confirmé, mettre à jour la collecte de la campagne
        if don.statut == 'confirme' and don.campagne:
            self.update_campagne_collecte(don.campagne)

    def perform_update(self, serializer):
        old_campagne = serializer.instance.campagne
        don = serializer.save()
        if don.campagne:
            self.update_campagne_collecte(don.campagne)
        if old_campagne and old_campagne != don.campagne:
            self.update_campagne_collecte(old_campagne)

    def update_campagne_collecte(self, campagne):
        from django.db.models import Sum
        total = Don.objects.filter(campagne=campagne, statut='confirme').aggregate(total=Sum('montant'))['total'] or 0
        campagne.collecte = total
        campagne.save(update_fields=['collecte'])

    @action(detail=True, methods=['get'], permission_classes=[AllowAny])
    def recu(self, request, pk=None):
        """Génère et télécharge le reçu fiscal PDF officiel pour ce don."""
        from django.http import HttpResponse
        from reports.generators import build_tax_receipt_pdf
        don = self.get_object()
        pdf_buffer = build_tax_receipt_pdf(don)
        response = HttpResponse(pdf_buffer.read(), content_type='application/pdf')
        response['Content-Disposition'] = f'inline; filename="Recu_Fiscal_{don.reference}.pdf"'
        return response

