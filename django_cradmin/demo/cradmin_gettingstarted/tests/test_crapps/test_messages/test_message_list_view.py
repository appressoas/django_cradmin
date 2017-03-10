from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers


class TestMessageListView(TestCase, cradmin_testhelpers.TestCaseMixin):
    """"""

    def setUp(self):
        self.account = mommy.make('cradmin_gettingstarted.Account', name='My Account')

    def test_wtf(self):
        print(self.account.name)