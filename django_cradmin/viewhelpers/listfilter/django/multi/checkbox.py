from django.db import models

from django_cradmin import datetimeutils
from django_cradmin.viewhelpers.listfilter.basefilters.single import abstractselect
from django_cradmin.viewhelpers.listfilter.django.base import DjangoOrmFilterMixin


class RelatedModel(abstractselect.AbstractBoolean, DjangoOrmFilterMixin):
    """
    Filter on values from a related model (one-to-many or many-to-many).


    """

    def filter(self, queryobject):
        cleaned_values = self.get_cleaned_values()
        return queryobject
