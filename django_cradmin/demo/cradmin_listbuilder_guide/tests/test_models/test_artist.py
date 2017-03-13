from django import test
from model_mommy import mommy

from django_cradmin.demo.cradmin_listbuilder_guide.models import Artist


class TestArtistModel(test.TestCase):

    def test_simple_create_success(self):
        self.assertEqual(0, Artist.objects.count())
        mommy.make('cradmin_listbuilder_guide.Artist')
        self.assertEqual(1, Artist.objects.count())

    def test_has_expected_attributes(self):
        my_object = mommy.make('cradmin_listbuilder_guide.Artist')
        self.assertTrue(hasattr(my_object, 'name'))

    def test_str_method(self):
        my_object = mommy.make('cradmin_listbuilder_guide.Artist', name='foo')
        self.assertEqual('foo', str(my_object))