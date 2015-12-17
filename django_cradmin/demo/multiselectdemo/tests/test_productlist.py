from django import test
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.multiselectdemo.views import productlist


class TestProductListView(test.TestCase, cradmin_testhelpers.TestCaseMixin):
    viewclass = productlist.ProductListView

    def test_empty_list(self):
        mockresponse = self.mock_http200_getrequest_htmls()
        self.assertTrue(mockresponse.selector.exists('.django-cradmin-listing-no-items-message'))
        self.assertFalse(mockresponse.selector.exists('.django-cradmin-listbuilder-list'))

    def test_nonempty_list(self):
        mommy.make('multiselectdemo.Product')
        mockresponse = self.mock_http200_getrequest_htmls()
        self.assertFalse(mockresponse.selector.exists('.django-cradmin-listing-no-items-message'))
        self.assertTrue(mockresponse.selector.exists('.django-cradmin-listbuilder-list'))

    def test_default_ordering(self):
        a = mommy.make('multiselectdemo.Product', name='A')
        b = mommy.make('multiselectdemo.Product', name='B')
        c = mommy.make('multiselectdemo.Product', name='C')
        mockresponse = self.mock_http200_getrequest_htmls()
        self.assertEqual(
            '#{} - A'.format(a.id),
            mockresponse.selector.one(
                '.django-cradmin-listbuilder-list li:nth-child(1) h2').alltext_normalized)
        self.assertEqual(
            '#{} - B'.format(b.id),
            mockresponse.selector.one(
                '.django-cradmin-listbuilder-list li:nth-child(2) h2').alltext_normalized)
        self.assertEqual(
            '#{} - C'.format(c.id),
            mockresponse.selector.one(
                '.django-cradmin-listbuilder-list li:nth-child(3) h2').alltext_normalized)