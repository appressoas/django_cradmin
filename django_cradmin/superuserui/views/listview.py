import json

from django.db import models
from django.utils.translation import ugettext_lazy

from django_cradmin.superuserui.views import mixins
from django_cradmin.viewhelpers import listbuilder
from django_cradmin.viewhelpers import listbuilderview
from django_cradmin.viewhelpers import listfilter
from django_cradmin.viewhelpers import multiselect2


class BaseView(listbuilderview.FilterListMixin,
               mixins.QuerySetForRoleMixin,
               listbuilderview.View):
    paginate_by = 50

    def get_search_fields(self):
        """
        Get a list with the names of the fields to use while searching.

        Defaults to the ``id`` field and all CharField and TextField on the model.
        """
        fields = ['id']
        for field in self.get_model_class()._meta.get_fields():
            if isinstance(field, (models.CharField, models.TextField)):
                fields.append(field.name)
        return fields

    def add_filterlist_items(self, filterlist):
        search_fields = self.get_search_fields()
        if search_fields:
            filterlist.append(listfilter.django.single.textinput.Search(
                slug='search',
                label=ugettext_lazy('Search'),
                label_is_screenreader_only=True,
                modelfields=search_fields))

    def get_queryset_for_role(self, role=None, apply_filters=True):
        queryset = super(BaseView, self)\
            .get_queryset_for_role(role=role)
        if apply_filters:
            queryset = self.get_filterlist().filter(queryset)  # Filter by the filter list
            queryset = queryset.distinct()
        return queryset


class View(listbuilderview.ViewCreateButtonMixin,
           BaseView):
    value_renderer_class = listbuilder.itemvalue.EditDelete

    def get_filterlist_url(self, filters_string):
        return self.request.cradmin_app.reverse_appurl(
            'filter', kwargs={'filters_string': filters_string})

    def get_datetime_filter_fields(self):
        return [
            field for field in self.get_model_class()._meta.get_fields()
            if isinstance(field, models.DateTimeField)]

    def add_datetime_filters(self, filterlist):
        datetime_filter_fields = self.get_datetime_filter_fields()
        for field in datetime_filter_fields:
            filterlist.append(listfilter.django.single.select.DateTime(
                slug=field.name, label=field.verbose_name))

    def add_filterlist_items(self, filterlist):
        super(View, self).add_filterlist_items(filterlist=filterlist)
        self.add_datetime_filters(filterlist=filterlist)


class ForeignKeySelectView(BaseView):
    value_renderer_class = listbuilder.itemvalue.UseThis
    hide_menu = True

    def get_filterlist_position(self):
        return 'top'

    def get_filterlist_url(self, filters_string):
        return self.request.cradmin_app.reverse_appurl(
            'foreignkeyselect-filter', kwargs={'filters_string': filters_string})


class ManyToManySelectView(BaseView):
    hide_menu = True
    value_renderer_class = multiselect2.listbuilder_itemvalues.ManyToManySelect
    target_renderer_class = multiselect2.target_renderer.ManyToManySelectTarget

    def get_filterlist_position(self):
        return 'top'

    def get_filterlist_url(self, filters_string):
        return self.request.cradmin_app.reverse_appurl(
            'manytomanyselect-filter', kwargs={'filters_string': filters_string})

    def get_selected_values_list(self):
        return json.loads(self.request.GET['manytomany_select_current_value'])

    def get_selected_objects(self):
        return self.get_queryset_for_role(self.request.cradmin_role, apply_filters=False)\
            .filter(pk__in=self.get_selected_values_list())

    def get_target_renderer_class(self):
        return self.target_renderer_class

    def get_target_renderer_kwargs(self):
        return {}
        # return {
        #     'selected_values_iterable': self.get_selected_values_iterable(),
        # }

    def should_include_previously_selected(self):
        if hasattr(self, 'get_filters_string') and self.get_filters_string():
            return False
        elif self.paginate_by:
            page_kwarg = self.page_kwarg
            page = self.kwargs.get(page_kwarg) or self.request.GET.get(page_kwarg) or 1
            return str(page) == '1'
        else:
            return True

    def get_queryset_for_role(self, role=None, apply_filters=True):
        queryset = super(ManyToManySelectView, self).get_queryset_for_role(role=role, apply_filters=apply_filters)
        if self.should_include_previously_selected() and apply_filters:
            # We have to exclude the selected values because we add them
            # to the listbuilder list as selected items in :meth:`.get_listbuilder_list`.
            queryset = queryset.exclude(pk__in=self.get_selected_values_list())
        return queryset

    def get_listbuilder_list(self, context):
        listbuilder_list = super(ManyToManySelectView, self).get_listbuilder_list(context=context)
        value_renderer_class = self.get_value_renderer_class()
        frame_renderer_class = self.get_frame_renderer_class()
        if self.should_include_previously_selected():
            listbuilder_list.extend_with_values(
                value_iterable=self.get_selected_objects(),
                value_renderer_class=value_renderer_class,
                frame_renderer_class=frame_renderer_class,
                value_and_frame_renderer_kwargs={
                    'is_selected': True
                })
        return listbuilder_list

    def get_target_renderer(self):
        targer_renderer_class = self.get_target_renderer_class()
        return targer_renderer_class(**self.get_target_renderer_kwargs())

    def add_filterlist_items(self, filterlist):
        super(ManyToManySelectView, self).add_filterlist_items(filterlist=filterlist)
        filterlist.append(self.get_target_renderer())
