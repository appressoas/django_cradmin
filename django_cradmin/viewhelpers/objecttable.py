from collections import OrderedDict
import json
import re
import logging
from xml.sax.saxutils import quoteattr
from django import forms
from django.shortcuts import get_object_or_404
from django.template import defaultfilters
from django.template.defaultfilters import truncatechars
from django.utils.http import urlencode
from django.utils.translation import ugettext_lazy as _
from django.template.loader import render_to_string
from django.views.generic import ListView
from django.db import models


logger = logging.getLogger(__name__)


class Column(object):

    #: The model field rendered in this column. It is not required,
    #: but if you do not, you have to override :meth:`.get_header`
    #: and :meth:`.render_value`.
    modelfield = None

    #: A field to use for ordering of this model. Can also be a join, like ``company__name``.
    #: If this is not specified, :obj:`.modelfield` is used. If none of them are used,
    #: or if you want to sort using multiple fields, you must override :meth:`.get_orderby_args`
    #: and :meth:`.is_sortable`.
    orderingfield = None

    #: The template used to render a cell in the Column.
    template_name = None

    #: The column width. See :meth:`.get_column_width`.
    column_width = None

    #: The name of the template context object.
    #: The object is always available as ``object``, but you
    #: can override this to make it available by another name.
    context_object_name = None

    #: The name of the template context variable containing the return value from
    #: meth:`.get_value`.
    #: This is always available as ``value``, but you
    #: can override this to make it available by another name.
    context_value_name = None

    def __init__(self, view, columnindex):
        self.view = view
        self.columnindex = columnindex

    def get_header(self):
        """
        Get the header of the column. Defaults to the ``verbose_name``
        of the :obj:`.modelfield`.
        """
        if self.modelfield:
            field = self.view.model._meta.get_field(self.modelfield)
            return field.verbose_name
        else:
            raise NotImplementedError()

    def get_column_width(self):
        """
        Returns the column width. Setting this is generally not recommended, but
        sometimes you need exact scaling of the column.

        Example legal values: ``"100px", "20%"``. Defaults to :obj:`.column_width`.
        """
        return self.column_width

    def get_headercell_css_style(self):
        """
        Get the css styles of the header cell of the column.
        Defaults to setting :meth:`.get_column_width` as a css style.

        You normally want to avoid setting styles with this and use
        :meth:`.get_headercell_css_class` instead, but this is provided for
        those cases where setting the style attribute is the only decent solution.
        """
        column_width = self.get_column_width()
        if column_width:
            return 'width: {}'.format(column_width)
        else:
            return ''

    def get_headercell_css_class(self):
        """
        Get the css class of the header cell of the column.
        Defaults to setting the ``objecttableview-sortable-header``
        class if :meth:`.is_sortable`.
        """
        if self.is_sortable():
            return 'objecttableview-sortable-header'
        else:
            return ''

    def reverse_appurl(self, name, args=[], kwargs={}):
        return self.view.request.cradmin_app.reverse_appurl(name, args=args, kwargs=kwargs)

    def render_value(self, obj):
        if self.modelfield:
            return getattr(obj, self.modelfield)
        else:
            raise NotImplementedError()

    def get_context_data(self, obj):
        """
        Get context data for rendering the cell (see :meth:`.render_cell`.
        """
        value = self.render_value(obj)
        context = {
            'value': value,
            'object': obj
        }
        if self.context_object_name:
            context[self.context_object_name] = obj
        if self.context_value_name:
            context[self.context_value_name] = value
        return context

    def render_cell(self, obj):
        """
        Render the cell using the template specifed in :obj:`.template_name`.
        """
        return render_to_string(self.template_name, self.get_context_data(obj=obj))

    def get_flip_ordering_url(self):
        """
        Used in the template to get the URL when a user clicks on the header.
        Should not be overridden.
        """
        return self.view._get_flip_ordering_url_for_column(self.columnindex)

    def get_remove_ordering_url(self):
        """
        Used in the template to get the URL when a user clicks on the remove ordering button in the header.
        Should not be overridden.
        """
        return self.view._get_remove_ordering_url_for_column(self.columnindex)

    @property
    def orderinginfo(self):
        if not hasattr(self, '_orderinginfo'):
            if self.is_sortable():
                self._orderinginfo = self.view._get_orderinginfo_for_column(self.columnindex)
            else:
                self._orderinginfo = None
        return self._orderinginfo

    def is_ordered(self):
        return self.orderinginfo and self.orderinginfo.order_ascending is not None

    def is_sortable(self):
        """
        Specifies if this column is sortable.

        Defaults to ``True`` if :obj:`.modelfield` or :obj:`.orderingfield`
        is defined.
        """
        return bool(self.modelfield) or bool(self.orderingfield)

    def get_orderby_args(self, order_ascending):
        """
        Get the a list of ``QuerySet.order_by`` arguments that should be applied
        when the user requests the given ``sortorder`` for this column.

        If you set :obj:`.orderingfield`, the value is generated from that. If
        :obj:`.orderingfield` is not defined, we fall back on :obj:`.modelfield`.

        Parameters:
            order_ascending (bool): ``True`` if we should return the orderby arguments
                for ascending ordering, and ``False`` for descending ordering.
        """
        sortprefix = ''
        if not order_ascending:
            sortprefix = '-'
        orderingfield = self.orderingfield or self.modelfield
        if orderingfield:
            return ['{}{}'.format(sortprefix, orderingfield)]
        else:
            raise NotImplementedError('You must override get_orderby_args, set orderingfield or set modelfield.')

    def get_default_order_is_ascending(self):
        """
        Determine if the default ordering for the field shown in this column is
        ascending.

        Returns:
            ``True`` if the default ordering is ascending.
            ``False`` if the default ordering is descending.
            ``None`` if no default ordering is configured for this column.
        """
        orderingfield = self.orderingfield or self.modelfield
        if orderingfield:
            default_ordering = self.view.model._meta.ordering
            descending_orderingfield = '-{}'.format(orderingfield)
            if orderingfield in default_ordering:
                return True
            elif descending_orderingfield in default_ordering:
                return False
            else:
                return None
        else:
            raise NotImplementedError(
                'You must return False from is_sortable(), override '
                'get_default_order_is_ascending(), set orderingfield or set modelfield.')


