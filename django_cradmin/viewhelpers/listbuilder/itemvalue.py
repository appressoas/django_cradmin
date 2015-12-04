from django_cradmin.viewhelpers.listbuilder import base


class FocusBox(base.ItemValueRenderer):
    """
    Renders a value item as a box styled with the cradmin focus bg as background.

    This is a good default when setting up the structure of views,
    but you will most likely want to create your own
    :class:`django_cradmin.viewhelpers.listbuilder.base.ItemValueRenderer`
    subclass for more than the most simple use cases.
    """
