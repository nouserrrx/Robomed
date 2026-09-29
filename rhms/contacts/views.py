import logging
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.throttling import AnonRateThrottle
from django.core.mail import send_mail
from django.conf import settings
from .models import Contact
from .serializers import ContactSerializer
from accounts.permissions import IsAdminOrCoordinator

logger = logging.getLogger(__name__)


class ContactAnonThrottle(AnonRateThrottle):
    scope = 'contact'


class ContactViewSet(ModelViewSet):
    """
    ViewSet sécurisé pour les messages de contact :
    - Soumission ouverte à tous les visiteurs (create), protégée par throttling anti-spam.
    - Lecture, suppression et réponse réservées aux administrateurs/coordinateurs (protection PII).
    """
    queryset = Contact.objects.all().order_by('-date_envoi')
    serializer_class = ContactSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAdminOrCoordinator()]

    def get_throttles(self):
        if self.action == 'create':
            return [ContactAnonThrottle()]
        return super().get_throttles()

    @action(detail=True, methods=['post'], permission_classes=[IsAdminOrCoordinator])
    def reply(self, request, pk=None):
        contact = self.get_object()
        reply_message = request.data.get('message')
        reply_subject = request.data.get('sujet', f"RE: {contact.sujet}")

        if not reply_message:
            return Response({'error': 'Le message de réponse est obligatoire.'}, status=status.HTTP_400_BAD_REQUEST)

        email_sent = False
        try:
            send_mail(
                subject=reply_subject,
                message=reply_message,
                from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'contact@robomed.org'),
                recipient_list=[contact.email],
                fail_silently=False,
            )
            email_sent = True
        except Exception as e:
            logger.warning("Échec d'envoi d'email de réponse à %s : %s", contact.email, e)

        contact.lu = True
        contact.save()

        msg = (
            f'Réponse envoyée avec succès à {contact.email}'
            if email_sent
            else f'Réponse consignée avec succès pour {contact.email} (envoi d\'email simulé/hors-ligne).'
        )

        return Response({
            'status': 'success',
            'message': msg,
            'email_sent': email_sent
        })
