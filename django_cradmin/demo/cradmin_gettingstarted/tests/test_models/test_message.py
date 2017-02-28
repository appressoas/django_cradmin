from django import test
from model_mommy import mommy

from django_cradmin.demo.cradmin_gettingstarted.models import Message


class TestMessageModel(test.TestCase):

    def test_simple_create_success(self):
        self.assertEqual(0, Message.objects.count())
        mommy.make('cradmin_gettingstarted.Message')
        self.assertEqual(1, Message.objects.count())

    def test_has_expected_attributes(self):
        my_object = mommy.make('cradmin_gettingstarted.Message')
        self.assertTrue(hasattr(my_object, 'title'))
        self.assertTrue(hasattr(my_object, 'account'))
        self.assertTrue(hasattr(my_object, 'body'))
        self.assertTrue(hasattr(my_object, 'tag'))
        self.assertTrue(hasattr(my_object, 'creation_time'))
        self.assertTrue(hasattr(my_object, 'number_of_likes'))

    def test_str_method(self):
        my_object = mommy.make('cradmin_gettingstarted.Message', title='foo')
        self.assertEqual('foo', str(my_object))
