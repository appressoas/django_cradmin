from datetime import datetime, timedelta
from django.test import TestCase
from django.utils import timezone
import mock
from django_cradmin.apps.cradmin_user_single_use_token.models import UserSingleUseToken, generate_token
from django_cradmin.tests.helpers import create_user


class TestUserSingleUseToken(TestCase):
    def _create_user_single_use_token(self, created_datetime=None, expiration_datetime=None, app='testapp', **kwargs):
        user_single_use_token = UserSingleUseToken.objects.create(
            created_datetime=(created_datetime or timezone.now()),
            expiration_datetime=(expiration_datetime or (timezone.now() + timedelta(days=2))),
            app=app,
            **kwargs)
        return user_single_use_token

    def test_generate_token(self):
        self.assertEqual(len(generate_token()), 73)
        self.assertNotEqual(generate_token(), generate_token())

    def test_generate(self):
        testuser = create_user('testuser')
        unique_user_token = UserSingleUseToken.objects.generate(user=testuser, app='testapp')
        self.assertEqual(unique_user_token.user, testuser)
        self.assertEqual(unique_user_token.app, 'testapp')
        self.assertEqual(len(unique_user_token.token), 73)

    def test_generate_handle_not_unique(self):
        self._create_user_single_use_token(user=create_user('testuser1'), app='testapp1', token='taken')
        with mock.patch('django_cradmin.apps.cradmin_user_single_use_token.models.generate_token',
                        iter(['taken', 'free']).next):
            unique_user_token = UserSingleUseToken.objects.generate(user=create_user('testuser2'), app='testapp2')
        self.assertEqual(unique_user_token.token, 'free')

    def test_unsafe_pop(self):
        testuser = create_user('testuser')
        self._create_user_single_use_token(user=testuser, app='testapp1', token='test-token1')
        self._create_user_single_use_token(user=testuser, app='testapp2', token='test-token2')
        self.assertEquals(UserSingleUseToken.objects.unsafe_pop(token='test-token1', app='testapp1'), testuser)
        self.assertEquals(UserSingleUseToken.objects.count(), 1)
        self.assertEquals(UserSingleUseToken.objects.unsafe_pop(token='test-token2', app='testapp2'), testuser)
        self.assertEquals(UserSingleUseToken.objects.count(), 0)

    def test_filter_not_expired(self):
        unexpired_user_single_use_token = self._create_user_single_use_token(
            user=create_user('testuser1'), token='test-token1',
            expiration_datetime=datetime(2015, 1, 1, 14, 30))
        self._create_user_single_use_token(
            user=create_user('testuser2'), token='test-token2',
            expiration_datetime=datetime(2015, 1, 1, 13, 30))

        with mock.patch('django_cradmin.apps.cradmin_user_single_use_token.models._get_current_datetime',
                        lambda: datetime(2015, 1, 1, 14)):
            self.assertEquals(UserSingleUseToken.objects.filter_not_expired().count(), 1)
            self.assertEquals(UserSingleUseToken.objects.filter_not_expired().first(),
                              unexpired_user_single_use_token)

    def test_filter_has_expired(self):
        self._create_user_single_use_token(
            user=create_user('testuser1'),
            app='testapp', token='test-token1',
            expiration_datetime=datetime(2015, 1, 1, 14, 30))
        expired_user_single_use_token = self._create_user_single_use_token(
            user=create_user('testuser2'),
            app='testapp', token='test-token2',
            expiration_datetime=datetime(2015, 1, 1, 13, 30))

        with mock.patch('django_cradmin.apps.cradmin_user_single_use_token.models._get_current_datetime',
                        lambda: datetime(2015, 1, 1, 14)):
            self.assertEquals(UserSingleUseToken.objects.filter_has_expired().count(), 1)
            self.assertEquals(UserSingleUseToken.objects.filter_has_expired().first(),
                              expired_user_single_use_token)

    def test_filter_pop_not_expired(self):
        testuser = create_user('testuser')
        self._create_user_single_use_token(
            user=testuser, token='test-token',
            expiration_datetime=datetime(2015, 1, 1, 14, 30))

        with mock.patch('django_cradmin.apps.cradmin_user_single_use_token.models._get_current_datetime',
                        lambda: datetime(2015, 1, 1, 14)):
            self.assertEquals(UserSingleUseToken.objects.pop(app='testapp', token='test-token'), testuser)

    def test_filter_pop_expired(self):
        self._create_user_single_use_token(
            user=create_user('testuser'),
            app='testapp', token='test-token',
            expiration_datetime=datetime(2015, 1, 1, 13, 30))

        with mock.patch('django_cradmin.apps.cradmin_user_single_use_token.models._get_current_datetime',
                        lambda: datetime(2015, 1, 1, 14)):
            with self.assertRaises(UserSingleUseToken.DoesNotExist):
                UserSingleUseToken.objects.pop(app='testapp', token='test-token')