class PlainTextColumn(Column):
    template_name = 'django_cradmin/viewhelpers/objecttable/plaintextcolumn-cell.django.html'


class DatetimeColumn(PlainTextColumn):
    datetime_format = 'SHORT_DATETIME_FORMAT'

    def render_value(self, obj):
        value = super(DatetimeColumn, self).render_value(obj)
        if value is None:
            return None
        else:
            return defaultfilters.date(value, self.datetime_format)


class TruncatecharsPlainTextColumn(PlainTextColumn):
    """
    A variant of :class:`.PlainTextColumn` that truncates the text down to
    a configurable length. The length is configured in :obj:`.maxlength`.
    """

    #: Maximum length of the value displayed in the column.
    maxlength = 30

    def render_value(self, obj):
        value = super(TruncatecharsPlainTextColumn, self).render_value(obj)
        if value is None:
            return None
        else:
            return truncatechars(value, self.maxlength)


class SingleActionColumn(Column):
    template_name = 'django_cradmin/viewhelpers/objecttable/singleactioncolumn-cell.django.html'

    def __init__(self, **kwargs):
        super(SingleActionColumn, self).__init__(**kwargs)

    def get_actionurl(self, obj):
        raise NotImplementedError()

    def get_context_data(self, obj):
        context = super(SingleActionColumn, self).get_context_data(obj=obj)
        context['action_url'] = self.get_actionurl(obj)
        return context


