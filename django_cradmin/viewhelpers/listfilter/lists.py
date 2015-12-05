from django_cradmin.viewhelpers.listfilter.base.abstractfilterlist import AbstractFilterList


class Vertical(AbstractFilterList):
    """
    An :class:`~django_cradmin.viewhelpers.listfilter.base.AbstractFilterList`
    with css class optimized for vertical rendering.
    """
    def get_base_css_classes_list(self):
        css_classes = super(Vertical, self).get_base_css_classes_list()
        css_classes.append('django-cradmin-listfilter-filterlist-vertical')
        return css_classes


class Horizontal(AbstractFilterList):
    """
    An :class:`~django_cradmin.viewhelpers.listfilter.base.AbstractFilterList`
    with css class optimized for horizontal rendering.
    """
    def get_base_css_classes_list(self):
        css_classes = super(Horizontal, self).get_base_css_classes_list()
        css_classes.append('django-cradmin-listfilter-filterlist-horizontal')
        return css_classes
