from datetime import timedelta, datetime
from django.contrib import messages
from django.test import TestCase, RequestFactory
from django.utils import timezone
import htmls
import mock
from django_cradmin.apps.cradmin_generic_token_with_metadata.models import GenericTokenWithMetadata

from django_cradmin.apps.cradmin_invite.baseviews.accept import AbstractAcceptInviteView


class AcceptInviteView(AbstractAcceptInviteView):
    def get_appname(self):
        return 'testapp'


class TestAbstractAcceptInviteView(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        # request._messages = mock.MagicMock()

    def __create_token(self, metadata=None, expiration_datetime=None, **kwargs):
        generic_token_with_metadata = GenericTokenWithMetadata(
            created_datetime=timezone.now(),
            expiration_datetime=(expiration_datetime or (timezone.now() + timedelta(days=2))),
            app='testapp',
            **kwargs)
        generic_token_with_metadata.set_metadata(metadata or {})
        generic_token_with_metadata.save()
        return generic_token_with_metadata

    def test_get_expired_token(self):
        self.__create_token(
            token='valid-token',
            expiration_datetime=datetime(2014, 1, 1))
        request = self.factory.get('/test')
        response = AcceptInviteView.as_view()(request, token='valid-token')
        selector = htmls.S(response.content)
        self.assertTrue(selector.exists('#django_cradmin_invite_expired_message'))
        self.assertEqual(
            selector.one('#django_cradmin_invite_expired_message').alltext_normalized,
            'This invite link has expired.')

    def test_get_invalid_token(self):
        self.__create_token(
            token='valid-token')
        request = self.factory.get('/test')
        response = AcceptInviteView.as_view()(request, token='invalid-token')
        selector = htmls.S(response.content)
        self.assertTrue(selector.exists('#django_cradmin_invite_invalid_token_message'))
        self.assertEqual(
            selector.one('#django_cradmin_invite_invalid_token_message').alltext_normalized,
            'Invalid invite URL. Are you sure you copied the entire URL from the email?')

    def test_get_render(self):
        request = self.factory.get('/test')
        token = self.__create_token()
        response = AcceptInviteView.as_view()(request, token=token.token)
        self.assertEqual(response.status_code, 200)
        response.render()
        selector = htmls.S(response.content)
        self.assertEqual(selector.one('title').alltext_normalized, 'Accept invite')
        self.assertEqual(selector.one('.page-header h1').alltext_normalized, 'Accept invite')
        self.assertEqual(
            selector.one('#django_cradmin_invite_accept_description').alltext_normalized,
            'TODO: Set a description_template for your AbstractAcceptInviteView subclass.')
