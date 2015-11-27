from django import test
from model_mommy import mommy

from django_cradmin.demo.webdemo.views import pages_listbuilder
from django_cradmin import cradmin_testhelpers

class TestPagesListView(test.TestCase, cradmin_testhelpers.TestCaseMixin):
    viewclass = pages_listbuilder.PagesListView

    def test_get(self):
        site = mommy.make('webdemo.Site')
        page = mommy.make('webdemo.Page', site=site, title='Test title')
        mockresponse = self.mock_http200_getrequest_htmls(cradmin_role=site)
        # mockresponse.selector.prettyprint()

        self.assertEquals('Test title', mockresponse.selector.one('.django-cradmin-listbuilder-itemvalue').alltext_normalized)

    def test_get_multiple(self):
        """
        Using selector list on multiple values.
        """
        site = mommy.make('webdemo.Site')
        page_one = mommy.make('webdemo.Page', site=site, title='Test title 1')
        page_two = mommy.make('webdemo.Page', site=site, title='Test title 2')
        page_three = mommy.make('webdemo.Page', site=site, title='Test title 3')
        mockresponse = self.mock_http200_getrequest_htmls(cradmin_role=site)
        # mockresponse.selector.prettyprint()
        page_list = mockresponse.selector.list('.django-cradmin-listbuilder-itemvalue')

        self.assertEquals(3, len(page_list))
