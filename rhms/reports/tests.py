from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import CustomUser


class ReportsGenerationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = CustomUser.objects.create_superuser(
            username='report_admin',
            email='admin@robomed.org',
            password='AdminPassword123!',
            role='administrateur',
            is_approved=True
        )
        self.client.force_authenticate(user=self.admin)

    def test_impact_stats_public(self):
        self.client.logout()
        res = self.client.get('/api/reports/stats/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('beneficiaires', res.data)
        self.assertIn('dons', res.data)

    def test_export_pdf_activity_report(self):
        self.client.force_authenticate(user=self.admin)
        res = self.client.get('/api/reports/export/pdf/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res['Content-Type'], 'application/pdf')
        self.assertTrue(len(res.content) > 1000)

    def test_export_excel_activity_report(self):
        self.client.force_authenticate(user=self.admin)
        res = self.client.get('/api/reports/export/excel/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('openxmlformats', res['Content-Type'])
        self.assertTrue(len(res.content) > 1000)
