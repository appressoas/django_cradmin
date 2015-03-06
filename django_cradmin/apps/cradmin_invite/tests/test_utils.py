from django.core import mail
from django.test import TestCase
import mock
from django_cradmin.apps.cradmin_activate_account.utils import ActivationEmail
from django_cradmin.tests.helpers import create_user


class TestSendActivationEmail(TestCase):
    def setUp(self):
        self.testuser = create_user('testuser', email='testuser@example.com')

    def test_generate_token(self):
        token = ActivationEmail(user=self.testuser, next_url='/', request=mock.MagicMock()).generate_token()
        self.assertEquals(token.get_metadata()['next_url'], '/')

    def test_generate_token_no_next_url(self):
        with self.settings(LOGIN_URL='/next'):
            token = ActivationEmail(user=self.testuser, request=mock.MagicMock()).generate_token()
        self.assertEquals(token.get_metadata()['next_url'], '/next')

    def test_send(self):
        testtoken = mock.MagicMock()
        testtoken.token = 'test-token'
        testrequest = mock.MagicMock()
        testrequest.build_absolute_uri = lambda path: 'http://testserver{}'.format(path)

        with mock.patch.object(ActivationEmail, 'generate_token', lambda s: testtoken):
            with self.settings(DJANGO_CRADMIN_SITENAME='Testsite'):
                ActivationEmail(user=self.testuser, request=testrequest).send()
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, 'Activate your Testsite account')
        expected_email_body = """
Click the link below to activate your Testsite account, testuser.

http://testserver/cradmin_activate_account/activate/test-token""".strip()
        self.assertEqual(mail.outbox[0].body, expected_email_body)
