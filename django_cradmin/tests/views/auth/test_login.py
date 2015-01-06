from django.test import TestCase
from django.core.urlresolvers import reverse

from django_cradmin.tests.views.helpers import create_testuser


class TestLogin(TestCase):
    def setUp(self):
        self.testuser = create_testuser(username='testuser')
        self.url = reverse('django_cradmin-login')

    def test_login_ok(self):
        response = self.client.post(self.url, {
            'username': 'testuser',
            'password': 'test'
        })

        self.assertEquals(response.status_code, 302)

    def test_login_invalid(self):
        response = self.client.post(self.url, {
            'username': 'testuser',
            'password': 'invalid'
        })
        self.assertEquals(response.status_code, 200)
        self.assertIn("Your email and password didn&#39;t match", response.content)
