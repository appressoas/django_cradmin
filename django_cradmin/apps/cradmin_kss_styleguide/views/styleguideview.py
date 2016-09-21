from django.shortcuts import redirect
from django_cradmin import viewhelpers

from django_cradmin.apps.cradmin_kss_styleguide import styleguide_registry


class GuideListView(viewhelpers.generic.WithinRoleTemplateView):
    template_name = 'cradmin_kss_styleguide/styleguideview/guides.django.html'

    def get(self, request, *args, **kwargs):
        self.styleguideregistry = styleguide_registry.Registry.get_instance()
        if len(self.styleguideregistry) == 1:
            styleguideconfig = self.styleguideregistry.first_guide()
            return redirect('cradmin_kss_styleguide_guide', unique_id=styleguideconfig.unique_id)
        else:
            return super(GuideListView, self).get(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(GuideListView, self).get_context_data(**kwargs)
        context['styleguideregistry'] = self.styleguideregistry
        context['prefix'] = self.kwargs.get('prefix', None)
        return context


class GuideView(viewhelpers.generic.WithinRoleTemplateView):
    template_name = 'cradmin_kss_styleguide/styleguideview/guide.django.html'

    def get_styleguideconfig(self):
        styleguideconfig = styleguide_registry.Registry.get_instance()[self.kwargs['unique_id']]
        return styleguideconfig

    def dispatch(self, request, *args, **kwargs):
        self.styleguideconfig = self.get_styleguideconfig()
        return super(GuideView, self).dispatch(request, *args, **kwargs)

    def get_template_names(self):
        return [
            self.styleguideconfig.get_template_name()
        ]

    def get_context_data(self, **kwargs):
        context = super(GuideView, self).get_context_data(**kwargs)
        styleguideconfig = self.get_styleguideconfig()
        context['styleguideconfig'] = styleguideconfig
        context['kss_styleguide'] = styleguideconfig.make_kss_styleguide()
        return context
