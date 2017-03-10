from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.cradmin_gettingstarted.crapps.messages import message_edit_views
from django_cradmin.demo.cradmin_gettingstarted.models import Message


class TestMessageCreateView(TestCase, cradmin_testhelpers.TestCaseMixin):
    """
    Simple Create Message View tests for the CRadmin application 'messages'
    """
    viewclass = message_edit_views.CreateMessageView

    def setUp(self):
        self.account = mommy.make('cradmin_gettingstarted.Account', name='My Account')

    def get_form_title_sanity(self):
        mockresponse = self.mock_http200_getrequest_htmls(
            cradmin_role=self.account
        )
        self.assertEqual('Create message', mockresponse.selector.one('.test-primary-h1').text_normalized)

    def test_post_form_without_required_title(self):
        mockresponse = self.mock_http200_postrequest_htmls(
            cradmin_role=self.account,
            requestkwargs={
                'data': {
                    'title': '',
                    'body': 'Iron Maiden'
                }
            }
        )
        self.assertTrue(mockresponse.selector.one('#id_title_wrapper'))
        self.assertEqual('This field is required.',
                         mockresponse.selector.one('#id_title_wrapper .test-warning-message').alltext_normalized)

    def test_post_form_without_required_body(self):
        mockresponse = self.mock_http200_postrequest_htmls(
            cradmin_role=self.account,
            requestkwargs={
                'data': {
                    'title': 'Metallica',
                    'body': ''
                }
            }
        )
        self.assertTrue(mockresponse.selector.one('#id_body_wrapper'))
        self.assertEqual('This field is required.',
                         mockresponse.selector.one('#id_body_wrapper .test-warning-message').alltext_normalized)

    def test_post_form_success(self):
        self.mock_http302_postrequest(
            cradmin_role=self.account,
            requestkwargs={
                'data': {
                    'title': 'Metal Forever',
                    'body': 'Yeah!'
                }
            }
        )
        self.assertEqual(1, Message.objects.all().count())
