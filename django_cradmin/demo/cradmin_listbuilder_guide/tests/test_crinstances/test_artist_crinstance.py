from unittest import mock

from django.conf import settings
from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.cradmin_listbuilder_guide.cradmin_instances import artist_crinstance


class TestArtistCradminInstance(TestCase):
    """"""

    def test_no_superuser_returns_empty_rolequeryset(self):
        mommy.make('cradmin_listbuilder_guide.Artist')
        mockrequest = mock.MagicMock()
        mockrequest.user = mommy.make(settings.AUTH_USER_MODEL)
        crinstance = artist_crinstance.ArtistCradminInstance(request=mockrequest)
        self.assertEqual(0, crinstance.get_rolequeryset().count())

    def test_one_user_is_in_rolequeryset(self):
        user = mommy.make(settings.AUTH_USER_MODEL)
        user_two = mommy.make(settings.AUTH_USER_MODEL)
        mommy.make('cradmin_listbuilder_guide.Artist', admins=[user, user_two])
        mockrequest = mock.MagicMock()
        mockrequest.user = user
        crinstance = artist_crinstance.ArtistCradminInstance(request=mockrequest)
        self.assertEqual(1, crinstance.get_rolequeryset().count())