import mock
from django.conf import settings
from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.cradmin_gettingstarted.crapps import create_account


class TestCreateAccountDashboard(TestCase, cradmin_testhelpers.TestCaseMixin):
    viewclass = create_account.CreateAccountDashboardView

    def test_not_logged_in_user_gets_error_message(self):
        mockresponse = self.mock_http200_getrequest_htmls()
        self.assertTrue(mockresponse.selector.one('.test-not-authenticated-user'))
        error_message = mockresponse.selector.one('.test-not-authenticated-user').text_normalized
        self.assertEqual('You need to be logged in as a registered user to get access.', error_message)

    def test_logged_in_user_email_in_template(self):
        request_user = mock.MagicMock()
        request_user.email = 'mail@example.com'
        mockresponse = self.mock_http200_getrequest_htmls(
            requestuser=request_user
        )
        self.assertTrue(mockresponse.selector.one('.test-authenticated-user'))
        email_in_template = mockresponse.selector.one('.test-authenticated-user').text_normalized
        self.assertEqual(request_user.email, email_in_template)