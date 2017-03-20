
from django import test
from model_mommy import mommy

from django_cradmin.demo.cradmin_listbuilder_guide.models import Album


class TestAlbumModel(test.TestCase):
    """Simple creation, attributes and str test of model"""

    def test_simple_create_success(self):
        self.assertEqual(0, Album.objects.count())
        mommy.make('cradmin_listbuilder_guide.Album')
        self.assertEqual(1, Album.objects.count())

    def test_has_expected_attributes(self):
        my_object = mommy.make('cradmin_listbuilder_guide.Album')
        self.assertTrue(hasattr(my_object, 'title'))
        self.assertTrue(hasattr(my_object, 'released_by'))
        self.assertTrue(hasattr(my_object, 'year'))

    def test_str_method(self):
        my_object = mommy.make('cradmin_listbuilder_guide.Album', title='foo')
        self.assertEqual('foo', str(my_object))