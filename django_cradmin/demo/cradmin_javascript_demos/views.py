import json

from django.http import Http404
from django.http import HttpResponse

from django_cradmin.viewhelpers import generic
from django.views.generic import View


class Overview(generic.StandaloneBaseTemplateView):
    template_name = 'cradmin_javascript_demos/overview.django.html'


class DateTimePickerDemo(generic.StandaloneBaseTemplateView):
    template_name = 'cradmin_javascript_demos/datetimepicker-demo.django.html'

    def get_javascriptregistry_component_ids(self):
        return ['django_cradmin_javascript']


class SelectApiDemo(View):
    searchdata = [
        {
            "id": 1,
            "title": "John",
            "description": "The John - from the API"
        },
        {
            "id": 2,
            "title": "Peter",
            "description": "Peter is coool - from the API"
        },
        {
            "id": 3,
            "title": "No description - from the API"
        },
        {
            "id": 4,
            "title": "Jane",
            "description": "Jane is awesome, but she no longer likes Tarzan - from the API"
        }
    ]

    def filter_search(self, search_string):
        search_string = search_string.lower()
        results = []
        for result_dict in self.searchdata:
            string_to_search = '{}{}'.format(
                result_dict.get('title', ''), result_dict.get('description', ''))
            if search_string in string_to_search.lower():
                results.append(result_dict)
        return results

    def _make_search_response(self):
        search_string = self.request.GET['search']
        results = self.filter_search(search_string=search_string)
        return HttpResponse(
            json.dumps(results),
            content_type='application/json; charset=utf-8'
        )

    def _get_result_by_id(self, id):
        for result_dict in self.searchdata:
            if str(result_dict['id']) == id:
                return result_dict
        raise ValueError('No item with id={!r}'.format(id))

    def _make_get_single_response(self, id):
        try:
            result_dict = self._get_result_by_id(id=id)
        except ValueError:
            raise Http404()
        else:
            return HttpResponse(
                json.dumps(result_dict),
                content_type='application/json; charset=utf-8'
            )

    def get(self, request, id=None):
        if id is None:
            return self._make_search_response()
        else:
            return self._make_get_single_response(id=id)


class SelectDemo(generic.StandaloneBaseTemplateView):
    template_name = 'cradmin_javascript_demos/select-demo.django.html'

    def get_javascriptregistry_component_ids(self):
        return ['django_cradmin_javascript']


class TabsDemo(generic.StandaloneBaseTemplateView):
    template_name = 'cradmin_javascript_demos/tabs-demo.django.html'

    def get_javascriptregistry_component_ids(self):
        return ['django_cradmin_javascript']
