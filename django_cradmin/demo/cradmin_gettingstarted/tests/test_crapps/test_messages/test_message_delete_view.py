from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.cradmin_gettingstarted.crapps.messages import message_edit_views
from django_cradmin.demo.cradmin_gettingstarted.models import Message


class TestMessageDeleteView(TestCase, cradmin_testhelpers.TestCaseMixin):
    """
    Simple Delete Message View tests for the CRadmin application 'messages'
    """
    viewclass = message_edit_views.MessageDeleteView

    def setUp(self):
        self.account = mommy.make('cradmin_gettingstarted.Account', name='My Account')
        self.message = mommy.make(
            'cradmin_gettingstarted.Message',
            title='My message',
            account=self.account
        )

    def test_get_form_sanity(self):
        mockresponse = self.mock_http200_getrequest_htmls(
            cradmin_role=self.account,
            viewkwargs={'pk': self.message.id}
        )
        self.assertEqual('Confirm delete', mockresponse.selector.one('title').text_normalized)
        self.assertEqual('Confirm delete', mockresponse.selector.one('.test-primary-h1').text_normalized)

    def test_deleteview_question_sanity(self):
        mockresponse = self.mock_http200_getrequest_htmls(
            cradmin_role=self.account,
            viewkwargs={'pk': self.message.id}
        )
        self.assertTrue(mockresponse.selector.one('#id_deleteview_question'))
        question = mockresponse.selector.one('#id_deleteview_question').alltext_normalized
        self.assertEqual('Are you sure you want to delete "{}"?'.format(self.message.title), question)

    def test_message_deleted_sanity(self):
        another_message = mommy.make(
            'cradmin_gettingstarted.Message',
            account=self.account,
            title='Delete me not'
        )
        self.assertEqual(2, Message.objects.all().count())
        self.mock_http302_postrequest(
            cradmin_role=self.account,
            viewkwargs={'pk': self.message.id}
        )
        self.assertEqual(1, Message.objects.all().count())
        self.assertFalse(Message.objects.filter(pk=self.message.id))
        self.assertTrue(Message.objects.get(pk=another_message.id))
