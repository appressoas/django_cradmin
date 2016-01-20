from django_cradmin.viewhelpers import multiselect2
from django_cradmin.viewhelpers import listbuilderview


class ViewMixin(object):
    """
    Multiselect2 view mixin. Must be mixin in before any Django View subclass.

    This is typically used with a Django ListView or TemplateView.
    """
    def get_target_renderer_class(self):
        """
        Get the target renderer class.

        Must return :class:`django_cradmin.viewhelpers.multiselect2.target_renderer.Target`
        or a subclass of that class.

        Defaults to returning :class:`django_cradmin.viewhelpers.multiselect2.target_renderer.Target`.
        """
        return multiselect2.target_renderer.Target

    def get_target_renderer_kwargs(self):
        """
        Get keywork arguments for the class returned
        by :meth:`.get_target_renderer_class`

        You should call ``super()`` when overriding this method
        to get any default kwargs provided by this method.
        """
        return {}

    def get_target_renderer(self):
        """
        Get the target renderer object.

        Must return an object of :class:`django_cradmin.viewhelpers.multiselect2.target_renderer.Target`
        or a subclass of that class.

        .. note:: You normally do not override this method, but instead
            you override :meth:`.get_target_renderer_kwargs` and
            :meth:`.get_target_renderer_class`.
        """
        return self.get_target_renderer_class()(**self.get_target_renderer_kwargs())

    def get_context_data(self, **kwargs):
        context = super(ViewMixin, self).get_context_data(**kwargs)
        context['target_renderer'] = self.get_target_renderer()
        return context


class ListbuilderView(ViewMixin, listbuilderview.View):
    """
    """
    template_name = 'django_cradmin/viewhelpers/multiselect2view/listbuilderview.django.html'


class ListbuilderFilterView(ViewMixin, listbuilderview.FilterListMixin, listbuilderview.View):
    """

    """
    template_name = 'django_cradmin/viewhelpers/multiselect2view/listbuilderfilterview.django.html'

    def get_filterlist_template_name(self):
        return self.template_name
