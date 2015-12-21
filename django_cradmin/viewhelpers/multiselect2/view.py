import json

from django_cradmin.viewhelpers import listbuilderview
from django_cradmin.viewhelpers.multiselect2 import listbuilder_itemvalues
from django_cradmin.viewhelpers.multiselect2 import target_renderer


class ViewMixin(object):
    hide_menu = True
    target_renderer_class = target_renderer.ManyToManySelectTarget

    def get_selected_values_list(self):
        return json.loads(self.request.GET['manytomany_select_current_value'])

    def get_selected_objects(self):
        if hasattr(self, 'get_unfiltered_queryset_for_role'):
            queryset = self.get_unfiltered_queryset_for_role(self.request.cradmin_role)
        else:
            queryset = self.get_queryset_for_role(self.request.cradmin_role)
        return queryset.filter(pk__in=self.get_selected_values_list())

    def should_include_previously_selected(self):
        if hasattr(self, 'get_filters_string') and self.get_filters_string():
            return False
        elif getattr(self, 'paginate_by', None):
            page_kwarg = self.page_kwarg
            page = self.kwargs.get(page_kwarg) or self.request.GET.get(page_kwarg) or 1
            return str(page) == '1'
        else:
            return True

    def get_queryset_for_role(self, role=None):
        queryset = super(ViewMixin, self).get_queryset_for_role(role=role)
        if self.should_include_previously_selected():
            # We have to exclude the selected values because we add them
            # to the listbuilder list as selected items in :meth:`.get_listbuilder_list`.
            queryset = queryset.exclude(pk__in=self.get_selected_values_list())
        return queryset

    def get_target_renderer_class(self):
        return self.target_renderer_class

    def get_target_renderer_kwargs(self):
        return {
            'target_formfield_id': self.request.GET['manytomany_select_fieldid']
        }

    def get_target_renderer(self):
        targer_renderer_class = self.get_target_renderer_class()
        return targer_renderer_class(**self.get_target_renderer_kwargs())


class ListBuilderFilterListViewMixin(ViewMixin):
    hide_menu = True
    value_renderer_class = listbuilder_itemvalues.ManyToManySelect

    def get_filterlist_position(self):
        return 'top'

    def get_filterlist_url(self, filters_string):
        return self.request.cradmin_app.reverse_appurl(
            'manytomanyselect-filter', kwargs={'filters_string': filters_string})

    def get_listbuilder_list(self, context):
        listbuilder_list = super(ListBuilderFilterListViewMixin, self).get_listbuilder_list(context=context)
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

    def add_filterlist_items(self, filterlist):
        super(ListBuilderFilterListViewMixin, self).add_filterlist_items(filterlist=filterlist)
        filterlist.append(self.get_target_renderer())
