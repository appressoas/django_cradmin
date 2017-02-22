from django.conf import settings
from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.cradmin_gettingstarted.crapps.account_adminui import account_index_view


class TestAccountIndexView(TestCase, cradmin_testhelpers.TestCaseMixin):
    """"""
    viewclass = account_index_view.AccountIndexView

    def test_get_title(self):
        account = mommy.make(
            'cradmin_gettingstarted.Account',
            account_name='My account'
        )
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

    def test_get_heading(self):
        account = mommy.make('cradmin_gettingstarted.Account', account_name='Test Account')
        mommy.make(
            'cradmin_gettingstarted.AccountAdministrator',
            account=account,
            user=mommy.make(settings.AUTH_USER_MODEL)
        )
        mockresponse = self.mock_http200_getrequest_htmls(
            cradmin_role=account
        )
        self.assertTrue(mockresponse.selector.one('.test-primary-h1'))
        heading = mockresponse.selector.one('.test-primary-h1').alltext_normalized
        self.assertEqual(account.account_name, heading)

    def test_only_account_where_user_is_admin_shows_on_page(self):
        account_one = mommy.make('cradmin_gettingstarted.Account', account_name='Wrong role account')
        account_two= mommy.make('cradmin_gettingstarted.Account', account_name='Right role account')
        mommy.make(
            'cradmin_gettingstarted.AccountAdministrator',
            account=account_one,
            user=mommy.make(settings.AUTH_USER_MODEL, email='not_me@example.com')
        )
        mommy.make(
            'cradmin_gettingstarted.AccountAdministrator',
            account=account_two,
            user=mommy.make(settings.AUTH_USER_MODEL, email='me@example.com')
        )
        mockresponse = self.mock_http200_getrequest_htmls(
            cradmin_role=account_two)
        self.assertTrue(mockresponse.selector.one('.test-admin-user-email'))
        admin_email = mockresponse.selector.one('.test-admin-user-email').alltext_normalized
        self.assertEqual('me@example.com', admin_email)




















