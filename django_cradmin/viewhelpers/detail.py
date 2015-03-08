from django.views.generic.detail import DetailView as DjangoDetailView
from django_cradmin.viewhelpers.mixins import QuerysetForRoleMixin


class DetailView(QuerysetForRoleMixin, DjangoDetailView):
    """
    Base detail view for Django cradmin views.
    """
