from django_cradmin.viewhelpers.listfilter.base import AbstractFilter


class AbstractDjangoOrmSingleFilter(AbstractFilter):
    """
    Abstract base class for Django ORM single value filters.
    """

    def get_modelfield(self):
        """
        Get the name of the model field to filter on.
        """
        return self.get_slug()

    def get_context_data(self):
        context = super(AbstractDjangoOrmSingleFilter, self).get_context_data()
        context['title'] = self.get_title()
        return context
