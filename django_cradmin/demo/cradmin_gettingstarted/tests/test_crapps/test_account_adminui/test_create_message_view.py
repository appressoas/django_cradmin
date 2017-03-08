from django.test import TestCase

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.cradmin_gettingstarted.crapps.account_adminui.create_message_view import CreateMessageView


class TestCreateMessageView(TestCase, cradmin_testhelpers.TestCaseMixin):
    viewclass = CreateMessageView

    def test_get_form_sanity(self):
        """Is the fields in the form"""
        mockresponse = self.mock_http200_getrequest_htmls()
        self.assertTrue(mockresponse.selector.one('#id_title_label'))
        self.assertTrue(mockresponse.selector.one('#id_body_label'))
        self.assertTrue(mockresponse.selector.one('.test-submit-primary'))
