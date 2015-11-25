from __future__ import unicode_literals
from collections import OrderedDict
import posixpath
import urllib
from django_cradmin.renderable import AbstractRenderableWithCss

from future import standard_library
standard_library.install_aliases()


class AbstractGroupChild(AbstractRenderableWithCss):
    """
    Base class for anything that can be added as a child of
    :class:`.AbstractFilterList`.
    """
    def __init__(self):
        self.filterlist = None

    def set_filterlist(self, filterlist):
        self.filterlist = filterlist


class AbstractFilter(AbstractGroupChild):
    """
    Defines a filter.
    """
    def __init__(self, slug=None):
        """
        Parameters:
            slug: You can send the slug as a parameter, or override :meth:`.get_slug`.
        """
        super(AbstractFilter, self).__init__()
        self.values = []
        self.slug = slug

    def copy(self):
        """
        Returns a copy of this filter.
        """
        copy = self.__class__()
        copy.set_values(list(self.values))
        return copy

    def get_slug(self):
        """
        Get the slug for this filter. The slug is used
        in the URL to identify the filter.

        If your users can change their language, this
        should not be translatable since that would
        make an URL unusable by a user with a different language
        (if a user shares an URL with another user).
        """
        if self.slug:
            return self.slug
        else:
            raise NotImplementedError('You must override get_slug(), or send a slug to __init__().')

    def set_values(self, values):
        """
        Change the current values stored in the filter to the given ``values``.
        """
        self.values = values

    def clear_values(self):
        """
        Clear the current values stored in the filter.
        """
        self.values = []

    def add_values(self, values):
        """
        Add the given list of ``values`` to the values currently stored
        in the filter.
        """
        self.values += values

    def remove_values(self, values):
        """
        Remove the given list of ``values`` from the values currently stored
        in the filter.
        """
        new_values = list(self.values)
        values_to_remove = values
        for value in new_values:
            if value in values_to_remove:
                new_values.remove(value)
        self.values = new_values

    def clean_value(self, value):
        """
        Called by :meth:`.clean_values` to clean a single value.
        """
        return value

    def get_clean_values(self):
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
        return [self.clean_value(value) for value in self.values]

    def build_set_values_url(self, values):
        """
        Get the URL that adds this filter with the given values to the current url.

        You should not need to override this, but you will use it in your
        template context to render urls for choices if your filter
        is a single select filter.
        """
        copy = self.copy()
        copy.set_values(values)
        return self.filterlist.filtershandler.build_filter_url(changed_filterobject=copy)

    def build_clear_values_url(self):
        """
        Get the URL that clears this filter from the current url.

        You should not need to override this, but you will use it in your
        template context to render urls for choices if your filter
        supports "clear".
        """
        copy = self.copy()
        copy.clear_values()
        return self.filterlist.filtershandler.build_filter_url(changed_filterobject=copy)

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
        copy = self.copy()
        copy.add_values(values)
        return self.filterlist.filtershandler.build_filter_url(changed_filterobject=copy)

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
        copy = self.copy()
        copy.remove_values(values)
        return self.filterlist.filtershandler.build_filter_url(changed_filterobject=copy)

    def get_base_css_classes(self):
        return 'django-cradmin-listfilter-filter'

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


class AbstractSingleValueFilter(AbstractFilter):
    def get_clean_value(self):
        """
        Returns the first value returned by :meth:`.AbstractFilter.get_clean_values`,
        or ``None`` if there is no values.
        """
        clean_values = self.get_clean_values()
        if len(clean_values) > 0:
            return clean_values[0]
        else:
            return None


# listfilter.single.selectinput.Text
# listfilter.single.selectinput.Int
# listfilter.multi.selectinput.Text


class InvalidFiltersStringError(Exception):
    """
    Raised when :class:`.FiltersStringParser` fails for some reason.
    """


