from __future__ import unicode_literals

from django.utils.translation import pgettext_lazy

from django_cradmin import renderable
from django_cradmin.viewhelpers import listbuilder


class BaseMenuLinkRenderable(renderable.AbstractBemRenderable):
    template_name = 'django_cradmin/crmenu/menuitem/link.django.html'

    def __init__(self, label, url, is_active=False,
                 bem_variant_list=None, parent_bem_block=None):
        """
        Parameters:
            label: A label shown in the menu.
            url: The url to go to whem the user clicks the menu item.
            is_active: Should be ``True`` if the menuitem should be styled as active.
        """
        self.label = label
        self.url = url
        self.is_active = is_active
        self.parent_bem_block = parent_bem_block
        super(BaseMenuLinkRenderable, self).__init__(bem_variant_list=bem_variant_list)

    def get_fallback_parent_bem_block(self):
        return 'adminui-page-header'

    def get_parent_bem_block(self):
        return self.parent_bem_block or self.get_fallback_parent_bem_block()

    def get_bem_element(self):
        return '{}__navlink'.format(self.get_parent_bem_block())

    def get_active_bem_variant_list(self):
        return [
            'active'
        ]

    def get_bem_variant_list(self):
        bem_variant_list = super(BaseMenuLinkRenderable, self).get_bem_variant_list()
        if self.is_active:
            bem_variant_list.extend(self.get_active_bem_variant_list())
        return bem_variant_list


class NavLinkItemRenderable(BaseMenuLinkRenderable):
    """
    Use this to add links to the main menu.
    """


class NavLinkButtonItemRenderable(NavLinkItemRenderable):
    """
    Use this to add links styled as a button to the main menu.
    """
    def get_bem_variant_list(self):
        return ['button']


class ExpandableMenuItem(BaseMenuLinkRenderable):
    """
    Use this to add links to the main menu.
    """
    template_name = 'django_cradmin/crmenu/menuitem/expandable-menu-item.django.html'

    def get_fallback_parent_bem_block(self):
        return 'adminui-expandable-menu'

    def get_bem_element(self):
        return '{}__link'.format(self.get_parent_bem_block())

    def get_list_element_bem_element(self):
        return '{}__listitem'.format(self.get_parent_bem_block())


class MenuToggleItemItemRenderable(renderable.AbstractBemRenderable):
    """
    Use this to add an expandable menu toggle to the menu.
    """
    template_name = 'django_cradmin/crmenu/menuitem/menutoggle.django.html'
    
    def __init__(self, parent_bem_block=None, **kwargs):
        self.parent_bem_block = parent_bem_block
        super(MenuToggleItemItemRenderable, self).__init__()

    def get_label(self):
        return pgettext_lazy('cradmin default header menu toggle label', 'Menu')

    def get_fallback_parent_bem_block(self):
        return 'adminui-page-header'

    def get_parent_bem_block(self):
        return self.parent_bem_block or self.get_fallback_parent_bem_block()

    def get_bem_element(self):
        return '{}__navmenutoggle'.format(self.get_parent_bem_block())

    def get_label_css_class(self):
        return '{}__navmenutoggle-label'.format(self.get_parent_bem_block())


