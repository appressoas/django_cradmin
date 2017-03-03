from django.conf import settings
from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin import crinstance
from django_cradmin.demo.cradmin_gettingstarted.crapps.account_adminui import delete_account_view
from django_cradmin.demo.cradmin_gettingstarted.models import Account


class TestDeleteAccountView(TestCase, cradmin_testhelpers.TestCaseMixin):
    viewclass = delete_account_view.AccountDeleteView

    def test_get_sanity(self):
        account = mommy.make(
            'cradmin_gettingstarted.Account',
            name='My Account'
        )
        mockresponse = self.mock_http200_getrequest_htmls(
            cradmin_role=account,
        )
        self.assertTrue(mockresponse.selector.one('#id_deleteview_question'))
        delete_question = mockresponse.selector.one('#id_deleteview_question').alltext_normalized
        self.assertEqual('Are you sure you want to delete "My Account"?', delete_question)

    def test_post_sanity_with_one_account(self):
        account = mommy.make(
            'cradmin_gettingstarted.Account',
            name='Another Account'
        )
        self.assertEqual(1, Account.objects.count())
        self.mock_http302_postrequest(
            cradmin_role=account
        )
        self.assertEqual(0, Account.objects.count())

    def test_post_sanity_with_multiple_accounts(self):
        account = mommy.make(
            'cradmin_gettingstarted.Account',
            name='Delete me'
        )
        mommy.make(
            'cradmin_gettingstarted.Account',
            _quantity=10
        )
        self.assertEqual(11, Account.objects.count())
        self.mock_http302_postrequest(
            cradmin_role=account
        )
        self.assertFalse(Account.objects.filter(name='Delete me'))
        self.assertEqual(10, Account.objects.count())

    def test_success_url_after_delete_when_one_account(self):
        account = mommy.make(
            'cradmin_gettingstarted.Account',
            name='Delete me'
        )
        mommy.make(
            'cradmin_gettingstarted.AccountAdministrator',
            account=account,
            user=mommy.make(settings.AUTH_USER_MODEL)
        )
        mockresponse = self.mock_http302_postrequest(cradmin_role=account)
        self.assertEqual(mockresponse.response['location'],
                         crinstance.reverse_cradmin_url(instanceid='create_account',
                                                        appname='dashboard'))

    def test_success_url_after_delete_when_three_accounts_for_one_admin(self):
        account_one = mommy.make('cradmin_gettingstarted.Account')
        account_two = mommy.make('cradmin_gettingstarted.Account')
        account_three = mommy.make('cradmin_gettingstarted.Account')
        user = mommy.make(settings.AUTH_USER_MODEL)
        mommy.make(
            'cradmin_gettingstarted.AccountAdministrator',
            account=account_one,
            user=user
        )
        mommy.make(
            'cradmin_gettingstarted.AccountAdministrator',
            account=account_two,
            user=user
        )
        mommy.make(
            'cradmin_gettingstarted.AccountAdministrator',
            account=account_three,
            user=user
        )
        mockresponse = self.mock_http302_postrequest(cradmin_role=account_two)
        self.assertEqual(mockresponse.response['location'],
                         crinstance.reverse_cradmin_url(instanceid='create_account',
                                                        appname='dashboard'))
