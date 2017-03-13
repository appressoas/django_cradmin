from django import test
from model_mommy import mommy

from django_cradmin.demo.cradmin_listbuilder_guide.models import Song


class TestSongModel(test.TestCase):

    def test_simple_create_success(self):
        self.assertEqual(0, Song.objects.count())
        mommy.make('cradmin_listbuilder_guide.Song')
        self.assertEqual(1, Song.objects.count())

    def test_has_expected_attributes(self):
        my_object = mommy.make('cradmin_listbuilder_guide.Song')
        self.assertTrue(hasattr(my_object, 'title'))

    def test_str_method(self):
        my_object = mommy.make('cradmin_listbuilder_guide.Song', title='foo')
        self.assertEqual('foo', str(my_object))