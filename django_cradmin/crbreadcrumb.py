from django_cradmin import renderable


class BreadcrumbItem(renderable.AbstractBemRenderable):
    """
    Breadcrumb item renderable.
    """
    template_name = 'django_cradmin/crbreadcrumb/breadcrumb-item.django.html'

    def __init__(self, url, label, parent_bem_block=None):
        """

        Args:
            url (str): The link URL.
            label (str): The link text/label.
            parent_bem_block: Provided automatically by :class:`.BreadcrumbItemList`.
        """
        self.url = url
        self.label = label
        self.parent_bem_block = parent_bem_block
        super(BreadcrumbItem, self).__init__()

    def get_bem_element(self):
        return '{}__item'.format(self.parent_bem_block)


class BreadcrumbSeparator(renderable.AbstractBemRenderable):
    """
    Breadcrumb separator renderable.
    """
    template_name = 'django_cradmin/crbreadcrumb/breadcrumb-separator.django.html'

    def __init__(self, parent_bem_block=None):
        self.parent_bem_block = parent_bem_block
        super(BreadcrumbSeparator, self).__init__()

    def get_bem_element(self):
        return '{}__separator'.format(self.parent_bem_block)


class BreadcrumbItemList(renderable.AbstractBemRenderable):
    """
    List of breadcrumb items.
    """
    template_name = 'django_cradmin/crbreadcrumb/breadcrumb-item-list.django.html'

    def __init__(self, cradmin_instance):
        self.breadcrumb_item_list = []
        self.cradmin_instance = cradmin_instance
        super(BreadcrumbItemList, self).__init__()

    def get_bem_block(self):
        return 'breadcrumbs'

    def __len__(self):
        return len(self.breadcrumb_item_list)

    def __bool__(self):
        return len(self) > 0

    def get_separator_renderable_class(self):
        """
        Get the renderable class for breadcrumb item separators.

        Defaults to :class:`.BreadcrumbSeparator`.
        """
        return BreadcrumbSeparator

    def make_separator_renderable(self):
        return self.get_separator_renderable_class()(parent_bem_block=self.get_bem_block())

    def get_item_renderable_class(self):
        """
        Get the renderable class for breadcrumb items.

        Defaults to :class:`.BreadcrumbItem`.
        """
        return BreadcrumbItem

    def get_item_renderable_kwargs(self, **extra_kwargs):
        """
        Get kwargs for the :meth:`.get_item_renderable_class`.

        Make sure you call super to get the required kwargs if you
        override this method.

        Args:
            **extra_kwargs: Extra kwargs.

        Returns:
            dict: kwargs.
        """
        kwargs = {
            'parent_bem_block': self.get_bem_block()
        }
        kwargs.update(extra_kwargs)
        return kwargs

    def make_item_renderable(self, **kwargs):
        return self.get_item_renderable_class()(**self.get_item_renderable_kwargs(**kwargs))

    def append_link(self, **kwargs):
        """
        Uses :meth:`.make_item_renderable` to create a renderable,
        and appends the created item to the breadcrumb list.
        """
        self.append(self.make_item_renderable(**kwargs))

    def prepend_link(self, **kwargs):
        """
        Uses :meth:`.make_item_renderable` to create a renderable,
        and prepends the created item to the breadcrumb list.
        """
        self.prepend(self.make_item_renderable(**kwargs))

    def insert_link(self, index, **kwargs):
        """
        Uses :meth:`.make_item_renderable` to create a renderable,
        and inserts the created item in the breadcrumb list.
        """
        self.insert(index, self.make_item_renderable(**kwargs))

    def insert(self, index, renderable_object):
        """
        Insert a renderable object at a specific index in the breadcrumb list.

        Args:
            index (int): The index to insert at.
            renderable_object: The renderable object (a subclass
                of :class:`django_cradmin.renderable.AbstractRenderable`)
        """
        if index < len(self.breadcrumb_item_list):
            self.breadcrumb_item_list.insert(index, renderable_object)
        else:
            self.append(renderable_object)

    def prepend(self, renderable_object):
        """
        Prepend a renderable object to the breadcrumb list.

        Args:
            renderable_object: The renderable object (a subclass
                of :class:`django_cradmin.renderable.AbstractRenderable`)
        """
        self.breadcrumb_item_list.insert(0, renderable_object)

    def append(self, renderable_object):
        """
        Append a renderable object to the breadcrumb list.

        Args:
            renderable_object: The renderable object (a subclass
                of :class:`django_cradmin.renderable.AbstractRenderable`)
        """
        self.breadcrumb_item_list.append(renderable_object)

    def extend(self, renerable_iterable):
        """
        Just like :meth:`.append` except that it takes an iterable
        of renderables instead of a single renderable.
        """
        self.breadcrumb_item_list.extend(renerable_iterable)

    def iter_listitems(self):
        for index, breadcrumb_item in enumerate(self.breadcrumb_item_list):
            yield breadcrumb_item
            if index < len(self.breadcrumb_item_list) - 1:
                yield self.make_separator_renderable()


class BreadcrumbItemListWrapper(renderable.AbstractBemRenderable):
    """
    Wraps a :class:`.BreadcrumbItemList` in a box.
    """
    template_name = 'django_cradmin/crbreadcrumb/breadcrumb-item-list-wrapper.django.html'

    def __init__(self, breadcrumb_item_list):
        self.breadcrumb_item_list = breadcrumb_item_list
        super(BreadcrumbItemListWrapper, self).__init__()

    def get_bem_block(self):
        return 'box'

    def get_bem_variant_list(self):
        return ['focus', 'spacing-small']

    def get_breadcrumb_item_list_extra_context_data(self):
        return {
            'is_within_wrapper': True
        }

    @property
    def container_css_classes(self):
        return 'container container--wide'


class WrappedBreadcrumbItemList(BreadcrumbItemList):
    """
    Renders and works just like :class:`.BreadcrumbItemList` except that
    it is wrapped within a :class:`.BreadcrumbItemListWrapper`.

    You can subclass :class:`.BreadcrumbItemListWrapper` and replace the wrapper
    class by overriding :meth:`.get_wrapper_renderable_class`.
    """
    def get_wrapper_renderable_class(self):
        """
        Get the renderable for the wrapper element(s).

        Returns:
            django_cradmin.crbreadcrumb.BreadcrumbItemListWrapper: :class:`.BreadcrumbItemListWrapper`
            or a subclass.

        """
        return BreadcrumbItemListWrapper

    def get_wrapper_renderable_kwargs(self):
        """
        Get kwargs for the class returned by :meth:`.get_wrapper_renderable_class`.

        Returns:
            dict: Kwargs.
        """
        return {
            'breadcrumb_item_list': self
        }

    def make_wrapper_renderable(self):
        return self.get_wrapper_renderable_class()(**self.get_wrapper_renderable_kwargs())

    def render(self, request=None, extra_context_data=None):
        extra_context_data = extra_context_data or {}
        if extra_context_data.get('is_within_wrapper'):
            return super(WrappedBreadcrumbItemList, self).render(request=request, extra_context_data=extra_context_data)
        else:
            return self.make_wrapper_renderable().render(request=request, extra_context_data=extra_context_data)
