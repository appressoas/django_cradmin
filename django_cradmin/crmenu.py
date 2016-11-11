from __future__ import unicode_literals

from django.utils.translation import pgettext_lazy

from django_cradmin import renderable
from django_cradmin.viewhelpers import listbuilder


class BaseMenuLinkRenderable(renderable.AbstractRenderableWithCss):
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


class NavLinkItemRenderable(BaseMenuLinkRenderable):
    """
    Use this to add links to the main menu.


    """
    def get_base_css_classes_list(self):
        css_classes = ['adminui-page-header__navlink']
        if self.is_active:
            css_classes.append('adminui-page-header__navlink--active')
        return css_classes


class NavLinkButtonItemRenderable(NavLinkItemRenderable):
    """
    Use this to add links styled as a button to the main menu.
    """
    def get_base_css_classes_list(self):
        css_classes = super(NavLinkButtonItemRenderable, self).get_base_css_classes_list()
        css_classes.append('adminui-page-header__navlink--button')
        return css_classes


class ExpandableMenuItem(BaseMenuLinkRenderable):
    """
    Use this to add links to the main menu.
    """
    template_name = 'django_cradmin/crmenu/menuitem/expandable-menu-item.django.html'

    def get_base_css_classes_list(self):
        css_classes = ['adminui-expandable-menu__link']
        if self.is_active:
            css_classes.append('adminui-expandable-menu__link--active')
        return css_classes


class MenuToggleItemItemRenderable(renderable.AbstractRenderableWithCss):
    """
    Use this to add an expandable menu toggle to the menu.
    """
    template_name = 'django_cradmin/crmenu/menuitem/menutoggle.django.html'

    def get_label(self):
        return pgettext_lazy('cradmin default header menu toggle label', 'Menu')

    def get_base_css_classes_list(self):
        return ['adminui-page-header__navmenutoggle']


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

    def get_base_css_classes_list(self):
        return ['adminui-page-header__nav']

    def __bool__(self):
        return self.has_items() or bool(self.cradmin_instance.expandable_menu_renderable)


class DefaultExpandableMenuRenderable(AbstractMenuRenderable):
    """
    The default small screen (mobile) :class:`.Menu` renderable.
    """
    template_name = 'django_cradmin/crmenu/menu/default-expandable.django.html'

    def get_wrapper_htmltag_id(self):
        return 'id_django_cradmin_menu_expandable'

    def get_base_css_classes_list(self):
        return ['adminui-expandable-menu']
