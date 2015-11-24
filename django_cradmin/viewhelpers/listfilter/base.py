from __future__ import unicode_literals
from collections import OrderedDict
import urllib
from django_cradmin.renderable import AbstractRenderableWithCss

from future import standard_library
standard_library.install_aliases()


class AbstractGroupChild(AbstractRenderableWithCss):
    """
    Base class for anything that can be added as a child of
    :class:`.Group`.
    """
    def __init__(self):
        self.parentgroup = None

    def set_parentfiltergroup(self, parentgroup):
        self.parentgroup = parentgroup


class AbstractFilter(AbstractGroupChild):
    """
    Defines a filter.
    """
    def __init__(self, *args, **kwargs):
        super(AbstractFilter, self).__init__(*args, **kwargs)
        self.values = None
        self.cleaned_values = None

    def get_slug(self):
        """
        Get the slug for this filter. The slug is used
        in the URL to identify the filter.

        If your users can change their language, this
        should not be translatable since that would
        make an URL unusable by a user with a different language
        (if a user shares an URL with another user).
        """
        raise NotImplementedError()

    def build_set_values_url(self, values):
        """
        Get the URL that adds this filter with the given values to the current url.

        You should not need to override this, but you will use it in your
        template context to render urls for choices if your filter
        is a single select filter.
        """
        return self.parentgroup.build_filter_url(filterobject=self,
                                                 mode='set', values=values)

    def build_clear_values_url(self):
        """
        Get the URL that clears this filter from the current url.

        You should not need to override this, but you will use it in your
        template context to render urls for choices if your filter
        supports "clear".
        """
        return self.parentgroup.build_filter_url(filterobject=self,
                                                 mode='clear')

    def build_add_values_url(self, values):
        """
        Get the URL that adds the given values for this filter to the current url.

        This is not the same as :meth:`.build_set_values_url`. This method is for
        multiselect filters where the user can add valuess to the filter
        (typically via checkboxes).

        You should not need to override this, but you will use it in your
        template context to render urls for choices if your filter
        uses multiselect.
        """
        return self.parentgroup.build_filter_url(filterobject=self,
                                                 mode='add', values=values)

    def build_remove_values_url(self, values):
        """
        Get the URL that removes the given values for this filter to the current url.

        This is not the same as :meth:`.build_clear_values_url`. This method is for
        multiselect filters where the user can add/remove valuess to the filter
        (typically via checkboxes).

        You should not need to override this, but you will use it in your
        template context to render urls for choices if your filter
        uses multiselect.
        """
        return self.parentgroup.build_filter_url(filterobject=self,
                                                 mode='remove', values=values)

    def get_base_css_classes(self):
        return 'django-cradmin-listfilter-filter'

    def set_values(self, values):
        self.cleaned_values = self.clean_values(values)
        self.values = values

    def clean_value(self, value):
        """
        Called by :meth:`.clean_values` to clean a single value.
        """
        return value

    def clean_values(self, values):
        """
        Clean the values, to prepare them for usage in :meth:`.add_to_queryobject`.

        Defaults to returning the values unchanged, but you will typically
        want to override this if your filter allows the user to type in a
        values, or if you want to convert the values from a string into
        something that makes sense for your :meth:`.add_to_queryobject`.

        If you want validation, you should handle that by setting some
        attribute on ``self``, and handle the error in the template
        rendering the filter (and most likely not add anything
        to the queryobject in :meth:`.add_to_queryobject`).
        """
        return [self.clean_value(value) for value in values]

    def add_to_queryobject(self, queryobject):
        """
        Add the current value to the given ``queryobject``.

        This is always called unless the ``filter_string`` is
        None or empty string.

        The type of the queryobject depends on the query backend.
        If you are filtering against the Django ORM, this will
        typically be a QuerySet, but for other backends such
        as ElasticSearch, MongoDB, etc. this can be something
        completely different such as a dict.
        """


# listfilter.single.selectinput.Text
# listfilter.single.selectinput.Int
# listfilter.multi.selectinput.Text


class InvalidFiltersStringError(Exception):
    """
    Raised when :class:`.FiltersStringParser` fails for some reason.
    """


