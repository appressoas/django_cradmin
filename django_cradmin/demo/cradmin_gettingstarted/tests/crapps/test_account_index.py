from django.conf import settings
from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.cradmin_gettingstarted.crapps import AccountIndexView


class TestAccountIndexView(TestCase, cradmin_testhelpers.TestCaseMixin):
    """"""
    viewclass = AccountIndexView

    def test_get_title(self):
        account = mommy.make('cradmin_gettingstarted.Account', account_name='My account')
        mommy.make(
            'cradmin_gettingstarted.AccountAdministrator',
            account=account,
            user=mommy.make(settings.AUTH_USER_MODEL)
        )
        mockresponse = self.mock_getrequest(
            htmls_selector=True,
            cradmin_role=account
        )
        page_title = mockresponse.selector.one('title').alltext_normalized
        self.assertEqual(account.account_name, page_title)
