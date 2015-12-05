from .base import AbstractDjangoOrmSingleFilter


class AbstractInputFilter(AbstractDjangoOrmSingleFilter):
    """
    Abstract base class for any filter that uses a single text input field.
    """
    template_name = 'django_cradmin/viewhelpers/listfilter/django/single/input/base.django.html'
