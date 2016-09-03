from django import test
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.multiselect2demo.views import productlist


class TestProductListView(test.TestCase, cradmin_testhelpers.TestCaseMixin):
    viewclass = productlist.ProductListView

    def test_empty_list(self):
        mockresponse = self.mock_http200_getrequest_htmls()
        self.assertTrue(mockresponse.selector.exists('.test-cradmin-no-items-message'))
        self.assertFalse(mockresponse.selector.exists('.test-cradmin-listbuilder-list'))

    def test_nonempty_list(self):
        mommy.make('multiselect2demo.Product')
        mockresponse = self.mock_http200_getrequest_htmls()
        self.assertFalse(mockresponse.selector.exists('.test-cradmin-no-items-message'))
        self.assertTrue(mockresponse.selector.exists('.test-cradmin-listbuilder-list'))

    def test_default_ordering(self):
        mommy.make('multiselect2demo.Product', name='A')
        mommy.make('multiselect2demo.Product', name='B')
        mommy.make('multiselect2demo.Product', name='C')
        mockresponse = self.mock_http200_getrequest_htmls()
        self.assertEqual(
            'A',
            mockresponse.selector.one(
                '.test-cradmin-listbuilder-list '
                '.test-cradmin-listbuilder-item-frame-renderer:nth-child(1) h2').alltext_normalized)
        self.assertEqual(
            'B',
            mockresponse.selector.one(
                '.test-cradmin-listbuilder-list '
                '.test-cradmin-listbuilder-item-frame-renderer:nth-child(2) h2').alltext_normalized)
        self.assertEqual(
            'C',
            mockresponse.selector.one(
                '.test-cradmin-listbuilder-list '
                '.test-cradmin-listbuilder-item-frame-renderer:nth-child(3) h2').alltext_normalized)
