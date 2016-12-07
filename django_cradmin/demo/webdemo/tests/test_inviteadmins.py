from __future__ import unicode_literals

from django.core import mail
from django.test import TestCase
from django_cradmin import cradmin_testhelpers
from django_cradmin.apps.cradmin_generic_token_with_metadata.models import GenericTokenWithMetadata
from django_cradmin.demo.webdemo.crapps import inviteadmins
from model_mommy import mommy


class TestInviteAdmins(TestCase, cradmin_testhelpers.TestCaseMixin):
    viewclass = inviteadmins.send.SendInvitesView

    def test_post_invalid_email_no_invite_sent(self):
        self.assertEqual(GenericTokenWithMetadata.objects.count(), 0)
        self.mock_http200_postrequest_htmls(
            requestkwargs={'data': {'emails': 'invalid'}},
            cradmin_role=mommy.make('webdemo.Site'))
        self.assertEqual(GenericTokenWithMetadata.objects.count(), 0)
        self.assertEqual(len(mail.outbox), 0)

    def test_post_invalid_email_errormessage(self):
        mockresponse = self.mock_http200_postrequest_htmls(
            requestkwargs={'data': {'emails': 'invalid'}},
            cradmin_role=mommy.make('webdemo.Site'))
        self.assertIn(
            'Invalid email address: invalid',
            mockresponse.selector.one('form').alltext_normalized)

    def test_post_no_emails_no_invite_sent(self):
        self.assertEqual(GenericTokenWithMetadata.objects.count(), 0)
        self.mock_http200_postrequest(
            requestkwargs={'data': {'emails': ''}},
            cradmin_role=mommy.make('webdemo.Site'))
        self.assertEqual(GenericTokenWithMetadata.objects.count(), 0)
        self.assertEqual(len(mail.outbox), 0)

    def test_post_no_emails_errormessage(self):
        mockresponse = self.mock_http200_postrequest_htmls(
            requestkwargs={'data': {'emails': ''}},
            cradmin_role=mommy.make('webdemo.Site'))
        self.assertIn(
            'This field is required.',
            mockresponse.selector.one('form').alltext_normalized)

    def test_post_send_invites(self):
        self.assertEqual(GenericTokenWithMetadata.objects.count(), 0)
        self.mock_http302_postrequest(
            requestkwargs={'data': {'emails': 'test1@example.com, test2@example.com'}},
            cradmin_role=mommy.make('webdemo.Site'))
        self.assertEqual(GenericTokenWithMetadata.objects.count(), 2)
        self.assertEqual(len(mail.outbox), 2)
        self.assertEqual(mail.outbox[0].to, [u'test1@example.com'])
        self.assertEqual(mail.outbox[1].to, [u'test2@example.com'])
