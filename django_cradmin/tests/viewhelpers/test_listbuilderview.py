from django.test import TestCase
from model_mommy import mommy

from django_cradmin.cradmin_testhelpers import TestCaseMixin
from django_cradmin.viewhelpers import listbuilderview
from django_cradmin.django_cradmin_testapp import models as testmodels


class ListBuilderViewWithoutPaging(listbuilderview.View):
    model = testmodels.SomeItem

    def get_queryset_for_role(self, role):
        return testmodels.SomeItem.objects.all()


class ListBuilderViewWithPaging(ListBuilderViewWithoutPaging):
    paginate_by = 3


class TestListBuilderView(TestCase, TestCaseMixin):
    viewclass = ListBuilderViewWithoutPaging

    def test_empty(self):
        mockresponse = self.mock_http200_getrequest_htmls()
        self.assertFalse(mockresponse.selector.exists('.django-cradmin-listbuilder-list'))
        self.assertEquals(
            mockresponse.selector.one('.django-cradmin-listbuilderview-no-items-message').alltext_normalized,
            'No some items')

    def test_not_empty(self):
        mommy.make('django_cradmin_testapp.SomeItem',
                   name='Test name')
        mockresponse = self.mock_http200_getrequest_htmls()
        self.assertFalse(mockresponse.selector.exists('.django-cradmin-listbuilderview-no-items-message'))
        self.assertTrue(mockresponse.selector.exists('.django-cradmin-listbuilder-list'))

    def test_item_rendering(self):
        mommy.make('django_cradmin_testapp.SomeItem',
                   name='Test name')
        mockresponse = self.mock_http200_getrequest_htmls()
        # mockresponse.selector.prettyprint()
        self.assertEqual(1, mockresponse.selector.count('.django-cradmin-listbuilder-list li'))
        self.assertEqual('Test name',
                         mockresponse.selector.one('.django-cradmin-listbuilder-list li').alltext_normalized)


class TestListBuilderPaginationView(TestCase, TestCaseMixin):
    viewclass = ListBuilderViewWithPaging

    def test_paginate_by_singlepage(self):
        mommy.make('django_cradmin_testapp.SomeItem', _quantity=3)
        mockresponse = self.mock_http200_getrequest_htmls()
        self.assertEqual(3, mockresponse.selector.count('.django-cradmin-listbuilder-list li'))
        self.assertFalse(mockresponse.selector.exists('#django_cradmin_contentwrapper .django-cradmin-loadmorepager'))

    def test_paginate_by_firstpage(self):
        mommy.make('django_cradmin_testapp.SomeItem', _quantity=8)
        mockresponse = self.mock_http200_getrequest_htmls()
        # mockresponse.selector.one('#django_cradmin_contentwrapper').prettyprint()
        self.assertEqual(3, mockresponse.selector.count('.django-cradmin-listbuilder-list li'))
        self.assertTrue(mockresponse.selector.exists('#django_cradmin_contentwrapper .django-cradmin-loadmorepager'))

    def test_paginate_by_middlepage(self):
        mommy.make('django_cradmin_testapp.SomeItem', _quantity=8)
        mockresponse = self.mock_http200_getrequest_htmls(requestkwargs={'data': {'page': 2}})
        self.assertEqual(3, mockresponse.selector.count('.django-cradmin-listbuilder-list li'))
        self.assertTrue(mockresponse.selector.exists('#django_cradmin_contentwrapper .django-cradmin-loadmorepager'))

    def test_paginate_by_lastpage(self):
        mommy.make('django_cradmin_testapp.SomeItem', _quantity=8)
        mockresponse = self.mock_http200_getrequest_htmls(requestkwargs={'data': {'page': 3}})
        self.assertEqual(2, mockresponse.selector.count('.django-cradmin-listbuilder-list li'))
        self.assertFalse(mockresponse.selector.exists('#django_cradmin_contentwrapper .django-cradmin-loadmorepager'))
