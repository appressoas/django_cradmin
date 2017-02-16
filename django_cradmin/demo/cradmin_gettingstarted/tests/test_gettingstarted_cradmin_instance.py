from unittest import mock

from django.conf import settings
from django.test import TestCase
from model_mommy import mommy

from django_cradmin.demo.cradmin_gettingstarted.gettingstarted_cradmin_instance import GettingStartedCradminInstance


class TestGettingStartedCradminInstance(TestCase):
    def test_none_super_user_makes_empty_rolequeryset(self):
        mommy.make('cradmin_gettingstarted.Account')
        mockrequest = mock.MagicMock()
        mockrequest.user = mommy.make(settings.AUTH_USER_MODEL)
        cradmin_instance = GettingStartedCradminInstance(request=mockrequest)
        self.assertEqual(0, len(cradmin_instance.get_rolequeryset().all()))
