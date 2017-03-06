from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.cradmin_gettingstarted.crapps.publicui.message_detail_view import MessageDetailView


class TestMessageDetailView(TestCase, cradmin_testhelpers.TestCaseMixin):
    viewclass = MessageDetailView

    def test_wtf(self):
        message = mommy.make('cradmin_gettingstarted.Message')
        mockresponse = self.mock_http200_getrequest_htmls(
            viewkwargs={'pk': message.pk}
        )
        mockresponse.selector.prettyprint()