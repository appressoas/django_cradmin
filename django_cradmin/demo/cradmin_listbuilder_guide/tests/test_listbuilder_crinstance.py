from unittest import mock

from django.conf import settings
from django.test import TestCase
from model_mommy import mommy

from django_cradmin.demo.cradmin_listbuilder_guide.listbuilder_crinstance import ListbuilderCradminInstance


class TestListbuilderCradminInstance(TestCase):
    """"""

    def test_empty_rolequeryset_sanity(self):
        """Should return empty role queryset since use is not album admin"""
        mockrequest = mock.MagicMock()
        mockrequest.user = mommy.make(settings.AUTH_USER_MODEL)
        crinstance = ListbuilderCradminInstance(request=mockrequest)
        self.assertEqual(0, crinstance.get_rolequeryset().count())

    def test_user_in_rolequeryset_sanity(self):
        """Should have one user in role queryset since user is album admin"""
        user = mommy.make(settings.AUTH_USER_MODEL)
        album = mommy.make('cradmin_listbuilder_guide.Album')
        mommy.make(
            'cradmin_listbuilder_guide.AlbumAdministrator',
            user=user,
            album=album
        )
        mockrequest = mock.MagicMock()
        mockrequest.user = user
        crinstance = ListbuilderCradminInstance(request=mockrequest)
        self.assertEqual(1, crinstance.get_rolequeryset().count())
