from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.webdemo.crapps import dashboard


class TestDashboard(TestCase, cradmin_testhelpers.TestCaseMixin):
    viewclass = dashboard.DashboardView

    def test_get_title(self):
        site = mommy.make('webdemo.Site',
                          name='Testsite')
        mockresponse = self.mock_http200_getrequest_htmls(
            cradmin_role=site)
        self.assertEqual(
            mockresponse.selector.one('title').alltext_normalized,
            'Dashboard - Testsite')

    def test_get_primary_h1(self):
        site = mommy.make('webdemo.Site')
        mockresponse = self.mock_http200_getrequest_htmls(
            cradmin_role=site)
        self.assertEqual(
            mockresponse.selector.one('.test-primary-h1').alltext_normalized,
            'Dashboard')

    def test_get_welcome_message(self):
        site = mommy.make('webdemo.Site',
                          name='Testsite')
        mockresponse = self.mock_http200_getrequest_htmls(
            cradmin_role=site)
        self.assertEqual(
            mockresponse.selector.one('.test-welcome-message').alltext_normalized,
            'Welcome to the django cradmin demo!')
