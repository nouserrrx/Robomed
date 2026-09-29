from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import CustomUser


class AccountsAuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = CustomUser.objects.create_superuser(
            username='admin_test',
            email='admin@robomed.org',
            password='AdminPassword123!',
            role='administrateur',
            is_approved=True
        )
        self.regular_user = CustomUser.objects.create_user(
            username='user_test',
            email='user@robomed.org',
            password='UserPassword123!',
            role='visiteur',
            is_approved=False
        )

    def test_login_approved_admin(self):
        res = self.client.post('/api/accounts/login/', {
            'email': 'admin@robomed.org',
            'password': 'AdminPassword123!'
        })
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('token', res.data)
        self.assertEqual(res.data['user']['role'], 'administrateur')

    def test_login_unapproved_user_blocked(self):
        res = self.client.post('/api/accounts/login/', {
            'email': 'user@robomed.org',
            'password': 'UserPassword123!'
        })
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(res.data.get('error'), 'pending_approval')

    def test_public_registration_requires_approval(self):
        res = self.client.post('/api/accounts/users/', {
            'username': 'new_candidate',
            'email': 'candidate@test.org',
            'password': 'StrongPassword123!',
            'role': 'administrateur'  # Privilege escalation attempt should be stripped
        })
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        new_u = CustomUser.objects.get(username='new_candidate')
        self.assertFalse(new_u.is_approved)
        self.assertNotEqual(new_u.role, 'administrateur')
