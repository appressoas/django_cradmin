from django.http import HttpResponseRedirect
from django.utils.translation import ugettext_lazy as _
from django.views.generic import UpdateView as DjangoUpdateView
from django_cradmin.viewhelpers.mixins import QuerysetForRoleMixin

from . import create_update_view_mixin


class UpdateView(QuerysetForRoleMixin,
                 create_update_view_mixin.CreateUpdateViewMixin,
                 DjangoUpdateView):
    template_name = 'django_cradmin/viewhelpers/update.django.html'

    def get_pagetitle(self):
        """
        Get the page title (the title tag).

        Defaults to ``Edit <verbose_name model>``.
        """
        return _('Edit %(what)s') % {'what': self.model_verbose_name}

    def get_success_message(self, obj):
        return _('Saved "%(object)s"') % {'object': obj}


class UpdateRoleView(UpdateView):
    """
    Extends :class:`.UpdateView` to streamline editing the current role
    object.

    Just like :class:`.UpdateView`, but with the get_object and
    get_queryset_for_role methods implemented to edit the current role
    object.
    """
    def get_object(self, queryset=None):
        return self.get_queryset_for_role().get()

    def get_queryset_for_role(self):
        return self.get_model_class().objects.filter(pk=self.request.cradmin_role.pk)


class RedirectToCreateIfDoesNotExistMixin(object):
    """
    An update view mixin that redirects to a create view when the
    object requested does not exist.

    You will typically use this for objects with a OneToOne relationship
    to the current role, but that may not exist. Then you would use
    something like::

        class MyUpdateView(update.UpdateView, update.RedirectToCreateIfDoesNotExistMixin):
            def get_object(self, queryset=None):
                return self.get_queryset_for_role().get()

            def get_queryset_for_role(self):
                return self.get_model_class().objects.filter(
                    someonetooneattr=self.request.cradmin_role)

    And the view will automatically redirect to the create view
    if the object does not exist.
    """

    #: The viewname within this app for the create view.
    #: See :meth:`.get_createurl`. Defaults to ``create``.
    createview_appurl_name = 'create'

    def get_createurl(self):
        """
        Get the URL of the create view that you want to redirect to if
        the requested object does not exist.

        Defaults to::

            self.request.cradmin_app.reverse_appurl(self.createview_appurl_name)
        """
        return self.request.cradmin_app.reverse_appurl(self.createview_appurl_name)

    def get(self, request, *args, **kwargs):
        try:
            return super().get(request, *args, **kwargs)
        except self.get_model_class().DoesNotExist:
            return HttpResponseRedirect(self.request.cradmin_app.reverse_appurl('create'))
