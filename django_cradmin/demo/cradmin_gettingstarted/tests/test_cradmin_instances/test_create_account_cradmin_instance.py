from unittest import mock

from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from django.test import TestCase
from model_mommy import mommy

from django_cradmin.demo.cradmin_gettingstarted.cradmin_instances\
    .create_account_cradmin_instance import CreateAccountCrAdminInstance


class TestCreateAccountCradminInstance(TestCase):
    """
    Tests that only authenticated users has access to CRamin instance
    """

    def test_none_super_user_has_access(self):
        mockrequest = mock.MagicMock()
        mockrequest.user = mommy.make(settings.AUTH_USER_MODEL)
        cradmin_instance = CreateAccountCrAdminInstance(request=mockrequest)
        self.assertTrue(cradmin_instance.has_access())

    def test_unauthenticated_user_no_access(self):
        mockrequest = mock.MagicMock()
        mockrequest.user = AnonymousUser()
        crinstance = CreateAccountCrAdminInstance(request=mockrequest)
        self.assertFalse(mockrequest.user.is_authenticated())
        self.assertFalse(crinstance.has_access())
