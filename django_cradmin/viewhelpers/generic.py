from django.views.generic import TemplateView

from django_cradmin import javascriptregistry


class StandaloneBaseTemplateView(TemplateView, javascriptregistry.viewmixin.StandaloneBaseViewMixin):
    """
    Base template view that you should use instead of :class:`django.views.generic.TemplateView`
    if you extend the ``django_cradmin/standalone-base.django.html`` template.
    """
    template_name = 'django_cradmin/standalone-base.django.html'

    def get_context_data(self, **kwargs):
        context = super(StandaloneBaseTemplateView, self).get_context_data(**kwargs)
        self.add_javascriptregistry_component_ids_to_context(context=context)
        return context


class WithinRoleTemplateView(TemplateView, javascriptregistry.viewmixin.WithinRoleViewMixin):
    """
    Base template view that you should use instead of :class:`django.views.generic.TemplateView`
    if you extend the ``django_cradmin/base.django.html`` template.
    """
    template_name = 'django_cradmin/base.django.html'

    def get_context_data(self, **kwargs):
        context = super(WithinRoleTemplateView, self).get_context_data(**kwargs)
        self.add_javascriptregistry_component_ids_to_context(context=context)
        return context
