from django.views.generic import TemplateView
from django_cradmin import javascriptregistry

from django_cradmin.apps.cradmin_kss_styleguide import styleguide_registry


class ExampleView(TemplateView, javascriptregistry.viewmixin.MinimalViewMixin):
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

    def get_javascriptregistry_component_ids(self):
        return self.styleguideconfig.javascript_component_ids

    def get_context_data(self, **kwargs):
        context = super(ExampleView, self).get_context_data(**kwargs)
        self.styleguideconfig = self.get_styleguideconfig()
        kss_styleguide = self.styleguideconfig.make_kss_styleguide()
        section = kss_styleguide.get_section_by_reference(self.kwargs['section'])
        example = section.examples[int(self.kwargs['exampleindex'])]
        self.add_javascriptregistry_component_ids_to_context(context=context)
        context['styleguideconfig'] = self.styleguideconfig
        context['section'] = section
        context['exampleindex'] = self.kwargs['exampleindex']
        context['example'] = example
        return context
