from django.conf import settings
from django.template import defaultfilters
from django.views.generic import ListView
from django_cradmin.viewhelpers import listbuilder
from django.utils.translation import ugettext_lazy as _
from django_cradmin.viewhelpers.listfilter import listfilter_viewmixin


class ViewMixin(object):
    """
    Listbuilder view mixin. Must be mixin in before any Django View subclass.

    This is typically used with a Django ListView or TemplateView.
    The mixin is not dependent on any specific backend, so it works
    no matter where you get your data from (database, mongodb, elasticsearch, ...).

    For a ready to use view that extends this to work with Django model objects,
    see :class:`.View`.

    The ViewMixin works much like :class:`.View`, but you must override/implement:

    - :meth:`.get_pagetitle`
    - :meth:`.get_listbuilder_list_data`
    - :meth:`.get_no_items_message`

    Examples:

        Minimal example with data from a list::

            class

    """
    template_name = 'django_cradmin/viewhelpers/listbuilderview/default.django.html'

    #: See :meth:`~ViewMixin.get_listbuilder_class`.
    listbuilder_class = listbuilder.list.RowList

    #: See :meth:`~ViewMixin.get_value_renderer_class`.
    value_renderer_class = listbuilder.base.ItemValueRenderer

    #: See :meth:`~ViewMixin.get_frame_renderer_class`.
    frame_renderer_class = None

    #: Set this to True to hide the page header. See :meth:`~.FormViewMixin.get_hide_page_header`.
    hide_page_header = False

    def get_pagetitle(self):
        """
        Get the page title (the title tag).

        Must be implemented in subclasses.
        """
        raise NotImplementedError()

    def get_pageheading(self):
        """
        Get the page heading.

        Defaults to :meth:`.get_pagetitle`.
        """
        return self.get_pagetitle()

    def get_hide_page_header(self):
        """
        Return ``True`` if we should hide the page header.

        You can override this, or set :obj:`.hide_page_header`, or hide the page header
        in all form views with the ``DJANGO_CRADMIN_HIDE_PAGEHEADER_IN_LISTVIEWS`` setting.
        """
        return self.hide_page_header or getattr(settings, 'DJANGO_CRADMIN_HIDE_PAGEHEADER_IN_LISTVIEWS', False)

    def get_listbuilder_class(self):
        """
        Get a subclass of :class:`django_cradmin.viewhelpers.listbuilder.base.List`.

        Defaults to :obj:`.ViewMixin.listbuilder_class`.
        """
        return self.listbuilder_class

    def get_listbuilder_list_kwargs(self):
        """
        Get kwargs for :meth:`.get_listbuilder_class`.
        """
        return {}

    def get_value_renderer_class(self):
        """
        Get a subclass of :class:`django_cradmin.viewhelpers.listbuilder.base.ItemValueRenderer`.

        Defaults to :obj:`.ViewMixin.value_renderer_class`.
        """
        return self.value_renderer_class

    def get_frame_renderer_class(self):
        """
        Get a subclass of :class:`django_cradmin.viewhelpers.listbuilder.base.ItemFrameRenderer`.

        Defaults to :obj:`.ViewMixin.frame_renderer_class`.
        """
        return self.frame_renderer_class

    def get_listbuilder_list_value_iterable(self, context):
        """
        Get the value_iterable for the listbuilder list.

        Must be overridden in subclasses.

        Parameters:
            context: The Django template context.
        """
        raise NotImplementedError()

    def get_listbuilder_list(self, context):
        """
        Get the listbuilder List object.

        You normally do not have to override this, but instead you should
        override:

        - :meth:`.get_listbuilder_list_value_iterable`
        - :meth:`.get_value_renderer_class`
        - :meth:`.get_frame_renderer_class`
        - :meth:`.get_listbuilder_list_kwargs`

        Parameters:
            context: The Django template context.
        """
        return self.get_listbuilder_class().from_value_iterable(
            value_iterable=self.get_listbuilder_list_value_iterable(context),
            value_renderer_class=self.get_value_renderer_class(),
            frame_renderer_class=self.get_frame_renderer_class(),
            **self.get_listbuilder_list_kwargs())

    def get_no_items_message(self):
        """
        Get the message to show when there are no items.

        Must be overridden in subclasses.
        """
        raise NotImplementedError()

    def add_listview_context_data(self, context):
        context['listbuilder_list'] = self.get_listbuilder_list(context)
        context['pagetitle'] = self.get_pagetitle()
        context['hide_pageheader'] = self.get_hide_page_header()
        context['pageheading'] = self.get_pageheading()
        context['no_items_message'] = self.get_no_items_message()

    def get_context_data(self, **kwargs):
        context = super(ViewMixin, self).get_context_data(**kwargs)
        self.add_listview_context_data(context)
        return context


class View(ViewMixin, ListView):
    """
    View using the :doc:`viewhelpers_listbuilder`.

    Examples:

        Minimal::

            class MyView(listbuilderview.View):
                def get_queryset(self):
                    return MyModel.objects.all()

    """

    #: The model class to list objects for. You do not have to specify
    #: this, but if you do not specify this or :meth:`~.ObjectTableView.get_model_class`,
    #: you have to override :meth:`~.ObjectTableView.get_pagetitle` and
    #: :meth:`~.ObjectTableView.get_no_items_message`.
    model = None

    def get_model_class(self):
        """
        Get the model class to list objects for.

        Defaults to :obj:`.model`. See :obj:`.model` for more info.
        """
        return self.model

    def get_pagetitle(self):
        """
        Get the page title (the title tag).

        Defaults to the ``verbose_name_plural`` of the :obj:`.model`
        with the first letter capitalized.
        """
        return defaultfilters.capfirst(self.get_model_class()._meta.verbose_name_plural)

    def get_listbuilder_list_value_iterable(self, context):
        return context['object_list']

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
        return queryset

    def get_no_items_message(self):
        """
        Get the message to show when there are no items.
        """
        return _('No %(modelname_plural)s') % {
            'modelname_plural': self.get_model_class()._meta.verbose_name_plural.lower(),
        }


class FilterListMixin(listfilter_viewmixin.ViewMixin):
    """
    Mixin for adding filtering with :doc:`filterlist <filterlist>` to a
    listbuilder view.

    Must be mixed in before any TemplateView subclass.

    Examples:

        TODO
    """
    def get_filterlist_position(self):
        """
        Get the position where you want to place the filterlist.

        Supported values are:

        - left
        - right (the default)
        - top
        """
        return 'right'

    def get_filterlist_template_name(self):
        """
        Get the template to use based on what :meth:`.get_filterlist_position`.

        You will want to call this from the ``get_template_names`` method.
        This is just the interface, refer to the mixins implemented in
        various modules (such as :class:`django_cradmin.viewhelpers.listbuilderview.FilterListMixin`)
        for details on how to use this method.
        """
        position = self.get_filterlist_position()
        template_name = 'django_cradmin/viewhelpers/listbuilderview/filterlist-{}.django.html'.format(position)
        return template_name

    def get_filter_unprotected_querystring_arguments(self):
        """
        This returns ``{'page'}``, which ensures we go back to
        page 1 when changing a filter.

        See :class:`django_cradmin.viewhelpers.listfilter.listfilter_viewmixin.ViewMixin`
        for more details.
        """
        return {'page'}
