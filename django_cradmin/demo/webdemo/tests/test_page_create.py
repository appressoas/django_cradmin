from django import test
from model_mommy import mommy

from django_cradmin.demo.webdemo.cradmin_apps import pages
from django_cradmin import cradmin_testhelpers


class TestPageCreateView(test.TestCase, cradmin_testhelpers.TestCaseMixin):
    """
    Testing PageCreateView

    .. attribute:: viewclass

        The viewclass to be tested.

    """
    viewclass = pages.PageCreateView

    def test_get_view_title(self):
        """
        Test the view title ('Create Page').
        """
        site = mommy.make('webdemo.Site')
        mommy.make('webdemo.Page', site=site)
        mockresponse = self.mock_http200_getrequest_htmls(cradmin_role=site)
        view_title = mockresponse.selector.one('h1.test-primary-h1').alltext_normalized
        self.assertEquals('Create Page', view_title)

    def test_get_create_button_text(self):
        """
        Test the button text for creating a page in view ('Create').
        """
        site = mommy.make('webdemo.Site', name='Demosite')
        mommy.make('webdemo.Page', title='Webpage2', site=site)
        mockresponse = self.mock_http200_getrequest_htmls(cradmin_role=site)
        button_text = mockresponse.selector.one('.btn-primary').alltext_normalized

        self.assertEquals('Create', button_text)

    def test_post_create_all_required_fields_filled(self):
        """
        Gets 302 Found redirect.
        """
        site = mommy.make('webdemo.Site')
        mockresponse = self.mock_http302_postrequest(
            cradmin_role=site,
            requestkwargs={
                'data': {
                    'title': 'Title text',
                    'intro': 'Intro text',
                    'body': 'Body text',
                    'publishing_time': '2000-09-09 13:37',
                }
            })
        self.assertEquals(302, mockresponse.response.status_code)