class ImagePreviewColumn(Column):
    template_name = 'django_cradmin/viewhelpers/objecttable/imagepreviewcolumn-cell.django.html'

    #: See :meth:`.get_preview_format`
    preview_format = 'auto'

    #: See :meth:`.get_preview_width`
    preview_width = 100

    #: See :meth:`.get_preview_height`
    preview_height = 70

    def is_sortable(self):
        return False

    def get_preview_width(self):
        """
        Returns the width of the preview thumbnail. Can be overridden.
        Defaults to :obj:`.preview_width`, so you can just override that
        class variable instead of this method.
        """
        return self.preview_width

    def get_preview_height(self):
        """
        Returns the height of the preview thumbnail. Can be overridden.
        Defaults to :obj:`.preview_height`, so you can just override that
        class variable instead of this method.
        """
        return self.preview_height

    def get_preview_format(self):
        """
        Returns the format of the preview thumbnail. Can be overridden.
        Defaults to :obj:`.preview_format`, so you can just override that
        class variable instead of this method.
        """
        return self.preview_format

    def get_column_width(self):
        return u'{}px'.format(self.get_preview_width())

    def get_context_data(self, obj):
        context = super(ImagePreviewColumn, self).get_context_data(obj=obj)
        image_path = None
        imagefieldfile = self.render_value(obj)
        if imagefieldfile:
            image_path = imagefieldfile.name
        context.update({
            'image_path': image_path,
            'preview_width': self.get_preview_width(),
            'preview_height': self.get_preview_height(),
            'preview_format': self.get_preview_format()
        })
        return context


class MultiActionColumn(Column):
    template_name = 'django_cradmin/viewhelpers/objecttable/multiactioncolumn-cell.django.html'

    def __init__(self, **kwargs):
        super(MultiActionColumn, self).__init__(**kwargs)

    def get_buttons(self, obj):
        """
        Get an iterable over the buttons/actions for the given ``obj``.

        Returns:
            An iterable yielding :class:`.Button` objects.
        """
        raise NotImplementedError()

    def get_context_data(self, obj):
        context = super(MultiActionColumn, self).get_context_data(obj=obj)
        context['buttons'] = self.get_buttons(obj)
        return context


class UseThisActionColumn(Column):
    template_name = 'django_cradmin/viewhelpers/objecttable/usethisactioncolumn-cell.django.html'

    def __init__(self, **kwargs):
        super(UseThisActionColumn, self).__init__(**kwargs)

    def get_buttons(self, obj):
        """
        Get an iterable over the buttons/actions for the given ``obj``.

        Returns:
            An iterable yielding :class:`.Button` objects.
        """
        raise NotImplementedError()

    def get_context_data(self, obj):
        context = super(UseThisActionColumn, self).get_context_data(obj=obj)
        context['buttons'] = self.get_buttons(obj)
        return context


class Button(object):
    """
    A pythonic interface for creating a HTML link styled as a button.

    Used by:

    - :meth:`.ObjectTableView.get_buttons`.
    - :meth:`.MultiActionColumn.get_buttons`
    """
    template_name = 'django_cradmin/viewhelpers/objecttable/button.django.html'

    def __init__(self, label, url='#', buttonclass='default', icon=None):
        """
        Parameters:
            label (unicode): The label of the button.
            url (unicode): The url/href attribute of the button.
            icon (unicode): An icon to show alongside the label. Example: ``fa-thumbs-up``.
            buttonclass (unicode): The bootstrap css class suffix of the button (default|primany|success|danger).
        """
        self.label = label
        self.url = url
        self.icon = icon
        self.buttonclass = buttonclass

    def get_attributes(self):
        """
        Returns a dict of custom attributes to add to the button.
        They are automatically escaped before they are added to the button.
        """
        return {}

    def _iter_attributes(self):
        for key, value in self.get_attributes().iteritems():
            attrname = u'data-{}'.format(key)
            attrvalue = quoteattr(value)
            yield u'{}={}'.format(attrname, attrvalue)

    def render(self):
        return render_to_string(self.template_name, {
            'label': self.label,
            'url': self.url,
            'icon': self.icon,
            'buttonclass': self.buttonclass,
            'attributes': self._iter_attributes(),
        })


