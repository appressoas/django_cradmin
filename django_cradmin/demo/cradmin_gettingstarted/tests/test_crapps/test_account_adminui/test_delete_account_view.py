from django.conf import settings
from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.cradmin_gettingstarted.crapps.account_adminui import delete_account_view
from django_cradmin.demo.cradmin_gettingstarted.models import Account


class TestDeleteAccountView(TestCase, cradmin_testhelpers.TestCaseMixin):
    viewclass = delete_account_view.AccountDeleteView

    def test_get_sanity(self):
        account = mommy.make(
            'cradmin_gettingstarted.Account',
            account_name='My Account'
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
            account_name='Another Account'
        )
        self.assertEqual(1, Account.objects.count())
        self.mock_http302_postrequest(
            cradmin_role=account
        )
        self.assertEqual(0, Account.objects.count())

    def test_post_sanity_with_multiple_accounts(self):
        account = mommy.make(
            'cradmin_gettingstarted.Account',
            account_name='Delete me'
        )
        mommy.make(
            'cradmin_gettingstarted.Account',
            _quantity=10
        )
        self.assertEqual(11, Account.objects.count())
        self.mock_http302_postrequest(
            cradmin_role=account
        )
        self.assertFalse(Account.objects.filter(account_name='Delete me'))
        self.assertEqual(10, Account.objects.count())