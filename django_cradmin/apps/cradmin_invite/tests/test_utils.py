from django.core import mail
from django.test import TestCase
import mock
from django_cradmin.apps.cradmin_invite.invite_url import InviteUrl
from django_cradmin.tests.helpers import create_user


class InviteUrlMock(InviteUrl):
    def get_appname(self):
        return 'testapp'

    def get_confirm_invite_url(self, token):
        return '/invite/accept/{}'.format(token.token)


class InviteUrlWithStaticTokenMock(InviteUrlMock):
    def generate_token(self):
        testtoken = mock.MagicMock()
        testtoken.token = 'test-token'
        return testtoken


class InviteUrlWithTokenIteratorMock(InviteUrlMock):
    def __init__(self, *args, **kwargs):
        self.tokens = iter(['token1', 'token2', 'token3'])
        super(InviteUrlWithTokenIteratorMock, self).__init__(*args, **kwargs)

    def _generate_token(self):
        testtoken = mock.MagicMock()
        testtoken.token = self.tokens.next()
        return testtoken


class TestSendActivationEmail(TestCase):
    def setUp(self):
        self.testuser = create_user('testuser', email='testuser@example.com')

    def test_generate_token(self):
        token = InviteUrlMock(request=mock.MagicMock(), metadata={'test': 10}, private=True).generate_token()
        self.assertEquals(token.get_metadata(), {'test': 10})

    def test_send_email(self):
        testrequest = mock.MagicMock()
        testrequest.build_absolute_uri = lambda path: 'http://testserver{}'.format(path)

        with self.settings(DJANGO_CRADMIN_SITENAME='Testsite'):
            InviteUrlWithStaticTokenMock(request=testrequest, metadata={'test', 10}, private=True)\
                .send_email('test@example.com')
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, 'Invitation to Testsite')
        expected_email_body = """
Click the link below to accept the invite.

http://testserver/invite/accept/test-token""".strip()
        self.assertEqual(mail.outbox[0].body, expected_email_body)

    def test_send_email_private(self):
        testrequest = mock.MagicMock()
        testrequest.build_absolute_uri = lambda path: 'http://testserver{}'.format(path)

        with self.settings(DJANGO_CRADMIN_SITENAME='Testsite'):
            inviteurl = InviteUrlWithTokenIteratorMock(request=testrequest, metadata={'test', 10}, private=True)
            inviteurl.send_email('test1@example.com', 'test2@example.com', 'test3@example.com')
        self.assertIn('token1', mail.outbox[0].body)
        self.assertIn('token2', mail.outbox[1].body)
        self.assertIn('token3', mail.outbox[2].body)

    def test_send_email_public(self):
        testrequest = mock.MagicMock()
        testrequest.build_absolute_uri = lambda path: 'http://testserver{}'.format(path)

        with self.settings(DJANGO_CRADMIN_SITENAME='Testsite'):
            inviteurl = InviteUrlWithTokenIteratorMock(request=testrequest, metadata={'test', 10}, private=False)
            inviteurl.send_email('test1@example.com', 'test2@example.com', 'test3@example.com')
        self.assertIn('token1', mail.outbox[0].body)
        self.assertIn('token1', mail.outbox[1].body)
        self.assertIn('token1', mail.outbox[2].body)

    def test_get_share_url(self):
        testrequest = mock.MagicMock()
        testrequest.build_absolute_uri = lambda path: 'http://testserver{}'.format(path)
        self.assertEqual(
            InviteUrlWithStaticTokenMock(request=testrequest, metadata={'test', 10}, private=True).get_share_url(),
            'http://testserver/invite/accept/test-token')

    def test_get_share_url_private(self):
        testrequest = mock.MagicMock()
        testrequest.build_absolute_uri = lambda path: 'http://testserver{}'.format(path)
        inviteurl = InviteUrlWithTokenIteratorMock(request=testrequest, metadata={'test', 10}, private=True)
        self.assertEqual(inviteurl.get_share_url(), 'http://testserver/invite/accept/token1')
        self.assertEqual(inviteurl.get_share_url(), 'http://testserver/invite/accept/token2')
        self.assertEqual(inviteurl.get_share_url(), 'http://testserver/invite/accept/token3')

    def test_get_share_url_public(self):
        testrequest = mock.MagicMock()
        testrequest.build_absolute_uri = lambda path: 'http://testserver{}'.format(path)
        inviteurl = InviteUrlWithTokenIteratorMock(request=testrequest, metadata={'test', 10}, private=False)
        self.assertEqual(inviteurl.get_share_url(), 'http://testserver/invite/accept/token1')
        self.assertEqual(inviteurl.get_share_url(), 'http://testserver/invite/accept/token1')
        self.assertEqual(inviteurl.get_share_url(), 'http://testserver/invite/accept/token1')
