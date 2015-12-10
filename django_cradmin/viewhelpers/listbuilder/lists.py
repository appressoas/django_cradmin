from django_cradmin.viewhelpers.listbuilder import base


class RowList(base.List):
    def get_base_css_classes_list(self):
        css_classes = super(RowList, self).get_base_css_classes_list()
        css_classes.append('django-cradmin-listbuilder-rowlist')
        return css_classes


class FloatGridList(base.List):
    def get_css_size_class(self):
        return 'django-cradmin-listbuilder-floatgridlist-lg'

    def get_base_css_classes_list(self):
        css_classes = super(FloatGridList, self).get_base_css_classes_list()
        css_classes.append('django-cradmin-listbuilder-floatgridlist')
        css_classes.append(self.get_css_size_class())
        return css_classes
