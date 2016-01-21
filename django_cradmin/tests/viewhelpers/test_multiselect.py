from __future__ import unicode_literals
from django_cradmin.python2_compatibility import mock
import htmls
from django.test import TestCase
from django.test.client import RequestFactory
from django import http
from django import forms

from django_cradmin.viewhelpers import multiselect


class TestMultiSelectView(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_object_selection_valid(self):
        class SimpleMultiSelectView(multiselect.MultiSelectView):
            def get_queryset_for_role(self, role):
                queryset = mock.MagicMock()
                item1 = mock.MagicMock()
                item1.pk = 1
                item2 = mock.MagicMock()
                item2.pk = 10
                item3 = mock.MagicMock()
                item3.pk = 12
                queryset.filter.return_value = [item1, item2, item3]
                return queryset

            def object_selection_valid(self):
                return http.HttpResponse('OK')

            def object_selection_invalid(self, form):
                return http.HttpResponse(form.errors.as_text())

        request = self.factory.post('/test', {
            'selected_objects': [1, 10]
        })
        request.cradmin_role = mock.MagicMock()
        response = SimpleMultiSelectView.as_view()(request)
        self.assertEquals(response.status_code, 200)
        self.assertEquals(response.content, b"OK")

    def test_object_selection_invalid(self):
        class SimpleMultiSelectView(multiselect.MultiSelectView):
            def get_queryset_for_role(self, role):
                queryset = mock.MagicMock()
                return queryset

        request = self.factory.post('/test', {
            'selected_objects': [1, 10]
        })
        request.cradmin_role = mock.MagicMock()
        response = SimpleMultiSelectView.as_view()(request)
        selector = htmls.S(response.content)
        self.assertEquals(
            selector.one('.alert.alert-danger').text_normalized,
            'Invalid selection. This is usually caused by someone else changing permissions '
            'while you where selecting items to edit.')

    def test_object_selection_invalid_override(self):
        class SimpleMultiSelectView(multiselect.MultiSelectView):
            def get_queryset_for_role(self, role):
                queryset = mock.MagicMock()
                return queryset

            def object_selection_invalid(self, form):
                return http.HttpResponse('Invalid selection')

        request = self.factory.post('/test', {
            'selected_objects': [1, 10]
        })
        request.cradmin_role = mock.MagicMock()
        response = SimpleMultiSelectView.as_view()(request)
        self.assertIn(b'Invalid selection', response.content)


class TestMultiSelectFormView(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_first_load(self):
        class DemoForm(forms.Form):
            data = forms.CharField()

        class SimpleMultiSelectFormView(multiselect.MultiSelectFormView):
            form_class = DemoForm
            model = mock.MagicMock()

            def get_queryset_for_role(self, role):
                queryset = mock.MagicMock()
                item1 = mock.MagicMock()
                item1.pk = 1
                queryset.filter.return_value = [item1]
                return queryset

            def get_field_layout(self):
                return ['data']

        request = self.factory.post('/test', {
            'selected_objects': [1],
            'is_the_multiselect_form': 'yes'
        })
        request.cradmin_role = mock.MagicMock()
        response = SimpleMultiSelectFormView.as_view()(request)
        response.render()
        selector = htmls.S(response.content)
        self.assertEquals(selector.count('#django_cradmin_contentwrapper form'), 1)
        self.assertEquals(selector.one('input[name=selected_objects]')['type'], 'hidden')
        self.assertEquals(selector.one('input[name=selected_objects]')['value'], '1')
        self.assertEquals(selector.count('input[name=data]'), 1)
        self.assertFalse(selector.exists('form .has-error'))

    def test_form_invalid(self):
        class DemoForm(forms.Form):
            data = forms.CharField()

        class SimpleMultiSelectFormView(multiselect.MultiSelectFormView):
            form_class = DemoForm
            model = mock.MagicMock()

            def get_queryset_for_role(self, role):
                queryset = mock.MagicMock()
                item1 = mock.MagicMock()
                item1.pk = 1
                queryset.filter.return_value = [item1]
                return queryset

            def get_field_layout(self):
                return ['data']

        request = self.factory.post('/test', {
            'selected_objects': [1],
        })
        request.cradmin_role = mock.MagicMock()
        response = SimpleMultiSelectFormView.as_view()(request)
        response.render()
        selector = htmls.S(response.content)
        self.assertEquals(selector.count('#django_cradmin_contentwrapper form'), 1)
        self.assertEquals(selector.one('input[name=selected_objects]')['type'], 'hidden')
        self.assertEquals(selector.one('input[name=selected_objects]')['value'], '1')
        self.assertEquals(selector.count('input[name=data]'), 1)
        self.assertEquals(
            selector.one('#div_id_data .help-block').alltext_normalized,
            'This field is required.')

    def test_form_valid(self):
        class DemoForm(forms.Form):
            data = forms.CharField()

        class SimpleMultiSelectFormView(multiselect.MultiSelectFormView):
            form_class = DemoForm
            model = mock.MagicMock()

            def get_queryset_for_role(self, role):
                queryset = mock.MagicMock()
                item1 = mock.MagicMock()
                item1.pk = 1
                queryset.filter.return_value = [item1]
                return queryset

            def form_valid(self, form):
                return http.HttpResponse('Submitted: {data}'.format(**form.cleaned_data))

        request = self.factory.post('/test', {
            'selected_objects': [1],
            'data': 'Hello world'
        })
        request.cradmin_role = mock.MagicMock()
        response = SimpleMultiSelectFormView.as_view()(request)
        self.assertEquals(response.content, b'Submitted: Hello world')

    def test_form_valid_success_redirect(self):
        class DemoForm(forms.Form):
            data = forms.CharField()

        class SimpleMultiSelectFormView(multiselect.MultiSelectFormView):
            form_class = DemoForm
            model = mock.MagicMock()

            def get_queryset_for_role(self, role):
                queryset = mock.MagicMock()
                item1 = mock.MagicMock()
                item1.pk = 1
                queryset.filter.return_value = [item1]
                return queryset

            def get_success_url(self):
                return '/success'

            def form_valid(self, form):
                return self.success_redirect_response()

        request = self.factory.post('/test', {
            'selected_objects': [1],
            'data': 'Hello world'
        })
        request.cradmin_role = mock.MagicMock()
        response = SimpleMultiSelectFormView.as_view()(request)
        self.assertEquals(response.status_code, 302)
        self.assertEquals(response['Location'], '/success')
