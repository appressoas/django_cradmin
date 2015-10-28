from __future__ import unicode_literals
from django_cradmin.renderable import AbstractRenderable


class AbstractItemRenderer(AbstractRenderable):
    """
    Abstract base class for :class:`.ItemFrameRenderer`
    and :class:`.InnerValueRenderer`.

    You will normally add objects of a class that extends this class
    to :class:`.List`, but it is not required.
    """

    #: If this is specified, we will add an attribute with this name
    #: for the value as an attribute of the object.
    #:
    #: I.e.: if ``valuealias = "person"``, you will be able to use ``me.person`` in
    #: the template, and you will be able to use ``self.person`` in any methods you
    #: add or override in the class (just remember to call ``super()`` if you override
    #: ``__init__``).
    valuealias = None

    def __init__(self, value):
        """
        Parameters:
            value: The value to render.
        """
        self.value = value
        if self.valuealias:
            setattr(self, self.valuealias, self.value)


class ItemValueRenderer(AbstractItemRenderer):
    """
    The value renderer renders the value of each item in
    the :class:`.List`.
    """
    template_name = 'django_cradmin/viewhelpers/listbuilder/base/itemvalue.django.html'


class ItemFrameRenderer(AbstractItemRenderer):
    """
    The outer item renderer provides a frame around the item.

    This is typically subclassed to:

    - Add visually highlighted frames for some items.
    - Add checkbox for each item
    - Make the item clickable (via an ``a`` tag or javascript).

    .. note::

        The :class:`.List` dors not require a :class:`.ItemFrameRenderer`,
        so lightweight lists without this extra wrapper is possible.
    """
    template_name = 'django_cradmin/viewhelpers/listbuilder/base/itemframe.django.html'

    def __init__(self, inneritem):
        super(ItemFrameRenderer, self).__init__(inneritem.value)
        self.inneritem = inneritem


class List(AbstractRenderable):
    """
    A builder for HTML lists (can be used for other lists as well).

    Each item in the list is a :class:`.AbstractItemRenderer` object, and
    it is typically:

    - A subclass of :class:`.ItemValueRenderer` for simple lists.
    - A subclass of :class:`.ItemFrameRenderer` for more complex lists.

    .. note:: Items can be any :class:`django_cradmin.renderable.AbstractRenderable`, but that does not
        work with the shortcut methods:

        - :meth:`.extend_with_values`
        - :meth:`.from_value_iterable`
    """
    template_name = 'django_cradmin/viewhelpers/listbuilder/base/list.django.html'

    def __init__(self, extra_css_classes=None):
        self.renderable_list = []
        self.extra_css_classes = extra_css_classes

    def iter_renderables(self):
        return iter(self.renderable_list)

    def get_css_classes(self):
        """
        Override this to set your own css classes.
        """
        css_classes = 'django-cradmin-listbuilder-list'
        if self.extra_css_classes:
            css_classes += ' ' + self.extra_css_classes
        return css_classes

    def append(self, renderable):
        """
        Appends an item to the list.

        Parameters:
            renderable: Must implement the :class:`django_cradmin.renderable.AbstractRenderable` interface,
                and it is typically a subclass of :class:`.AbstractItemRenderer`.
        """
        self.renderable_list.append(renderable)

    def extend(self, renerable_iterable):
        """
        Just like :meth:`.append` except that it takes an iterable
        of renderables instead of a single renderable.
        """
        self.renderable_list.extend(renerable_iterable)

    def extend_with_values(self, value_iterable, value_renderer_class, frame_renderer_class=None):
        """
        Extends the list with an iterable of values.

        Parameters:
            value_iterable: An iterable of values to add to the list.
            value_renderer_class: A subclass of :class:`.ItemValueRenderer`.
            frame_renderer_class: A subclass of :class:`.ItemFrameRenderer`.

                If this is ``None``, the object added to the list will be an object of the
                ``value_renderer_class``.

                If this is specified, the object added to the list will be an object
                of the ``frame_renderer_class`` with an object of the ``value_renderer_class``
                as the ``inneritem`` attribute/parameter.
        """
        if frame_renderer_class:
            renderable_iterable = [frame_renderer_class(inneritem=value_renderer_class(value=value))
                                   for value in value_iterable]
        else:
            renderable_iterable = map(value_renderer_class, value_iterable)
        self.extend(renderable_iterable)

    @classmethod
    def from_value_iterable(cls, value_iterable, value_renderer_class,
                            frame_renderer_class=None,
                            **listkwargs):
        """
        A shortcut for creating an object of this class with the given ``**listkwargs``
        as __init__ arguments, and then calling :meth:`.extend_with_values` with
        ``value_iterable``, ``value_renderer_class`` and ``frame_renderer_class`` as
        arguments.

        Returns:
            An object of this class.
        """
        listobject = cls(**listkwargs)
        listobject.extend_with_values(value_iterable, value_renderer_class,
                                      frame_renderer_class=frame_renderer_class)
        return listobject