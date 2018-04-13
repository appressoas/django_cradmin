class QuerysetForRoleMixin(object):
    def get_queryset_for_role(self):
        """
        Get a queryset with all objects of ``self.model``  that
        the current role can access.
        """
        raise NotImplementedError()

    def get_queryset(self):
        """
        DO NOT override this. Override :meth:`.get_queryset_for_role`
        instead.
        """
        queryset = self.get_queryset_for_role()
        return queryset


class CommonCradminViewMixin(object):
    def add_breadcrumb_list_items(self, breadcrumb_item_list):
        """

        Args:
            breadcrumb_item_list (django_cradmin.crbreadcrumb.BreadcrumbItemList): The breadcrumb item list
                to add items to.
        """

    def get_breadcrumb_item_list_renderable(self):
        """
        Get
        Returns:

        """
        breadcrumb_item_list = self.request.cradmin_app.get_breadcrumb_item_list_renderable()
        if breadcrumb_item_list is not None:
            self.add_breadcrumb_list_items(breadcrumb_item_list=breadcrumb_item_list)
        return breadcrumb_item_list

    def add_common_view_mixin_data_to_context(self, context):
        context['cradmin_breadcrumb_item_list'] = self.get_breadcrumb_item_list_renderable()
