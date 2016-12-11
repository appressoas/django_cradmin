from django_cradmin.viewhelpers import generic


class Overview(generic.StandaloneBaseTemplateView):
    template_name = 'cradmin_javascript_demos/overview.django.html'


class DateTimePickerDemo(generic.StandaloneBaseTemplateView):
    template_name = 'cradmin_javascript_demos/datetimepicker-demo.django.html'

    def get_javascriptregistry_component_ids(self):
        return ['django_cradmin_javascript']


class TabsDemo(generic.StandaloneBaseTemplateView):
    template_name = 'cradmin_javascript_demos/tabs-demo.django.html'

    def get_javascriptregistry_component_ids(self):
        return ['django_cradmin_javascript']


class DataListWidgetsDemo(generic.StandaloneBaseTemplateView):
    template_name = 'cradmin_javascript_demos/data-list-widgets-demo.django.html'

    def get_javascriptregistry_component_ids(self):
        return ['django_cradmin_javascript']


class DataListWidgetsUicontainerDemo(generic.StandaloneBaseTemplateView):
    template_name = 'cradmin_javascript_demos/data-list-widgets-uicontainer-demo.django.html'

    def get_javascriptregistry_component_ids(self):
        return ['django_cradmin_javascript']
