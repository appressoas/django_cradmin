from django.utils.translation import ugettext_lazy
from django_cradmin.viewhelpers.listfilter.base.abstractfilter import AbstractFilter


class AbstractInputFilter(AbstractFilter):
    """
    Abstract base class for any filter that uses a single text input field.
    """
    template_name = 'django_cradmin/viewhelpers/listfilter/django/single/textinput/base.django.html'

    def get_input_html_element_type(self):
        """
        Get the ``type``-attribute of the input HTML element.

        Defaults to ``"text"``.
        """
        return 'text'

    def get_base_css_classes_list(self):
        css_classes = super(AbstractInputFilter, self).get_base_css_classes_list()
        css_classes.append('django-cradmin-listfilter-filter-single-input')
        return css_classes

    def get_placeholder(self):
        """
        Get the placeholder text for the input element.

        Defaults to empty string.
        """
        return ''

    def get_inputfield_value(self):
        return self.get_cleaned_value() or ''

    def get_urlpattern(self):
        return self.build_set_values_url(values=['_-_TEXTINPUT_-_VALUE_-_'])


class AbstractSearch(AbstractInputFilter):
    """
    Abstract search filter.

    Subclasses should only need to implement
    :meth:`django_cradmin.viewhelpers.listfilter.basefilters.single.select.AbstractSelectFilter.filter`.

    See :class:`django_cradmin.viewhelpers.listfilter.django.single.input.Search`
    for a Django ORM implementation.
    """
    def get_base_css_classes_list(self):
        css_classes = super(AbstractSearch, self).get_base_css_classes_list()
        css_classes.append('django-cradmin-listfilter-filter-single-input-search')
        return css_classes

    def get_placeholder(self):
        return ugettext_lazy('Search ...')
