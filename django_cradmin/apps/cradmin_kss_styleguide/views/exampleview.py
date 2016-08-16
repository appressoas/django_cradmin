from django.views.generic import TemplateView

from django_cradmin.apps.cradmin_kss_styleguide import styleguide_registry


class ExampleView(TemplateView):
    def get_template_names(self):
        return [
            self.styleguideconfig.get_example_template_name()
        ]

    def get_styleguideconfig(self):
        styleguideconfig = styleguide_registry.Registry.get_instance()[self.kwargs['unique_id']]
        return styleguideconfig

    def dispatch(self, request, *args, **kwargs):
        self.styleguideconfig = self.get_styleguideconfig()
        return super(ExampleView, self).dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(ExampleView, self).get_context_data(**kwargs)
        styleguideconfig = self.get_styleguideconfig()
        kss_styleguide = styleguideconfig.make_kss_styleguide()
        section = kss_styleguide.get_section_by_reference(self.kwargs['section'])
        example = section.examples[int(self.kwargs['exampleindex'])]
        context['styleguideconfig'] = styleguideconfig
        context['section'] = section
        context['exampleindex'] = self.kwargs['exampleindex']
        context['example'] = example
        return context
