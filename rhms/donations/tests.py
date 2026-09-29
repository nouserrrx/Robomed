from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from campaigns.models import Campagne
from projects.models import Projet
from donations.models import Don
from accounts.models import CustomUser


class DonationCampaignTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.projet = Projet.objects.create(
            titre="Forage Puits Tchad",
            description="Puits à énergie solaire",
            budget=15000,
            date_debut="2025-01-01",
            date_fin="2025-12-31",
            statut="en_cours"
        )
        self.campagne = Campagne.objects.create(
            projet=self.projet,
            titre="Campagne Eau Pour Tous",
            description="Levée de fonds",
            objectif=10000,
            collecte=0,
            date_debut="2025-01-01",
            date_fin="2025-06-30",
            statut="active"
        )

    def test_donation_creation_updates_campaign_on_confirm(self):
        don = Don.objects.create(
            campagne=self.campagne,
            montant=2500,
            statut='confirme',
            reference='RBM-TEST-DON-1'
        )
        # Manually trigger update logic or verify
        from donations.views import DonViewSet
        DonViewSet().update_campagne_collecte(self.campagne)
        self.campagne.refresh_from_db()
        self.assertEqual(float(self.campagne.collecte), 2500.0)

    def test_tax_receipt_pdf_generation(self):
        don = Don.objects.create(
            campagne=self.campagne,
            montant=150,
            statut='confirme',
            reference='RBM-TAX-9999'
        )
        res = self.client.get(f'/api/donations/{don.id}/recu/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res['Content-Type'], 'application/pdf')
        self.assertTrue(len(res.content) > 1000)

    def test_donation_confirmation_sends_email_with_pdf_attachment(self):
        from django.core import mail
        from backend.emails import send_donation_receipt_email

        don = Don.objects.create(
            campagne=self.campagne,
            montant=200,
            statut='confirme',
            reference='RBM-EMAIL-TEST-1',
            message='Don de Jean Dupont (jean.dupont@example.com)'
        )
        success = send_donation_receipt_email(don)
        self.assertTrue(success)
        self.assertEqual(len(mail.outbox), 1)
        email = mail.outbox[0]
        self.assertIn('jean.dupont@example.com', email.to)
        self.assertIn('Reçu Fiscal n° RBM-EMAIL-TEST-1', email.subject)
        self.assertEqual(len(email.attachments), 1)
        self.assertEqual(email.attachments[0][0], 'Recu_Fiscal_RBM-EMAIL-TEST-1.pdf')

