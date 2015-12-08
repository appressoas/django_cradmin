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
        mommy.make('multiselectdemo.Product', name='A')
        mommy.make('multiselectdemo.Product', name='B')
        mommy.make('multiselectdemo.Product', name='C')
        mockresponse = self.mock_http200_getrequest_htmls()
        mockresponse.selector.prettyprint()
        self.assertEqual(
            'A',
            mockresponse.selector.one(
                '.django-cradmin-listbuilder-list li:nth-child(1)').alltext_normalized)
        self.assertEqual(
            'B',
            mockresponse.selector.one(
                '.django-cradmin-listbuilder-list li:nth-child(2)').alltext_normalized)
        self.assertEqual(
            'C',
            mockresponse.selector.one(
                '.django-cradmin-listbuilder-list li:nth-child(3)').alltext_normalized)
