from django_cradmin.viewhelpers import listbuilder


class List(listbuilder.lists.RowList):
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


class Value(listbuilder.base.ItemValueRenderer):
    pass
