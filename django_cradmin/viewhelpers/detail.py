from __future__ import unicode_literals
from django.views.generic.detail import DetailView as DjangoDetailView
from django_cradmin.viewhelpers.mixins import QuerysetForRoleMixin
from django_cradmin import javascriptregistry


class DetailView(javascriptregistry.viewmixin.WithinRoleViewMixin,
                 QuerysetForRoleMixin, DjangoDetailView):
    """
    Base detail view for Django cradmin views.
    """

    def get_context_data(self, **kwargs):
        context = super(DetailView, self).get_context_data(**kwargs)
        self.add_javascriptregistry_component_ids_to_context(context=context)
        return context


class DetailRoleView(DetailView):
    """
    Extends :class:`.DetailView` to streamline creating a detail view
    for the current role object.

    Just like :class:`.DetailView`, but with the get_object and
    get_queryset_for_role methods implemented to edit the current role
    object.
    """
    def get_object(self, queryset=None):
        return self.get_queryset_for_role().get()

    def get_queryset_for_role(self):
        return self.model.objects.filter(pk=self.request.cradmin_role.pk)
