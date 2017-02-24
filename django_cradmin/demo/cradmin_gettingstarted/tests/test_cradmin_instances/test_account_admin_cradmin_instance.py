from unittest import mock

from django.conf import settings
from django.test import TestCase
from model_mommy import mommy

from django_cradmin.demo.cradmin_gettingstarted.cradmin_instances\
    .account_admin_cradmin_instance import AccountAdminCradminInstance


class TestAccountAdminCradminInstance(TestCase):
    def test_none_super_user_makes_empty_rolequeryset(self):
        mommy.make('cradmin_gettingstarted.Account')
        mockrequest = mock.MagicMock()
        mockrequest.user = mommy.make(settings.AUTH_USER_MODEL)
        cradmin_instance = AccountAdminCradminInstance(request=mockrequest)
        self.assertEqual(0, cradmin_instance.get_rolequeryset().count())

    def test_user_is_in_rolequeryset(self):
        user = mommy.make(settings.AUTH_USER_MODEL)
        account = mommy.make('cradmin_gettingstarted.Account')
        mommy.make(
            'cradmin_gettingstarted.AccountAdministrator',
            account=account,
            user=user
        )
        mockrequest = mock.MagicMock()
        mockrequest.user = user
        cradmin_instance = AccountAdminCradminInstance(request=mockrequest)
        self.assertEqual(1, cradmin_instance.get_rolequeryset().count())