class PagePreviewButton(Button):
    """
    A button variant that uses the ``django-cradmin-page-preview-open-on-click``
    AngularJS directive to open a preview in an overlay containing an IFRAME.
    Works just like a regular button. The only difference is that the url is
    opened in the IFRAME in the overlay instead of in the current window.

    For this to work, you need to set :obj:`.ObjectTableView.enable_previews` to ``True``
    (or override :meth:`.ObjectTableView.get_enable_previews`).
    """
    def get_attributes(self):
        return {
            'django-cradmin-page-preview-open-on-click': self.url
        }


class UseThisButton(Button):
    """
    Button for :class:`.UseThisActionColumn`.
    """
    def __init__(self, view, label, obj, buttonclass='default', icon=None):
        self.view = view
        self.obj = obj
        super(UseThisButton, self).__init__(label=label, buttonclass=buttonclass, icon=icon)

    def get_attributes(self):
        attributes = {
            'django-cradmin-use-this': json.dumps({
                'value': self.obj.pk,
                'fieldid': self.view.request.GET['foreignkey_select_fieldid'],
                'preview': self.view.make_foreignkey_preview_for(self.obj)
            })
        }
        return attributes


class ForeignKeySelectButton(Button):
    """
    Used to make buttons that lead to views that handle foreign key selection.

    It is just like a normal :class:`.Button`, except that it requires a request
    object, and uses that to set success_url to the current URL.
    """
    def __init__(self, *args, **kwargs):
        request = kwargs.pop('request')
        super(ForeignKeySelectButton, self).__init__(*args, **kwargs)
        self.url = '{}?{}'.format(self.url, urlencode({
            'foreignkey_select_mode': '1',
            'success_url': request.get_full_path()
        }))


class MultiSelectAction(object):
    """
    Used to define multiselect actions for
    :meth:`.ObjectTableView.get_multiselect_actions`.
    """
    def __init__(self, label, url):
        self.label = label
        self.url = url

    def serialize(self):
        return {
            'label': unicode(self.label),
            'url': self.url
        }


class ColumnOrderingInfo(object):
    @classmethod
    def from_orderingstringentry(cls, orderingstringindex, orderingstringentry):
        order_ascending = orderingstringentry.startswith('a')
        columnindex = int(orderingstringentry[1:])
        return cls(
            orderingstringindex=orderingstringindex,
            columnindex=columnindex,
            order_ascending=order_ascending)

    @classmethod
    def create_orderingstringentry(cls, columnindex, order_ascending):
        if order_ascending:
            prefix = 'a'
        else:
            prefix = 'd'
        return '{}{}'.format(prefix, columnindex)

    def __init__(self, orderingstringindex, columnindex, order_ascending):
        self.orderingstringindex = orderingstringindex
        self.columnindex = columnindex
        self.order_ascending = order_ascending

    def to_orderingstringentry(self):
        return self.__class__.create_orderingstringentry(self.columnindex, self.order_ascending)

    def __str__(self):
        return '{}:{}'.format(self.orderingstringindex, self.to_orderingstringentry())


