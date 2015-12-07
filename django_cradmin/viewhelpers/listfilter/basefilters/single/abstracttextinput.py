from django.utils.translation import ugettext_lazy, pgettext

from django_cradmin.viewhelpers.listfilter.base.abstractfilter import AbstractFilter


class AbstractInputFilter(AbstractFilter):
    """
    Abstract base class for any filter that uses a single text input field.
    """
    template_name = 'django_cradmin/viewhelpers/listfilter/django/single/textinput/base.django.html'

    #: The text used in URLs as placeholder for the value of this filter.
    #: The AngularJS directive replaces this with the actual value.
    #: You should not have to override this.
    urlpattern_replace_text = '_-_TEXTINPUT_-_VALUE_-_'

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
        """
        Get the URL pattern to use when the input value is a non-empty string.

        You should not need to override this.
        """
        return self.build_set_values_url(values=[self.urlpattern_replace_text])

    def get_emptyvalue_url(self):
        """
        Get the URL to use when the input value is an empty string.

        You should not need to override this.
        """
        return self.build_clear_values_url()

    def get_timeout_milliseconds(self):
        """
        Get the number of milliseconds to wait until applying the change
        when users modify the input field.

        When users hit enter or focus away from the field, search is
        done instantly, so this is only the delay to wait while
        users are typing (live search).
        """
        return 500

    def get_angularjs_options_dict(self):
        options_dict = super(AbstractInputFilter, self).get_angularjs_options_dict()
        options_dict['timeout_milliseconds'] = self.get_timeout_milliseconds()
        options_dict['urlpattern_replace_text'] = self.urlpattern_replace_text
        return options_dict


class AbstractSearch(AbstractInputFilter):
    """
    Abstract search filter.

    Subclasses only need to implement
    :meth:`django_cradmin.viewhelpers.listfilter.base.abstractfilter.AbstractFilter.filter`.

    See :class:`django_cradmin.viewhelpers.listfilter.django.single.textinput.Search`
    for a Django ORM implementation.
    """
    def get_base_css_classes_list(self):
        css_classes = super(AbstractSearch, self).get_base_css_classes_list()
        css_classes.append('django-cradmin-listfilter-filter-single-input-search')
        return css_classes

    def get_placeholder(self):
        return ugettext_lazy('Search ...')

    def get_loadingmessage(self):
        return pgettext('listfilter loading message', 'Searching')
