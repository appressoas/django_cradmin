from django.test import TestCase

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.cradmin_listbuilder_guide.crapps import main_dashboard


class TestMainDashboard(TestCase, cradmin_testhelpers.TestCaseMixin):
    viewclass = main_dashboard.MainDashboardView

    def test_get_render_page_sanity(self):
        """Is the content of block page-cover-title in template rendered"""
        mockresponse = self.mock_http200_getrequest_htmls()
        self.assertTrue(mockresponse.selector.one('.test-primary-h1'))
        self.assertEqual('Listbuilder Guide', mockresponse.selector.one('.test-primary-h1').text_normalized)