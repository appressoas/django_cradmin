from django import test
from model_mommy import mommy

from django_cradmin.demo.cradmin_listbuilder_guide.models import AlbumAdministrator


class TestAlbumAdministratorModel(test.TestCase):
    """Simple creation and attributes test of model"""

    def test_simple_create_success(self):
        self.assertEqual(0, AlbumAdministrator.objects.count())
        mommy.make('cradmin_listbuilder_guide.AlbumAdministrator')
        self.assertEqual(1, AlbumAdministrator.objects.count())

    def test_has_expected_attributes(self):
        my_object = mommy.make('cradmin_listbuilder_guide.AlbumAdministrator')
        self.assertTrue(hasattr(my_object, 'user'))
        self.assertTrue(hasattr(my_object, 'album'))
