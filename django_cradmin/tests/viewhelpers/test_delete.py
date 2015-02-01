import mock
import htmls
from django.test import TestCase
from django.test.client import RequestFactory

from django_cradmin.viewhelpers import delete


class TestDelete(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_get(self):
        class SimpleDeleteView(delete.DeleteView):
            def get_queryset_for_role(self, role):
                queryset = mock.MagicMock()
                return queryset

            def get_object(self):
                obj = mock.MagicMock()
                obj.__unicode__.return_value = 'Simple Test Item'
                obj._meta = mock.MagicMock()
                obj._meta.verbose_name = 'TestModel'
                return obj

        request = self.factory.get('/test')
        request.cradmin_app = mock.MagicMock()
        response = SimpleDeleteView.as_view()(request, pk=10)
        response.render()
        selector = htmls.S(response.content)

        self.assertEquals(selector.one('form')['action'], 'http://testserver/test')
        self.assertEquals(
            selector.one('.page-header h1').alltext_normalized,
            'DELETE TestModel')
        self.assertEquals(
            selector.one('#deleteview-preview p').text_normalized,
            'Are you sure you want to delete "Simple Test Item"?')

    def test_post(self):
        obj = mock.MagicMock()

        class SimpleDeleteView(delete.DeleteView):
            def get_queryset_for_role(self, role):
                queryset = mock.MagicMock()
                return queryset

            def get_object(self):
                return obj

        request = self.factory.post('/test')
        request._messages = mock.MagicMock()
        request.cradmin_app = mock.MagicMock()
        SimpleDeleteView.as_view()(request, pk=10)
        obj.delete.assert_called_once_with()
