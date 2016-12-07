from django_cradmin.viewhelpers import generic


class Overview(generic.StandaloneBaseTemplateView):
    template_name = 'cradmin_javascript_demos/overview.django.html'


class DateTimePickerDemo(generic.StandaloneBaseTemplateView):
    template_name = 'cradmin_javascript_demos/datetimepicker-demo.django.html'

    def get_javascriptregistry_component_ids(self):
        return ['django_cradmin_javascript']


class SelectDemo(generic.StandaloneBaseTemplateView):
    template_name = 'cradmin_javascript_demos/select-demo.django.html'

    def get_javascriptregistry_component_ids(self):
        return ['django_cradmin_javascript']
