from django.db import models

from django_cradmin import datetimeutils
from django_cradmin.viewhelpers.listfilter.basefilters.single import abstractselect
from django_cradmin.viewhelpers.listfilter.django.base import DjangoOrmFilterMixin


class Boolean(abstractselect.AbstractBoolean, DjangoOrmFilterMixin):
    """
    A boolean filter that works on any BooleanField and CharField.
    (False, None and ``""`` is considered ``False``).
    """
    def get_query(self, modelfield):
        return (models.Q(**{modelfield: False}) |
                models.Q(**{modelfield: ''}) |
                models.Q(**{'{}__isnull'.format(modelfield): True}))

    def filter(self, queryobject):
        modelfield = self.get_modelfield()
        cleaned_value = self.get_cleaned_value()
        query = self.get_query(modelfield)
        if cleaned_value == 'true':
            queryobject = queryobject.exclude(query)
        elif cleaned_value == 'false':
            queryobject = queryobject.filter(query)
        return queryobject


class IsNotNull(Boolean, DjangoOrmFilterMixin):
    """
    A subclass of :class:`.Boolean` that works with
    foreign keys and other fields where ``None`` means no
    value and anything else means that it has a value.
    """
    def get_query(self, modelfield):
        return models.Q(**{'{}__isnull'.format(modelfield): True})


class DateTime(abstractselect.AbstractDateTime, DjangoOrmFilterMixin):
    """
    A datetime filter that works with Django DateTimeField.
    """
    def filter_datetime_range(self, queryobject, start_datetime, end_datetime):
        modelfield = self.get_modelfield()
        start_datetime = datetimeutils.make_aware_in_default_timezone(start_datetime)
        end_datetime = datetimeutils.make_aware_in_default_timezone(end_datetime)
        return queryobject.filter(**{
            '{}__gte'.format(modelfield): start_datetime,
            '{}__lt'.format(modelfield): end_datetime,
        })


class AbstractOrderBy(abstractselect.AbstractOrderBy, DjangoOrmFilterMixin):
    """
    A "filter" that lets the user select how the queryobject should be ordered.

    You only have to override the ``get_ordering_options()``-method from
    :meth:`~django_cradmin.viewhelpers.listfilter.basefilters.single.abstractselect.AbstractOrderBy`.
    """
    def filter(self, queryobject):
        cleaned_value = self.get_cleaned_value() or ''
        if cleaned_value in self.__ordering_options_dict:
            order_by = self.__ordering_options_dict[cleaned_value]['order_by']
            queryobject = queryobject.order_by(*order_by)
        return queryobject
