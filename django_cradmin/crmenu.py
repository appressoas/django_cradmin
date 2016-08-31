from __future__ import unicode_literals

from django.utils.translation import pgettext_lazy

from django_cradmin import renderable
from django_cradmin.viewhelpers import listbuilder


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