class FiltersHandler(object):
    """
    Parser of the ``filters_string``. See :meth:`.AbstractFilterList.parse_filters_string`.
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

    def __init__(self, urlbuilder):
        """
        Parameters:
            urlbuilder: A method that takes a single argument, ``filters_string``,
                and returns an absolute URL with that string injected as the
                filters string. The filters_string is urlencoded, so you should
                be able to just forward it to ``reverse`` for your view.
        """
        self.filtermap = OrderedDict()
        self.urlbuilder = urlbuilder
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

    def add_filter(self, filterobject):
        """
        Add a :class:`.AbstractFilter`.
        """
        slug = filterobject.get_slug()
        if self.slug_and_value_separator in slug:
            raise ValueError('Invalid filter slug: "{}". Slugs can not contain "{}".'.format(
                slug, self.slug_and_value_separator))
        self.filtermap[slug] = filterobject

    def build_filter_string(self, slug, values):
        """
        Build a filter string suitable for an URL from the given
        ``slug`` and ``values``.

        Parameters:
            slug: See :meth:`.AbstractFilter.get_slug`.
            value: A list of values. All items in the list must be strings.
        """
        return '{slug}{separator}{values}'.format(
            slug=slug,
            separator=self.slug_and_value_separator,
            values=self.multivalue_separator.join(values))

    def build_filters_string(self, changed_filterobject):
        filters_strings = []
        for slug, filterobject in self.filtermap.items():
            if filterobject.get_slug() == changed_filterobject.get_slug():
                values = changed_filterobject.values
            else:
                values = filterobject.values
            if values:
                filters_strings.append(self.build_filter_string(slug=slug, values=values))
        return self.filter_separator.join(filters_strings)

    def build_filter_url(self, changed_filterobject):
        filters_string = self.build_filters_string(changed_filterobject=changed_filterobject)
        return self.urlbuilder(filters_string=urllib.parse.quote(filters_string))


class AbstractFilterList(AbstractRenderableWithCss):
    """
    Defines a set of :class:`.AbstractFilter` objects.

    .. note:: This is not really an abstract class - it works on it own,
       but it should never be used directly. We provide subclasses that
       provide basis for rendereing, and if you want something totally different,
       you should not use this directly, but create a subclass and override
       :meth:`~django_cradmin.renderable.AbstractRenderableWithCss.get_base_css_classes_list`
       or :meth:`~django_cradmin.renderable.AbstractRenderableWithCss.get_extra_css_classes_list`
       (see their docs for their intended use cases).
    """
    template_name = 'django_cradmin/viewhelpers/listfilter/base/filterlist.django.html'

    def __init__(self, urlbuilder):
        """
        Parameters:
            urlbuilder: See :class:`.FiltersHandler`.
        """
        super(AbstractFilterList, self).__init__()
        self.children = []
        self.set_filters_string_called = False
        self.filtershandler = self.get_filters_handler_class()(urlbuilder=urlbuilder)

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
        Get the DOM id of this filterlist. We use this to generate
        URLs that scroll back to the filterlist after reloading the
        page when applying a filter.

        Must be overridden in subclasses.
        """
        raise NotImplementedError()

    def append(self, child):
        """
        Add subclass of :class:`django_cradmin.renderable.AbstractGroupChild`
        to the filterlist.

        You will normally add subclasses of :class:`.AbstractFilter`
        but if you want to spice up the filter "box" with additional HTML,
        you can create a subclass of :class:`.AbstractGroupChild` and
        add an object of that class.
        """
        child.set_filterlist(self)
        self.children.append(child)
        if isinstance(child, AbstractFilter):
            self.filtershandler.add_filter(child)

    def get_base_css_classes_list(self):
        return ['django-cradmin-listfilter-filterlist']

    def iter_renderables(self):
        """
        Iterate over all the renderables (children) of the filterlist.
        """
        return iter(self.children)

    def set_filters_string(self, filters_string):
        """
        Set the current value of the filters.

        If you use nested groups, you will only call this once on the
        toplevel filterlist.

        Parameters:
            filter_string: The part of the URL that defines the filters.
                It is parsed by :meth:`.parse_filters_string`.

        Raises:
            InvalidFiltersStringError: When the ``filter_string`` can not be parsed.
                You will normally want to catch this, and show an error message,
                or perhaps ignore it and redirect to the view without filters.
        """
        self.filtershandler.parse(filters_string=filters_string)
