from django import test
from model_mommy import mommy

from django_cradmin.demo.cradmin_gettingstarted.models import Account


class TestAccountModel(test.TestCase):

    def test_simple_create_success(self):
        self.assertEqual(0, Account.objects.count())
        mommy.make('cradmin_gettingstarted.Account')
        self.assertEqual(1, Account.objects.count())

    def test_has_expected_attributes(self):
        my_object = mommy.make('cradmin_gettingstarted.Account')
        self.assertTrue(hasattr(my_object, 'account_name'))

    def test_str_method(self):
        my_object = mommy.make('cradmin_gettingstarted.Account', account_name='foo')
        self.assertEqual('foo', str(my_object))