class OrderingStringParser(object):
    """
    Parses an ordering string (the ordering querystring argument for objecttable).

    Parameters:
        orderingstring (str):
            A ``.``-separated list of the character ``a`` or ``d`` followed by
            a 0-based column index. The character described the order we want
            to sort the column at the given index (a: ascending, d: descending).

            The order of the entries in the comma separated list has significance.
            For the sortstring ``a3,a1,a2``, we will sort by column 3 first,
            then by column 1 and then by column 2 (all ascending).

            Note that the OrderingStringParser only describes what columns to
            order and in what direction, not by what fields each column is ordered.
    """
    def __init__(self, orderingstring):
        self.orderingstring = orderingstring
        self.orderingdict = OrderedDict()
        if self.orderingstring:
            if re.match('^([ad]\d+\.)*([ad]\d+)$', self.orderingstring):
                for orderingstringindex, orderingstringentry in enumerate(self.orderingstring.split('.')):
                    orderinginfo = ColumnOrderingInfo.from_orderingstringentry(
                        orderingstringindex=orderingstringindex,
                        orderingstringentry=orderingstringentry)
                    self.orderingdict[orderinginfo.columnindex] = orderinginfo
            else:
                logger.debug('Invalid value for ordering: %r', self.orderingstring)

    def remove_column(self, columnindex):
        """
        Return an orderingstring on the same format as the one parsed by this class
        with the given ``columnindex`` removed.
        """
        out = []
        for index, orderinginfo in self.orderingdict.iteritems():
            if index != columnindex:
                out.append(orderinginfo.to_orderingstringentry())
        return '.'.join(out)

    def flip_column(self, columnindex):
        """
        Return an orderingstring on the same format as the one parsed by this class
        with the ordering direction of the given ``columnindex`` flipped/reversed.

        If the given column is not ordered, we add it last with ascending ordering.
        """
        out = []
        found = False
        for index, orderinginfo in self.orderingdict.iteritems():
            if index == columnindex:
                found = True
                order_ascending = not orderinginfo.order_ascending
                out.append(ColumnOrderingInfo.create_orderingstringentry(
                    columnindex=columnindex, order_ascending=order_ascending))
            else:
                out.append(orderinginfo.to_orderingstringentry())
        if not found:
            out.append(ColumnOrderingInfo.create_orderingstringentry(
                columnindex=columnindex, order_ascending=True))
        return '.'.join(out)

    def get(self, columnindex):
        return self.orderingdict.get(columnindex, None)

    def __len__(self):
        return len(self.orderingdict)


class SearchForm(forms.Form):
    search = forms.CharField(required=True)


