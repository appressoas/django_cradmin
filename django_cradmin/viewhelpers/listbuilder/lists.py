from django_cradmin.viewhelpers.listbuilder import base


class RowList(base.List):
    def get_base_css_classes_list(self):
        css_classes = super(RowList, self).get_base_css_classes_list()
        css_classes.append('blocklist')
        return css_classes
