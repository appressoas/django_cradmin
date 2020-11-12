from django.contrib.auth import authenticate, login
from django.test import TestCase, RequestFactory
from django.urls import reverse
import htmls
from django_cradmin.apps.cradmin_authenticate.tests.cradmin_authenticate_testapp.models import EmailUser
from django.test.utils import override_settings

from django_cradmin.tests.test_views.helpers import create_testuser


class TestUsernameLogin(TestCase):
    def setUp(self):
        self.testuser = create_testuser(username='testuser')
        self.url = reverse('cradmin-authenticate-login')

    def test_get(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        selector = htmls.S(response.content)
        self.assertEqual(selector.one('h1').alltext_normalized, 'Sign in')

    def test_login_ok(self):
        response = self.client.post(self.url, {
            'username': 'testuser',
            'password': 'test'
        })
        self.assertEqual(response.status_code, 302)

    def test_user_authenticated_login_redirect_to_login_redirect_url(self):
        self.client.login(username='testuser', password='test')
        with self.settings(LOGIN_REDIRECT_URL='/login/redirect'):
            response = self.client.get(self.url)
        self.assertEqual(response['location'], '/login/redirect')

    def test_user_authenticated_login_redirect_to_next_url(self):
        self.client.login(username='testuser', password='test')
        with self.settings(LOGIN_REDIRECT_URL='/login/redirect'):
            response = self.client.get('{}?next=/next-url'.format(self.url))
        self.assertEqual(response['location'], '/next-url')

    def test_login_invalid(self):
        response = self.client.post(self.url, {
            'username': 'testuser',
            'password': 'invalid'
        })
        self.assertEqual(response.status_code, 200)
        selector = htmls.S(response.content)
        self.assertIn(
            "Your username and password didn't match",
            selector.one('.test-form-globalmessages .test-warning-message').alltext_normalized)


class TestEmailLogin(TestCase):
    def setUp(self):
        self.testuser = EmailUser(email='testuser@example.com')
        self.testuser.set_password('test')
        self.testuser.save()
        self.url = reverse('cradmin-authenticate-login')

    def test_get(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        selector = htmls.S(response.content)
        self.assertEqual(selector.one('h1').alltext_normalized, 'Sign in')

    def test_login_ok(self):
        with self.settings(LOGIN_REDIRECT_URL='/login/redirect'):
            response = self.client.post(self.url, {
                'email': 'testuser@example.com',
                'password': 'test'
            })
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response['location'], '/login/redirect')

    def test_login_next(self):
        response = self.client.post('{}?next=/next'.format(self.url), {
            'email': 'testuser@example.com',
            'password': 'test'
        })
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response['location'], '/next')

    def test_user_authenticated_login_redirect_to_login_redirect_url(self):
        self.client.login(username='testuser@example.com', password='test')
        with self.settings(LOGIN_REDIRECT_URL='/login/redirect'):
            response = self.client.get(self.url)
        self.assertEqual(response['location'], '/login/redirect')

    def test_user_authenticated_login_redirect_to_next_url(self):
        self.client.login(username='testuser@example.com', password='test')
        with self.settings(LOGIN_REDIRECT_URL='/login/redirect'):
            response = self.client.get('{}?next=/next-url'.format(self.url))
        self.assertEqual(response['location'], '/next-url')

    def test_login_invalid(self):
        response = self.client.post(self.url, {
            'email': 'testuser@example.com',
            'password': 'invalid'
        })
        self.assertEqual(response.status_code, 200)
        selector = htmls.S(response.content)
        self.assertIn(
            "Your email and password didn't match",
            selector.one('.test-form-globalmessages .test-warning-message').alltext_normalized)

TestEmailLogin = override_settings(
    AUTH_USER_MODEL='cradmin_authenticate_testapp.EmailUser',
    DJANGO_CRADMIN_USE_EMAIL_AUTH=True
)(TestEmailLogin)