class ObjectTableView(ListView):
    """
    A view inspired by the changelist in ``django.contrib.admin``.

    Lets say you use company as the role in your admin site, and
    you want each company to have a repository of documents that
    they can offer for download. To make a list of all uploaded
    documents, you would do something like this::

        from django_cradmin.viewhelpers.objecttable import ObjectTableView
        from myapp.models import Document

        class DocumentListView(ObjectTableView):
            model = Document

            def get_queryset_for_role(self, company):
                return self.model.objects.filter(
                    company=company)

    """
    #: Paginate by this number of items. You can safely override this.
    paginate_by = 30

    #: The template used to render the view. You can override this,
    #: but if you override it, you should extend the default template
    #: (django_cradmin/viewhelpers/objecttable/objecttable.django.html).
    template_name = 'django_cradmin/viewhelpers/objecttable/objecttable.django.html'

    #: Set this to ``True`` to make the template not render the menu.
    #: Very useful when creating foreign-key select views, and other views
    #: where you do not want your users to accidentally click out of the
    #: current view.
    hide_menu = False

    #: The model class to list objects for. You do not have to specify
    #: this, but if you do not specify this, you have to override
    #: :meth:`.get_pagetitle`.
    model = None

    #: Defines the columns in the table. See :meth:`.get_columns`.
    columns = []

    #: The fields to search.
    #: Setting this enables search. If you implement a custom
    #: :meth:`.filter_search` method that does not make use of
    #: ``searchfields``, you can override :meth:`.enable_search`
    #: instead of setting this to some fake value.
    searchfields = []

    #: The default implementation of :meth:`.filter_search` uses this comparator
    #: when searching the given :obj:`.searchfields`.
    search_comparator = 'icontains'

    #: The search placeholder text. See :meth:`.get_enable_previews`. Defaults to "Search...".
    search_placeholder_text = _('Search...')

    #: Enable previews? See :meth:`.get_enable_previews`. Defaults to ``False``.
    enable_previews = False

    def get_search_placeholder_text(self):
        """
        Returns the search placeholder text. Defaults to :obj:`.search_placeholder_text`.

        Only used if search is enabled (see :obj:`.searchfields`).
        """
        return self.search_placeholder_text

    def get_enable_previews(self):
        """
        If this returns ``True``, we enable previews. When previews are
        enabled, you can add :class:`.PagePreviewButton` to columns
        to show previews.

        Defaults to :obj:`.enable_previews`.
        """
        return self.enable_previews

    def get_multiselect_actions(self):
        """
        Multiselect actions. If this returns a non-empty iterator, each row
        has a cell with a select box in the first column. Selecting at least
        one of the rows will reveal a dropdown menu with all the available
        actions.

        Returns:
            An iterator (list, tuple, ...) yielding :class:`.MultiSelectAction`
            objects. Returns an empty list by default.
        """
        return []

    def get_columns(self):
        """
        Get the columns in the table. Defaults to :obj:`.columns`.

        A list where each entry can be the name of any field on the
        :class:`model`, or a subclass of :class:`.Column`.
        """
        return self.columns

    def get_buttons(self):
        """
        Override this to add some buttons/global actions for this table.

        Example::

            def get_buttons(self):
                app = self.request.cradmin_app
                return [
                    objecttable.Button('Create', url=app.reverse_appurl('create')),
                    objecttable.Button('Delete all', url=app.reverse_appurl('deleteall')),
                ]
        """
        return []

    def get_queryset_for_role(self, role):
        """
        Get a queryset with all objects of :obj:`.model`  that
        the current role can access.
        """
        raise NotImplementedError()

    def enable_search(self):
        """
        Enable search?

        The default implementation returns ``True`` if :obj:`.searchfields` is
        not empty.
        """
        return len(self.searchfields) > 0

    def get_queryset(self):
        """
        DO NOT override this. Override :meth:`.get_queryset_for_role`
        instead.
        """
        queryset = self.get_queryset_for_role(self.request.cradmin_role)
        orderby = []
        for columnobject, orderinginfo in self.__iter_columnobjects_with_orderinginfo():
            orderby.extend(columnobject.get_orderby_args(orderinginfo.order_ascending))
        if orderby:
            queryset = queryset.order_by(*orderby)
        if self.enable_search():
            searchform = SearchForm(self.request.GET)
            self.current_search = ''
            if searchform.is_valid():
                self.current_search = searchform.cleaned_data['search']
                queryset = self.filter_search(searchstring=self.current_search, queryset=queryset)
        return queryset

    def _get_columnobjects(self):
        """
        Build the :obj:`.columns` list into a list of :class:`Column` objects.
        """
        if not hasattr(self, '__columns'):
            self.__columns = []
            for columnindex, columnclass in enumerate(self.columns):
                if isinstance(columnclass, basestring):
                    columnclass = type('SimpleColumn', (PlainTextColumn,), dict(modelfield=columnclass))
                self.__columns.append(columnclass(view=self, columnindex=columnindex))
        return self.__columns

    def __create_row(self, obj):
        return {
            'object': obj,
            'cells': [column.render_cell(obj) for column in self._get_columnobjects()]
        }

    def __iter_table(self, object_list):
        for obj in object_list:
            yield self.__create_row(obj)

    def get_pagetitle(self):
        """
        Get the page title/heading.

        Defaults to the ``verbose_name_plural`` of the :obj:`.model`.
        """
        return self.model._meta.verbose_name_plural

    def _get_search_hidden_fields(self):
        for key, value in self.request.GET.iteritems():
            if key != 'search':
                yield key, value

    def _get_pager_extra_querystring(self):
        querystring = self.request.GET.copy()
        if 'page' in querystring:
            del querystring['page']
        if querystring:
            return urlencode(querystring)
        else:
            return ''

    def make_foreignkey_preview_for(self, obj):
        return unicode(obj)

    def _get_use_this_hidden_attribute(self):
        pk = self.request.GET['foreignkey_selected_value']
        obj = get_object_or_404(self.get_queryset_for_role(self.request.cradmin_role), pk=pk)
        data = json.dumps({
            'value': obj.pk,
            'fieldid': self.request.GET['foreignkey_select_fieldid'],
            'preview': self.make_foreignkey_preview_for(obj)
        })
        return quoteattr(data)

    def get_context_data(self, **kwargs):
        context = super(ObjectTableView, self).get_context_data(**kwargs)
        object_list = context['object_list']
        multiselect_actions = self.get_multiselect_actions()
        if multiselect_actions:
            context['multiselect_actions'] = json.dumps(
                [action.serialize() for action in multiselect_actions])
        context['pagetitle'] = self.get_pagetitle()
        context['columns'] = self._get_columnobjects()
        context['table'] = list(self.__iter_table(object_list))
        context['buttons'] = self.get_buttons()
        context['enable_search'] = self.enable_search()
        context['enable_previews'] = self.get_enable_previews()
        context['cradmin_hide_menu'] = self.hide_menu
        if self.enable_search():
            context['current_search'] = self.current_search
            context['search_hidden_fields'] = self._get_search_hidden_fields()
        context['pager_extra_querystring'] = self._get_pager_extra_querystring()
        context['multicolumn_ordering'] = len(self.__parse_orderingstring()) > 1

        # Handle foreignkey selection
        if 'foreignkey_selected_value' in self.request.GET:
            context['use_this_hidden_attribute'] = self._get_use_this_hidden_attribute()

        return context

    def __create_orderingstring_from_default_ordering(self):
        orderinglist = []
        for columnindex, columnobject in enumerate(self._get_columnobjects()):
            if columnobject.is_sortable():
                order_ascending = columnobject.get_default_order_is_ascending()
                if order_ascending is not None:
                    orderinglist.append(ColumnOrderingInfo.create_orderingstringentry(
                        columnindex=columnindex,
                        order_ascending=order_ascending
                    ))
        return '.'.join(orderinglist)

    def __parse_orderingstring(self):
        if not hasattr(self, '__orderingstringparser'):
            orderingstring = self.request.GET.get('ordering', None)
            if orderingstring is None:
                orderingstring = self.__create_orderingstring_from_default_ordering()
            self.__orderingstringparser = OrderingStringParser(orderingstring)
        return self.__orderingstringparser

    def _url_with_querystringarg_changed(self, querystringarg, newvalue):
        querystring = self.request.GET.copy()
        querystring[querystringarg] = newvalue
        return '{}?{}'.format(self.request.path, querystring.urlencode())

    def _get_flip_ordering_url_for_column(self, columnindex):
        return self._url_with_querystringarg_changed(
            querystringarg='ordering',
            newvalue=self.__parse_orderingstring().flip_column(columnindex))

    def _get_remove_ordering_url_for_column(self, columnindex):
        return self._url_with_querystringarg_changed(
            querystringarg='ordering',
            newvalue=self.__parse_orderingstring().remove_column(columnindex))

    def _get_orderinginfo_for_column(self, columnindex):
        return self.__parse_orderingstring().get(columnindex)

    def __iter_columnobjects_with_orderinginfo(self):
        columnobjects = self._get_columnobjects()
        for orderinginfo in self.__parse_orderingstring().orderingdict.itervalues():
            try:
                columnobject = columnobjects[orderinginfo.columnindex]
            except IndexError:
                pass
            else:
                yield (columnobject, orderinginfo)

    def filter_search(self, queryset, searchstring):
        """
        Filter the queryset on search.

        The default implementation uses :obj:`.search_comparator` to compare
        earch of the :obj:`.searchfields` with the given ``searchstring``.
        This does not give a very good search experience, but it works
        fine for small data sets.

        If you want to use a search engine, you should make sure your
        search engine can yield a list of ids/primary-keys, and override
        this method with something like this::

             def filter_search(self, queryset, searchstring):
                ids = my_searchengine.search(searchstring)
                return queryset.filter(id__in=ids)

        If you use a custom search engine, you will most likely also want
        to override :meth:`.enable_search` and just return ``True``.
        """
        if self.searchfields:
            query = None
            for fieldname in self.searchfields:
                kwargs = {
                    '{}__{}'.format(fieldname, self.search_comparator): searchstring
                }
                fieldquery = models.Q(**kwargs)
                if query:
                    query |= fieldquery
                else:
                    query = fieldquery
            queryset = queryset.filter(query).distinct()
        return queryset
