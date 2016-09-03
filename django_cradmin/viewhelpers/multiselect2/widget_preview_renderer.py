from django_cradmin.viewhelpers import listbuilder


class List(listbuilder.lists.RowList):
    """
    Renders a list for previewing selection in
    :class:`django_cradmin.viewhelpers.multiselect2.manytomanywidget.Widget`.
    """
    template_name = 'django_cradmin/viewhelpers/multiselect2/manytomanywidget/preview-list.django.html'

    @classmethod
    def from_value_iterable(cls, value_iterable,
                            value_renderer_class=None,
                            frame_renderer_class=None,
                            **listkwargs):
        """
        Overrides :meth:`.django_cradmin.viewhelpers.listbuilder.base.List.from_value_iterable`
        to set :class:`.Value` as the default ``value_renderer_class``.
        """
        if value_renderer_class is None:
            value_renderer_class = Value
        return super(List, cls).from_value_iterable(
            value_iterable=value_iterable,
            value_renderer_class=value_renderer_class,
            frame_renderer_class=frame_renderer_class,
            **listkwargs)

    def get_test_css_class_suffixes_list(self):
        css_classes = super(List, self).get_test_css_class_suffixes_list()
        css_classes.append('cradmin-multiselect2-preview-list')
        return css_classes


class Value(listbuilder.base.ItemValueRenderer):
    """
    Renders a single value in :class:`.List` - also used
    by the ``get_manytomanyfield_preview_renderer_class`` method in
    :class:`~django_cradmin.viewhelpers.multiselect2.listbuilder_itemvalues.ManyToManySelect`
    """
    template_name = 'django_cradmin/viewhelpers/multiselect2/manytomanywidget/preview-value.django.html'

    def __init__(self, value, wrap_in_li_element=False):
        """
        Args:
            value: See :class:`django_cradmin.viewhelpers.listbuilder.base.AbstractItemRenderer`.
            wrap_in_li_element: If this is set to ``True``, we wrap the rendered item in
                an ``<li>``.

                This is set to ``True`` by the ``get_manytomanyfield_preview_html``-method in
                :class:`django_cradmin.viewhelpers.multiselect2.listbuilder_itemvalues.ManyToManySelect`
                to render items that can be dynamically added to a :class:`.List`.
        """
        self.wrap_in_li_element = wrap_in_li_element
        super(Value, self).__init__(value=value)

    def get_test_css_class_suffixes_list(self):
        css_classes = super(Value, self).get_test_css_class_suffixes_list()
        css_classes.append('cradmin-multiselect2-preview-list-value')
        return css_classes