class AbstractMenuRenderable(listbuilder.base.List):
    """
    Base class for rendering a menu.

    To get a completely custom HTML menu, you simply set your own template
    (see :meth:`django_cradmin.renderable.AbstractRenderable.get_template_name`)
    and write your own HTML.
    """

    #: The link renderable class used by :meth:`.make_link_renderable`.
    link_renderable_class = None

    #: The button renderable class used by :meth:`.make_button_renderable`.
    button_renderable_class = None

    def __init__(self, request, cradmin_instance=None):
        self.request = request
        self.cradmin_instance = cradmin_instance
        super(AbstractMenuRenderable, self).__init__()

    def get_link_renderable_class(self):
        """
        Get the link renderable class.

        The default implementation returns :obj:`~.AbstractMenuRenderable.link_renderable_class`,
        and raises ValueError if it is ``None``.

        You can override this method, or override
        :obj:`~.AbstractMenuRenderable.link_renderable_class` to change
        the link renderable class.
        """
        if not self.link_renderable_class:
            raise ValueError('No link_renderable_class defined for {}'.format(self.__class__.__name__))
        return self.link_renderable_class

    def get_button_renderable_class(self):
        """
        Get the button renderable class.

        The default implementation returns :obj:`~.AbstractMenuRenderable.button_renderable_class`,
        and raises ValueError if it is ``None``.

        You can override this method, or override
        :obj:`~.AbstractMenuRenderable.button_renderable_class` to change
        the button renderable class.
        """
        if not self.button_renderable_class:
            raise ValueError('No button_renderable_class defined for {}'.format(self.__class__.__name__))
        return self.button_renderable_class

    def get_child_renderable_parent_bem_block(self):
        raise NotImplementedError()

    def make_child_renderable_kwargs(self, **kwargs):
        """
        Takes the user provided kwargs for :meth:`.make_link_renderable`
        or :meth:`.make_button_renderable` and returns the final
        kwargs that should be used as argument for the constructor
        of the renderable class.

        By default, this adds the ``parent_bem_block`` kwarg
        with the value returned by :meth:`.get_child_renderable_parent_bem_block`.
        """
        full_kwargs = {
            'parent_bem_block': self.get_child_renderable_parent_bem_block()
        }
        full_kwargs.update(**kwargs)
        return full_kwargs

    def make_link_renderable(self, **kwargs):
        """
        Make a link renderable.

        Uses the renderable returned by :meth:`.get_link_renderable_class`,
        and forwards ``**kwargs`` to the constructor of that class.

        Kwargs is filtered through :meth:`.make_child_renderable_kwargs`,
        so you can override that method to add default kwargs.

        Returns:
            A link renderable object.
        """
        return self.get_link_renderable_class()(**self.make_child_renderable_kwargs(**kwargs))

    def make_button_renderable(self, **kwargs):
        """
        Make a button renderable.

        Uses the renderable returned by :meth:`.get_button_renderable_class`,
        and forwards ``**kwargs`` to the constructor of that class.

        Kwargs is filtered through :meth:`.make_child_renderable_kwargs`,
        so you can override that method to add default kwargs.

        Returns:
            A button renderable object.
        """
        return self.get_button_renderable_class()(**self.make_child_renderable_kwargs(**kwargs))

    def append_link(self, **kwargs):
        """
        Uses :meth:`.make_link_renderable` to create a renderable,
        and appends the created link to the menu.
        """
        self.append(self.make_link_renderable(**kwargs))

    def append_button(self, **kwargs):
        """
        Uses :meth:`.make_button_renderable` to create a renderable,
        and appends the created button to the menu.
        """
        self.append(self.make_button_renderable(**kwargs))

    def prepend_link(self, **kwargs):
        """
        Uses :meth:`.make_link_renderable` to create a renderable,
        and prepends the created link to the menu.
        """
        self.prepend(self.make_link_renderable(**kwargs))

    def prepend_button(self, **kwargs):
        """
        Uses :meth:`.make_button_renderable` to create a renderable,
        and prepends the created button to the menu.
        """
        self.prepend(self.make_button_renderable(**kwargs))

    def insert_link(self, index, **kwargs):
        """
        Uses :meth:`.make_link_renderable` to create a renderable,
        and inserts the created link in the menu.
        """
        self.insert(index, self.make_link_renderable(**kwargs))

    def insert_button(self, index, **kwargs):
        """
        Uses :meth:`.make_button_renderable` to create a renderable,
        and inserts the created button in the menu.
        """
        self.insert(index, self.make_button_renderable(**kwargs))

    def get_wrapper_htmltag(self):
        """
        Get the HTML tag to wrap the menu in.

        Defaults to ``"div"``.
        """
        return 'div'

    def get_wrapper_htmltag_id(self):
        """
        Get the ID of the wrapper HTML element.
        """
        raise None

    def get_bem_block_or_element(self):
        raise NotImplementedError()

    def get_base_css_classes_list(self):
        return [self.get_bem_block_or_element()]


class DefaultMainMenuRenderable(AbstractMenuRenderable):
    """
    The default large screen (desktop) :class:`.Menu` renderable.
    """
    template_name = 'django_cradmin/crmenu/menu/default-main.django.html'
    menutoggle_renderable_class = MenuToggleItemItemRenderable
    link_renderable_class = NavLinkItemRenderable
    button_renderable_class = NavLinkButtonItemRenderable

    def get_wrapper_htmltag_id(self):
        return 'id_django_cradmin_menu_main'

    def get_menutoggle_renderable(self):
        return self.menutoggle_renderable_class(**self.make_child_renderable_kwargs())

    def get_child_renderable_parent_bem_block(self):
        return 'adminui-page-header'

    def get_bem_block_or_element(self):
        return '{}__nav'.format(self.get_child_renderable_parent_bem_block())

    def __bool__(self):
        return self.has_items() or bool(getattr(self.cradmin_instance, 'expandable_menu_renderable', None))


class DefaultExpandableMenuRenderable(AbstractMenuRenderable):
    """
    The default small screen (mobile) :class:`.Menu` renderable.
    """
    template_name = 'django_cradmin/crmenu/menu/default-expandable.django.html'
    link_renderable_class = ExpandableMenuItem
    button_renderable_class = None

    def get_wrapper_htmltag_id(self):
        return 'id_django_cradmin_menu_expandable'

    def get_bem_block_or_element(self):
        return 'adminui-expandable-menu'

    def get_child_renderable_parent_bem_block(self):
        return self.get_bem_block_or_element()
