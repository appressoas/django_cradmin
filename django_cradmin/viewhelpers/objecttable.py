from collections import OrderedDict
import json
import re
import logging

from django.template.loader import render_to_string
from django.views.generic import ListView


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

    def __init__(self, view, columnindex):
        self.view = view
        self.columnindex = columnindex
        if self.is_sortable():
            self.orderinginfo = self.view._get_orderinginfo_for_column(self.columnindex)

    def get_header(self):
        if self.modelfield:
            field = self.view.model._meta.get_field(self.modelfield)
            return field.verbose_name
        else:
            raise NotImplementedError()

    def reverse_appurl(self, name, args=[], kwargs={}):
        return self.view.request.cradmin_app.reverse_appurl(name, args=args, kwargs=kwargs)

    def render_value(self, obj):
        if self.modelfield:
            return getattr(obj, self.modelfield)
        else:
            raise NotImplementedError()

    def render_cell(self, obj):
        raise NotImplementedError()

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

    def is_ordered_ascending(self):
        return self.is_ordered() and self.orderinginfo.order_ascending == True

    def is_ordered_descending(self):
        return self.is_ordered() and self.orderinginfo.order_ascending == False

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
            raise NotImplementedError('You must override get_ordering, set orderingfield or set modelfield.')


class PlainTextColumn(Column):
    template_name = 'django_cradmin/viewhelpers/objecttable/plaintextcolumn-cell.django.html'

    def render_cell(self, obj):
        return render_to_string(self.template_name, {
            'object': obj,
            'value': self.render_value(obj),
        })


class SingleActionColumn(Column):
    template_name = 'django_cradmin/viewhelpers/objecttable/singleactioncolumn-cell.django.html'

    def __init__(self, **kwargs):
        super(SingleActionColumn, self).__init__(**kwargs)

    def get_actionurl(self, obj):
        raise NotImplementedError()

    def render_cell(self, obj):
        return render_to_string(self.template_name, {
            'object': obj,
            'value': self.render_value(obj),
            'action_url': self.get_actionurl(obj),
        })


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

    def render_cell(self, obj):
        return render_to_string(self.template_name, {
            'object': obj,
            'value': self.render_value(obj),
            'buttons': self.get_buttons(obj),
        })


class Button(object):
    """
    A pythonic interface for creating a HTML link styled as a button.

    Used by:

    - :meth:`.ObjectTableView.get_buttons`.
    - :meth:`.MultiActionColumn.get_buttons`
    """
    template_name = 'django_cradmin/viewhelpers/objecttable/button.django.html'

    def __init__(self, label, url, buttonclass='default', icon=None):
        self.label = label
        self.url = url
        self.icon = icon
        self.buttonclass = buttonclass

    def render(self):
        return render_to_string(self.template_name, {
            'label': self.label,
            'url': self.url,
            'icon': self.icon,
            'buttonclass': self.buttonclass,
        })


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

    #: The model class to list objects for. You do not have to specify
    #: this, but if you do not specify this, you have to override
    #: :meth:`.get_pagetitle`.
    model = None

    #: Defines the columns in the table. See :meth:`.get_columns`.
    columns = []

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

    def get_queryset(self):
        """
        DO NOT override this. Override :meth:`.get_queryset_for_role`
        instead.
        """
        queryset = self.get_queryset_for_role(self.request.cradmin_role)
        orderby = []
        for columnobject, orderinginfo in self._iter_columnobjects_with_orderinginfo():
            orderby.extend(columnobject.get_orderby_args(orderinginfo.order_ascending))
        if orderby:
            queryset = queryset.order_by(*orderby)
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
        context['multicolumn_ordering'] = len(self.__parse_orderingstring()) > 1
        return context

    def __parse_orderingstring(self):
        if not hasattr(self, '__orderingstringparser'):
            orderingstring = self.request.GET.get('ordering', None)
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

    def _iter_columnobjects_with_orderinginfo(self):
        columnobjects = self._get_columnobjects()
        for orderinginfo in self.__parse_orderingstring().orderingdict.itervalues():
            try:
                columnobject = columnobjects[orderinginfo.columnindex]
            except IndexError:
                pass
            else:
                yield (columnobject, orderinginfo)
