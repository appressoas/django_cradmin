from __future__ import unicode_literals
from django.template import RequestContext
from django.template.loader import render_to_string


class AbstractRenderable(object):
    """
    An abstract class that implements an interface for
    rendering something.

    Everything is just helpers for the :meth:`.render` method,
    which renders a template with an object of this class as
    input.
    """
    template_name = None

    def get_template_name(self):
        """
        Get the template name for :meth:`.render`.

        Defaults to :obj:`~.AbstractRenderable.template_name`.

        Raises:
            NotImplementedError: If :obj:`~.AbstractRenderable.template_name` is
             not set.
        """
        if self.template_name:
            return self.template_name
        else:
            raise NotImplementedError('You must set template_name or override '
                                      'get_template_name().')

    def get_context_data(self):
        """
        Get context data for :meth:`.render`.

        Defaults to::

            {
                'me': self
            }
        """
        return {
            'me': self
        }

    def get_template_context_object(self, request=None):
        """
        Get the template context object returned by
        :meth:`.render`.

        See the docs for the ``request`` parameter for
        :meth:`.render` for more details.
        """
        context = self.get_context_data()
        if request:
            context = RequestContext(request, context)
        return context

    def render(self, request=None):
        """
        Render :obj:`.get_template_name` with
        the context returned by :meth:`.get_context_data`.

        Paramteters:
            request (HttpRequest): If this is provided, we create
                wrap the response from :meth:`.get_context_data`
                in a ``RequestContext``.

                You can override this behavior in
                :meth:`.get_template_context_object`.
        """
        return render_to_string(
            self.get_template_name(),
            self.get_template_context_object(request=request))


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
    def __init__(self, value, inneritem):
        super(ItemFrameRenderer, self).__init__(value)
        self.inneritem = inneritem


class ItemValueRenderer(AbstractItemRenderer):
    """
    The value renderer renders the value of each item in
    the :class:`.List`.
    """


class List(AbstractRenderable):
    def __init__(self):
        self.renderable_list = []

    def append(self, renderable):
        """
        Appends an item to the list.

        Parameters:
            renderable: Must implement the :class:`.AbstractRenderable` interface,
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
            renderable_iterable = [frame_renderer_class(value=value,
                                                        inneritem=value_renderer_class(value=value))
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
