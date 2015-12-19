from django_cradmin.viewhelpers import listbuilder


class List(listbuilder.lists.RowList):
    template_name = 'django_cradmin/viewhelpers/multiselect2/manytomanywidget/preview-list.django.html'

    @classmethod
    def from_value_iterable(cls, value_iterable,
                            value_renderer_class=None,
                            frame_renderer_class=None,
                            **listkwargs):
        if value_renderer_class is None:
            value_renderer_class = Value
        return super(List, cls).from_value_iterable(
            value_iterable=value_iterable,
            value_renderer_class=value_renderer_class,
            frame_renderer_class=frame_renderer_class,
            **listkwargs)

    def get_base_css_classes_list(self):
        css_classes = super(List, self).get_base_css_classes_list()
        css_classes.append('django-cradmin-multiselect2-preview-list')
        return css_classes


class Value(listbuilder.base.ItemValueRenderer):
    template_name = 'django_cradmin/viewhelpers/multiselect2/manytomanywidget/preview-value.django.html'

    def __init__(self, value, wrap_in_li_element=False):
        self.wrap_in_li_element = wrap_in_li_element
        super(Value, self).__init__(value=value)
