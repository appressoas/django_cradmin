from django import test
from model_mommy import mommy

from django_cradmin.demo.cradmin_gettingstarted.models import AccountAdministrator


class TestAccountAdministratorModel(test.TestCase):

    def test_simple_create_success(self):
        self.assertEqual(0, AccountAdministrator.objects.count())
        mommy.make('cradmin_gettingstarted.AccountAdministrator')
        self.assertEqual(1, AccountAdministrator.objects.count())

    def test_has_expected_attributes(self):
        my_object = mommy.make('cradmin_gettingstarted.AccountAdministrator')
        self.assertTrue(hasattr(my_object, 'user'))
        self.assertTrue(hasattr(my_object, 'account'))
