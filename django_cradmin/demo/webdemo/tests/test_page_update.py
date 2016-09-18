from django import test
from model_mommy import mommy

from django_cradmin.demo.webdemo.cradmin_apps import pages
from django_cradmin import cradmin_testhelpers


class TestPageUpdateView(test.TestCase, cradmin_testhelpers.TestCaseMixin):
    """
    Testing PageUpdateView

    .. attribute:: viewclass

        The viewclass to be tested.

    """
    viewclass = pages.PageUpdateView

    def test_get_view_title(self):
        """
        Test the view title ('Edit Page').
        """
        site = mommy.make('webdemo.Site')
        page = mommy.make('webdemo.Page', site=site)

        # When updating the view, the url needs a parameter, here the pk of the page to update.
        # According to the views/pages.py class Apps ('^edit/(?P<pk>\d+)$').
        mockresponse = self.mock_http200_getrequest_htmls(cradmin_role=site, viewkwargs={'pk': page.id})
        view_title = mockresponse.selector.one('h1.test-primary-h1').alltext_normalized
        self.assertEquals('Edit Page', view_title)

    def test_post_without_required_field_title(self):
        """
        Test a post request with all fields filled except title (required).
        """
        site = mommy.make('webdemo.Site')
        page = mommy.make('webdemo.Page', site=site)

        # When updating the view, the url needs a parameter, here the pk of the page to update.
        # According to the views/pages.py class Apps ('^edit/(?P<pk>\d+)$').
        mockresponse = self.mock_http200_postrequest_htmls(
            cradmin_role=site,
            viewkwargs={'pk': page.id},
            requestkwargs={
                'data': {
                    'title': '',
                    'intro': 'Intro text',
                    'body': 'Body text',
                    'publishing_time': '2000-09-09 13:37',
                }
            })
        self.assertTrue(mockresponse.selector.exists('#div_id_title'))
        self.assertTrue(mockresponse.selector.exists('.has-error'))
        self.assertEquals('This field is required.', mockresponse.selector.one('#error_1_id_title').alltext_normalized)

    def test_post_without_required_field_intro(self):
        """
        Test a post request with all fields filled except intro (required).
        """
        site = mommy.make('webdemo.Site')
        page = mommy.make('webdemo.Page', site=site)
        mockresponse = self.mock_http200_postrequest_htmls(
            cradmin_role=site,
            viewkwargs={'pk': page.id},
            requestkwargs={
                'data': {
                    'title': 'Title text',
                    'intro': '',
                    'body': 'Body text',
                    'publishing_time': '2000-09-09 13:37',
                }
            })
        self.assertTrue(mockresponse.selector.exists('#div_id_intro'))
        self.assertTrue(mockresponse.selector.exists('.has-error'))
        self.assertEquals('This field is required.', mockresponse.selector.one('#error_1_id_intro').alltext_normalized)

    def test_post_without_required_field_body(self):
        """
        Test a post request with all fields filled except body (required).
        """
        site = mommy.make('webdemo.Site')
        page = mommy.make('webdemo.Page', site=site)
        mockresponse = self.mock_http200_postrequest_htmls(
            cradmin_role=site,
            viewkwargs={'pk': page.id},
            requestkwargs={
                'data': {
                    'title': 'Title text',
                    'intro': 'Intro text',
                    'body': '',
                    'publishing_time': '2000-09-09 13:37',
                }
            })
        self.assertTrue(mockresponse.selector.exists('#div_id_body'))
        self.assertTrue(mockresponse.selector.exists('.has-error'))
        self.assertEquals('This field is required.', mockresponse.selector.one('#error_1_id_body').alltext_normalized)

    def test_post_without_required_field_publishing_time(self):
        """
        Test a post request with all fields filled except time (required).
        """
        site = mommy.make('webdemo.Site')
        page = mommy.make('webdemo.Page', site=site)
        mockresponse = self.mock_http200_postrequest_htmls(
            cradmin_role=site,
            viewkwargs={'pk': page.id},
            requestkwargs={
                'data': {
                    'title': 'Title text',
                    'intro': 'Intro text',
                    'body': 'Body text',
                    'publishing_time': '',
                }
            })
        self.assertTrue(mockresponse.selector.exists('#div_id_publishing_time'))
        self.assertTrue(mockresponse.selector.exists('.has-error'))
        self.assertEquals('This field is required.',
                          mockresponse.selector.one('#error_1_id_publishing_time').alltext_normalized)

    def test_post_all_required_fields_filled(self):
        """
        Gets 302 Found redirect.
        """
        site = mommy.make('webdemo.Site')
        page = mommy.make('webdemo.Page', site=site)
        mockresponse = self.mock_http302_postrequest(
            cradmin_role=site,
            viewkwargs={'pk': page.id},
            requestkwargs={
                'data': {
                    'title': 'Title text',
                    'intro': 'Intro text',
                    'body': 'Body text',
                    'publishing_time': '2000-09-09 13:37',
                }
            })
        self.assertEquals(302, mockresponse.response.status_code)
