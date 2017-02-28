
from django import test
from model_mommy import mommy

from django_cradmin.demo.cradmin_gettingstarted.models import Tag


class TestTagModel(test.TestCase):

    def test_simple_create_success(self):
        self.assertEqual(0, Tag.objects.count())
        mommy.make('cradmin_gettingstarted.Tag')
        self.assertEqual(1, Tag.objects.count())

    def test_has_expected_attributes(self):
        my_object = mommy.make('cradmin_gettingstarted.Tag')
        self.assertTrue(hasattr(my_object, 'tag'))
        self.assertTrue(hasattr(my_object, 'consumable'))

    def test_str_method(self):
        my_object = mommy.make('cradmin_gettingstarted.Tag', tag='foo')
        self.assertEqual('foo', str(my_object))