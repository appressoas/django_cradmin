from django_cradmin.viewhelpers.listfilter.basefilters.multi import abstractcheckbox
from django_cradmin.viewhelpers.listfilter.django.base import DjangoOrmFilterMixin


class RelatedModel(abstractcheckbox.AbstractCheckboxFilter, DjangoOrmFilterMixin):
    """
    Filter on values from a related model (one-to-many or many-to-many).
    """

    def filter(self, queryobject):
        cleaned_values = self.get_cleaned_values()
        return queryobject
