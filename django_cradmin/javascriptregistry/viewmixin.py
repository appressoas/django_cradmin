from . import component


class MinimalViewMixin(object):
    def get_javascriptregistry_component_ids(self):
        return []

    def add_javascriptregistry_component_ids_to_context(self, context):
        """
        Call this to add the ``cradmin_javascriptregistry_component_ids`` template
        context variable to the provided ``context``.

        Do not override this in subclasses.

        Args:
            context (dict): A template context.

        """
        context['cradmin_javascriptregistry_component_ids'] = self.get_javascriptregistry_component_ids()


class StandaloneBaseViewMixin(MinimalViewMixin):
    """
    Use with views that use the ``django_cradmin/standalone-base.django.html``
    template.

    DO NOT use for views that use the ``django_cradmin/base.django.html`` template,
    use :class:`.BaseViewMixin` for that.
    """
    def get_javascriptregistry_component_ids(self):
        return []


class WithinRoleViewMixin(StandaloneBaseViewMixin):
    """
    Use with views that use the ``django_cradmin/base.django.html`` template.
    """
    def get_javascriptregistry_component_ids(self):
        return [
            component.CradminMenu.get_component_id()
        ]
