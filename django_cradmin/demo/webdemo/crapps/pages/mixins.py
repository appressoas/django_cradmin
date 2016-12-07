from django_cradmin.demo.webdemo.models import Page


class PagesQuerySetForRoleMixin(object):
    """
    Used by listing, update and delete view to ensure
    that only pages that the current role has access to
    is available.
    """
    def get_queryset_for_role(self):
        return Page.objects.filter(site=self.request.cradmin_role)
