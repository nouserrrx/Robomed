from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings


class Command(BaseCommand):
    help = "Teste l'envoi d'un e-mail via la configuration actuelle (Console ou SMTP)."

    def add_arguments(self, parser):
        parser.add_argument('email', type=str, help='Adresse email du destinataire pour le test')

    def handle(self, *args, **options):
        recipient = options['email']
        backend = getattr(settings, 'EMAIL_BACKEND', 'Non défini')
        host = getattr(settings, 'EMAIL_HOST', 'N/A')
        user = getattr(settings, 'EMAIL_HOST_USER', 'N/A')
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'contact@robomed.org')

        self.stdout.write(self.style.NOTICE(f"\n📧 Test d'envoi d'email :"))
        self.stdout.write(f"   Backend utilisé : {backend}")
        self.stdout.write(f"   Serveur SMTP   : {host}")
        self.stdout.write(f"   Expéditeur     : {from_email}")
        self.stdout.write(f"   Destinataire   : {recipient}\n")

        try:
            send_mail(
                subject="[RoBomed RHMS] Test de configuration e-mail réussi !",
                message=(
                    "Félicitations !\n\n"
                    "Ce message confirme que la configuration d'envoi d'e-mails de votre plateforme "
                    "RoBomed Humanitarian Management System est parfaitement fonctionnelle.\n\n"
                    "Cordialement,\n"
                    "L'équipe Technique RoBomed."
                ),
                from_email=from_email,
                recipient_list=[recipient],
                fail_silently=False,
            )
            self.stdout.write(self.style.SUCCESS(f"✅ E-mail envoyé avec succès à {recipient} !"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Échec de l'envoi : {e}"))
