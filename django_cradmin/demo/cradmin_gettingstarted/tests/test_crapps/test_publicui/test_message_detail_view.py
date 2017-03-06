from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.cradmin_gettingstarted.crapps.publicui.message_detail_view import MessageDetailView


class TestMessageDetailView(TestCase, cradmin_testhelpers.TestCaseMixin):
    viewclass = MessageDetailView

    def test_primary_h1(self):
        message = mommy.make('cradmin_gettingstarted.Message')
        mockresponse = self.mock_http200_getrequest_htmls(
            viewkwargs={'pk': message.pk}
        )
        self.assertTrue(mockresponse.selector.one('.test-primary-h1'))
        h1_in_template = mockresponse.selector.one('.test-primary-h1').text_normalized
        self.assertEqual('Message Details', h1_in_template)

    def test_posted_by_sanity(self):
        account = mommy.make('cradmin_gettingstarted.Account', name='My Account')
        message = mommy.make('cradmin_gettingstarted.Message', account=account)
        mockresponse = self.mock_http200_getrequest_htmls(
            viewkwargs={'pk': message.id}
        )
        self.assertTrue(mockresponse.selector.one('.test-public-detail-posted-by'))
        posted_by = mockresponse.selector.one('.test-public-detail-posted-by').text_normalized
        self.assertEqual('Posted by: {}'.format(message.account), posted_by)

    def test_number_of_likes_positive_sanity(self):
        """A positive number should be shown in template"""
        account = mommy.make('cradmin_gettingstarted.Account', name='My Account')
        message = mommy.make(
            'cradmin_gettingstarted.Message',
            account=account,
            number_of_likes=100
        )
        mockresponse = self.mock_http200_getrequest_htmls(
            viewkwargs={'pk': message.id}
        )
        self.assertTrue(mockresponse.selector.one('.test-public-detail-likes'))
        likes = mockresponse.selector.one('.test-public-detail-likes').text_normalized
        self.assertEqual('Likes: {}'.format(message.number_of_likes), likes)

    def test_number_of_likes_negative_sanity(self):
        """A neagative number should be shown in template"""
        account = mommy.make('cradmin_gettingstarted.Account', name='My Account')
        message = mommy.make(
            'cradmin_gettingstarted.Message',
            account=account,
            number_of_likes=-10000
        )
        mockresponse = self.mock_http200_getrequest_htmls(
            viewkwargs={'pk': message.id}
        )
        self.assertTrue(mockresponse.selector.one('.test-public-detail-likes'))
        likes = mockresponse.selector.one('.test-public-detail-likes').text_normalized
        self.assertEqual('Likes: {}'.format(message.number_of_likes), likes)