class FiltersHandler(object):
    """
    Parser of the ``filters_string``. See :meth:`.Group.parse_filters_string`.
    """

    #: The string separating filters in the filters string. Defaults to ``"/"``.
    filter_separator = '/'

    #: The string used to separate filter slug and value.
    #: It does not matter if this also appears in the value,
    #: we handle that by splitting with a maxsplit of 1.
    #:
    #: Defaults to ``"-"``.
    slug_and_value_separator = '-'

    #: The string used to separate multivalue strings.
    #: This string can not appear in any value used by the filter.
    #:
    #: Defaults to ``","``.
    multivalue_separator = ','

    def __init__(self):
        self.filtermap = OrderedDict()
        self._parse_called = False

    def parse_filter_value(self, value):
        value = urllib.parse.unquote(value)
        return value.split(self.multivalue_separator)

    def parse_filter_string(self, filter_string):
        if self.slug_and_value_separator not in filter_string:
            raise InvalidFiltersStringError('"{}" does not contain "{}".'.format(
                filter_string, self.slug_and_value_separator))
        slug, value = filter_string.split(self.slug_and_value_separator, 1)
        return slug, self.parse_filter_value(value)

    def parse(self, filters_string):
        if self._parse_called:
            raise RuntimeError('Can not call parse multiple times on a FiltersHandler.')
        self._parse_called = True

        if not filters_string:
            return

        filters_string = filters_string.strip(self.filter_separator)
        for filter_string in filters_string.split(self.filter_separator):
            slug, values = self.parse_filter_string(filter_string)
            if slug not in self.filtermap:
                raise InvalidFiltersStringError('"{}" is not a valid filter slug.'.format(slug))
            self.filtermap[slug].set_values(values)

    def to_valuesdict(self):
        valuesdict = {}
        for slug, filterobject in self.filtermap.items():
            if filterobject.values:
                valuesdict[slug] = self.multivalue_separator.join(filterobject.values)
        return valuesdict

    def add_filter(self, filterobject):
        self.filtermap[filterobject.get_slug()] = filterobject

    def build_values_based_on_mode(self, filterobject, mode, values):
        if mode == 'set':
            return values
        elif mode == 'clear':
            return []
        elif mode == 'add':
            return filterobject.values + values
        elif mode == 'remove':
            new_values = list(filterobject.values)
            values_to_remove = values
            for value in new_values:
                if value in values_to_remove:
                    new_values.remove(value)
            return new_values
        else:
            raise ValueError('Invalid mode: {}'.format(mode))

    def build_filter_url(self, filterobject, mode, values=None):
        for filterslug, current_filterobject in self.filtermap.items():
            if current_filterobject == filterobject:
                values = self.build_values_based_on_mode(
                    filterobject=filterobject, mode=mode, values=values)
            else:
                values = current_filterobject.values


class Group(AbstractGroupChild):
    """
    Defines a group of :class:`.AbstractFilter` objects.
    """
    template_name = 'django_cradmin/viewhelpers/listfilter/base/group.django.html'

    def __init__(self, *args, **kwargs):
        super(Group, self).__init__(*args, **kwargs)
        self.children = []
        self.set_filters_string_called = False
        self.filtershandler = self.get_filters_handler_class()()

    def get_filters_handler_class(self):
        return FiltersHandler

    def get_title(self):
        """
        Get the title for the filtergroup.

        This is optional - it defaults to ``None``.
        """
        return None

    def get_dom_id(self):
        """
        Get the DOM id of this group. We use this to generate
        URLs that scroll back to the group after reloading the
        page when applying a filter.

        Must be overridden in subclasses.
        """
        raise NotImplementedError()

    def append(self, child):
        """
        Add subclass of :class:`django_cradmin.renderable.AbstractGroupChild`
        to the group.

        You will normally add subclasses of :class:`.AbstractFilter`
        or :class:`.Group`, but if you want to spice up
        the filter "box" with additional HTML, you can create a subclass of
        :class:`.AbstractGroupChild` and add an object of that class.
        """
        child.set_parentfiltergroup(self)
        self.children.append(child)
        if isinstance(child, AbstractFilter):
            self.filtershandler.add_filter(child)

    def get_base_css_classes_list(self):
        return ['django-cradmin-listfilter-group']

    def iter_renderables(self):
        return iter(self.children)

    def set_filters_string(self, filters_string):
        """
        Set the current value of the filters.

        If you use nested groups, you will only call this once on the
        toplevel group.

        Parameters:
            filter_string: The part of the URL that defines the filters.
                It is parsed by :meth:`.parse_filters_string`.

        Raises:
            InvalidFiltersStringError: When the ``filter_string`` can not be parsed.
                You will normally want to catch this, and show an error message,
                or perhaps ignore it and redirect to the view without filters.
        """
        self.filtershandler.parse(filters_string=filters_string)
