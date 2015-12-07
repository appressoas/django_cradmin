from __future__ import unicode_literals
from django_cradmin.renderable import AbstractRenderableWithCss


class AbstractFilterListChild(AbstractRenderableWithCss):
    """
    Base class for anything that can be added as a child of
    :class:`.AbstractFilterList`.
    """
    def __init__(self):
        self.filterlist = None

    def set_filterlist(self, filterlist):
        self.filterlist = filterlist
