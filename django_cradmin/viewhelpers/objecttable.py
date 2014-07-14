import json
from django.template.loader import render_to_string
from django.views.generic import ListView


class Column(object):
    modelfield = None

    def __init__(self, view=None):
        self.view = view

    def get_header(self):
        if self.modelfield:
            field = self.view.model._meta.get_field(self.modelfield)
            return field.verbose_name
        else:
            raise NotImplementedError()

    def reverse_appurl(self, name, args=[], kwargs={}):
        return self.view.request.cradmin_app.reverse_appurl(name,
            args=args, kwargs=kwargs)

    def render_value(self, obj):
        if self.modelfield:
            return getattr(obj, self.modelfield)
        else:
            raise NotImplementedError()

    def render_cell(self, obj):
        raise NotImplementedError()


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
    paginate_by = 30
    template_name = 'django_cradmin/viewhelpers/objecttable/objecttable.django.html'

    #: The model class to list objects for. You do not have to specify
    #: this, but if you do not specify this, you have to override
    #: :meth:`.get_pagetitle`.
    model = None

    #: Defines the columns in the table. See :meth:`.get_columns`.
    columns = [None]

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
        queryset = self.get_queryset_for_role(self.request.cradmin_role)
        # TODO: Support filters
        return queryset

    def _get_columns(self):
        """
        Build the :obj:`.columns` list into a list of :class:`Column` objects.
        """
        if not hasattr(self, '_columns'):
            self._columns = []
            for columnclass in self.columns:
                if isinstance(columnclass, basestring):
                    columnclass = type('SimpleColumn', (PlainTextColumn,),
                        dict(modelfield=columnclass))
                self._columns.append(columnclass(view=self))
        return self._columns

    def _create_row(self, obj):
        return {
            'object': obj,
            'cells': [column.render_cell(obj) for column in self._get_columns()]
        }

    def _iter_table(self, object_list):
        for obj in object_list:
            yield self._create_row(obj)

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
        context['columns'] = self._get_columns()
        context['table'] = list(self._iter_table(object_list))
        context['buttons'] = self.get_buttons()
        return context
