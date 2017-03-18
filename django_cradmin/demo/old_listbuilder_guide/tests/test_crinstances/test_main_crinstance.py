from unittest import mock

from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from django.test import TestCase
from model_mommy import mommy

from django_cradmin.demo.cradmin_listbuilder_guide.cradmin_instances import main_crinstance


class TestMainCRadminInstance(TestCase):
    """"""

    def test_authenticated_user_has_access(self):
        """An authenticaed user should get access"""
        mockrequest = mock.MagicMock()
        mockrequest.user = mommy.make(settings.AUTH_USER_MODEL)
        crinstance = main_crinstance.MainCradminInstance(request=mockrequest)
        self.assertTrue(crinstance.has_access())

    def test_no_access_when_unathorized_user(self):
        """An anonymous user shold not get access"""
        mockrequest = mock.MagicMock()
        mockrequest.user = AnonymousUser()
        crinstance = main_crinstance.MainCradminInstance(request=mockrequest)
        self.assertFalse(crinstance.has_access())

