from __future__ import unicode_literals

from django.utils.translation import pgettext_lazy

from django_cradmin import renderable
from django_cradmin.viewhelpers import listbuilder


class Menu(object):
    pass
#     """
#     Base class for the menu.
#
#     You subclass this for your site, and set
#     :obj:`django_cradmin.crinstance.BaseInstance.menuclass`.
#
#     In advanced cases, you may create multiple subclasses of
#     this for your site, and override
#     :obj:`django_cradmin.crinstance.BaseInstance.menuclass`.
#
#     Attributes:
#         cradmin_instance (BaseInstance): The current cradmin instance.
#         request (HttpRequest): Shortcut for ``cradmin_instance.request``.
#         menu (list): A list of MenuItem objects. You use :meth:`.add`
#             to add items to the menu.
#     """
#     def __init__(self, cradmin_instance):
#         """
#         Parameters:
#             cradmin_instance (django_cradmin.crinstance.BaseInstance):
#         """
#         self.cradmin_instance = cradmin_instance
#         self.request = cradmin_instance.request
#         self.headeritems = []
#         self.mainitems = []
#         self.footeritems = []
#         self.build_menu()
#
#     def add_menuitem(self, *args, **kwargs):
#         """
#         Add menu item.
#
#         args and kwargs are forwarded to the menu class (see :meth:`.get_menuitem_class`).
#         """
#         menuitemclass = self.get_menuitem_class()
#         menuitem = menuitemclass(*args, **kwargs)
#         return self.add_menuitem_object(menuitem)
#
#     def add(self, *args, **kwargs):
#         """
#         Deprecated alias for :meth:`.add_menuitem`.
#         """
#         warnings.warn("add() is deprecated, use add_menuitem() instead.", DeprecationWarning)
#         return self.add_menuitem(*args, **kwargs)
#
#     def add_menuitem_object(self, menuitem):
#         """
#         Just like :meth:`.add_footeritem`, but takes a :class:`.MenuItem` instad
#         of arguments for the class.
#         """
#         self.mainitems.append(menuitem)
#         return menuitem
#
#     def get_menuitem_class(self):
#         """
#         Get the class used to render each menu item.
#
#         Returns:
#             :class:`.MenuItem` by default.
#         """
#         return MenuItem
#
#     def add_headeritem(self, *args, **kwargs):
#         """
#         Add item to the menu header.
#
#         args and kwargs are forwarded to the menu class (see :meth:`.get_headeritem_class`).
#         """
#         headeritem_class = self.get_headeritem_class()
#         menuitem = headeritem_class(*args, **kwargs)
#         return self.add_headeritem_object(menuitem)
#
#     def add_headeritem_object(self, menuitem):
#         """
#         Just like :meth:`.add_headeritem`, but takes a :class:`.MenuItem` instad
#         of arguments for the class.
#         """
#         self.headeritems.append(menuitem)
#         return menuitem
#
#     def get_headeritem_class(self):
#         """
#         Get the class used to render each item in the menu header.
#
#         Returns:
#             :class:`.MenuItem` by default.
#         """
#         return MenuItem
#
#     def add_footeritem(self, *args, **kwargs):
#         """
#         Add item to the menu footer.
#
#         args and kwargs are forwarded to the menu class (see :meth:`.get_footeritem_class`).
#         """
#         footeritem_class = self.get_footeritem_class()
#         return self.add_footeritem_object(footeritem_class(*args, **kwargs))
#
#     def add_footeritem_object(self, menuitem):
#         """
#         Just like :meth:`.add_footeritem`, but takes a :class:`.MenuItem` instad
#         of arguments for the class.
#         """
#         self.footeritems.append(menuitem)
#         return menuitem
#
#     def get_footeritem_class(self):
#         """
#         Get the class used to render each item in the menu footer.
#
#         Returns:
#             :class:`.MenuItem` by default.
#         """
#         return MenuItem
#
#     def build_menu(self):
#         """
#         Build the menu. You HAVE to override this.
#
#         Example::
#
#             def build_menu(self):
#                 self.add(label='Home', url='/myadmin/')
#                 self.add(label='My menu item', url='/myadmin/my/item')
#         """
#         raise NotImplementedError()
#
#     def iterate_menuitems(self):
#         """
#         Iterate over all items in the menu.
#
#         Returns:
#             An iterator over subclasses of :class:`.MenuItem`.
#         """
#         for menuitem in self.headeritems:
#             yield menuitem
#         for menuitem in self.mainitems:
#             yield menuitem
#         for menuitem in self.footeritems:
#             yield menuitem
#
#     def appindex_url(self, appname):
#         """
#         Shortcut for ``self.cradmin_instance.appindex_url(...)``.
#
#         See :meth:`django_cradmin.BaseInstance.appindex_url`.
#         """
#         return self.cradmin_instance.appindex_url(appname)
#
#     def roleselectview_url(self):
#         """
#         Shortcut for ``self.cradmin_instance.roleselectview_url()``.
#
#         See :meth:`django_cradmin.BaseInstance.roleselectview_url`.
#         """
#         return self.cradmin_instance.roleselectview_url()
#
#     def get_smallscreen_breakpoint(self):
#         return 'md'
#
#     def get_layout_direction(self):
#         """
#         Decides the direction of the navigation tree menu layout
#
#         - vertical (Default)
#         - horizontal
#
#         Returns:
#             the direction as a string
#         """
#         return 'vertical'


class LinkItemRenderable(renderable.AbstractRenderableWithCss):
    """
    A menu item renderable.
    """
    template_name = 'django_cradmin/crmenu/menuitem/link.django.html'

    def __init__(self, label, url, is_active=False):
        """
        Parameters:
            label: A label shown in the menu.
            url: The url to go to whem the user clicks the menu item.
            is_active: Should be ``True`` if the menuitem should be styled as active.
        """
        self.label = label
        self.url = url
        self.is_active = is_active


class MenuToggleItemItemRenderable(renderable.AbstractRenderableWithCss):
    """
    A menu item renderable.
    """
    template_name = 'django_cradmin/crmenu/menuitem/menutoggle.django.html'

    def get_label(self):
        return pgettext_lazy('cradmin default header menu toggle label', 'Menu')

    def get_base_css_classes_list(self):
        return ['header__button', 'header__button--menutoggle']


class AbstractMenuRenderable(listbuilder.base.List):
    """
    Base class for rendering a menu.

    To get a completely custom HTML menu, you simply set your own template
    (see :meth:`django_cradmin.renderable.AbstractRenderable.get_template_name`)
    and write your own HTML.
    """
    def __init__(self, cradmin_instance):
        self.cradmin_instance = cradmin_instance
        super(AbstractMenuRenderable, self).__init__()

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


class DefaultMainMenuRenderable(AbstractMenuRenderable):
    """
    The default large screen (desktop) :class:`.Menu` renderable.
    """
    template_name = 'django_cradmin/crmenu/menu/default-main.django.html'
    menutoggle_renderable_class = MenuToggleItemItemRenderable

    def get_wrapper_htmltag_id(self):
        return 'id_django_cradmin_menu_main'

    def get_menutoggle_renderable(self):
        return self.menutoggle_renderable_class()


class DefaultExpandableMenuRenderable(AbstractMenuRenderable):
    """
    The default small screen (mobile) :class:`.Menu` renderable.
    """
    template_name = 'django_cradmin/crmenu/menu/default-expandable.django.html'

    def get_wrapper_htmltag_id(self):
        return 'id_django_cradmin_menu_expandable'
