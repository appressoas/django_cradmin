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
    """
    def __init__(self, value, valuealias=None):
        """
        """
        self.value = value
        self.valuealias = valuealias
        if valuealias:
            setattr(self, valuealias, valuealias)


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

    #: The default item value renderer class.
    #: Defaults to :class:`.ItemValueRenderer`.
    itemvalue_renderer_class = ItemValueRenderer

    #: The default item frame renderer class.
    #: Defaults to :class:`.ItemFrameRenderer`.
    itemframe_renderer_class = None

    def __init__(self):
        self.renderable_list = []

    def append_object(self, itemvalue, itemvalue_renderer_class=None):
        if not itemvalue_renderer_class:
            itemvalue_renderer_class = self.get_itemvalue_renderer(itemvalue)
        item = itemvalue_renderer_class(itemvalue=itemvalue)
        self.renderable_list.append(itemvalue)

    def append_item(self, item):
        self.renderable_list.append(item)

    def extend(self, value_iterable, itemvalue_renderer_class=None):
        for itemvalue in value_iterable:
            self.append_object(
                itemvalue=itemvalue,
                itemvalue_renderer_class=itemvalue_renderer_class)

    @classmethod
    def from_value_iterable(cls, value_iterable,
                            itemvalue_renderer_class=None, **kwargs):
        listobject = cls(**kwargs)
        listobject.extend(value_iterable,
                          itemvalue_renderer_class=itemvalue_renderer_class)

    def get_itemvalue_renderer(self, itemvalue):
        return self.itemvalue_renderer_class(itemvalue)

    def get_itemframe_renderer(self, itemvalue):
        if self.itemframe_renderer_class:
            return self.itemframe_renderer_class(itemvalue)
        else:
            return None
