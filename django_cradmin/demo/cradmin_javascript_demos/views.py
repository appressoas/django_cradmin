import json

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
        for item in self.searchdata:
            string_to_search = '{}{}'.format(
                item.get('title', ''), item.get('description', ''))
            if search_string in string_to_search.lower():
                results.append(item)
        return results

    def _make_search_response(self, search_string):
        results = self.filter_search(search_string=search_string)
        return HttpResponse(
            json.dumps(results),
            content_type='application/json; charset=utf-8'
        )

    def get(self, *args, **kwargs):
        search_string = self.request.GET['search']
        return self._make_search_response(search_string=search_string)

    # post is not needed, but useful for testing the "searchApi.method" argument
    # for the widget
    def post(self, *args, **kwargs):
        bodydict = json.loads(self.request.body.decode('utf-8'))
        search_string = bodydict['search']
        return self._make_search_response(search_string=search_string)


class SelectDemo(generic.StandaloneBaseTemplateView):
    template_name = 'cradmin_javascript_demos/select-demo.django.html'

    def get_javascriptregistry_component_ids(self):
        return ['django_cradmin_javascript']


class TabsDemo(generic.StandaloneBaseTemplateView):
    template_name = 'cradmin_javascript_demos/tabs-demo.django.html'

    def get_javascriptregistry_component_ids(self):
        return ['django_cradmin_javascript']
