from django_cradmin.viewhelpers.listbuilder import base


class RowList(base.List):
    def get_css_classes(self):
        css_classes = super(RowList, self).get_css_classes()
        css_classes += ' ' + 'django-cradmin-listbuilder-rowlist'
        return css_classes


class FloatGridList(base.List):

    def get_css_size_class(self):
        return 'django-cradmin-listbuilder-floatgridlist-md'

    def get_css_classes(self):
        css_classes = super(FloatGridList, self).get_css_classes()
        css_classes += ' django-cradmin-listbuilder-floatgridlist ' + self.get_css_size_class()
        return css_classes
