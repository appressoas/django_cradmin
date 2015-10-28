from django.conf import settings
from django.template import defaultfilters
from django.views.generic import ListView
from django_cradmin.viewhelpers import listbuilder
from django.utils.translation import ugettext_lazy as _


class View(ListView):
    """
    View using the :doc:`viewhelpers_listbuilder`.

    Examples:

        Minimal::

            class MyView(listbuilderview.View):
                def get_queryset(self):
                    return MyModel.objects.all()

    """
    listbuilder_class = listbuilder.base.List
    value_renderer_class = listbuilder.base.ItemValueRenderer
    frame_renderer_class = None
    template_name = 'django_cradmin/viewhelpers/listbuilderview.django.html'

    #: Set this to True to hide the page header. See :meth:`~.FormViewMixin.get_hide_page_header`.
    hide_page_header = False

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
        return self.listbuilder_class

    def get_listbuilder_list_kwargs(self):
        return {}

    def get_value_renderer_class(self):
        return self.value_renderer_class

    def get_frame_renderer_class(self):
        return self.frame_renderer_class

    def get_listbuilder_list(self, context):
        items = context['object_list']
        return self.get_listbuilder_class().from_value_iterable(
            value_iterable=items,
            value_renderer_class=self.get_value_renderer_class(),
            frame_renderer_class=self.get_frame_renderer_class(),
            **self.get_listbuilder_list_kwargs())

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

    def get_context_data(self, **kwargs):
        context = super(View, self).get_context_data(**kwargs)
        context['listbuilder_list'] = self.get_listbuilder_list(context)
        context['pagetitle'] = self.get_pagetitle()
        context['hide_pageheader'] = self.get_hide_page_header()
        context['pageheading'] = self.get_pageheading()
        context['no_items_message'] = self.get_no_items_message()
        return context
