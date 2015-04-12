from builtins import object
from django.template.loader import render_to_string


class MenuItem(object):
    """
    A  menu item. Basically a pythonic interface to
    create a HTML element.

    If you want to make major changes to the look and feel of the
    menu, you may want to subclass this and override the template
    and/or :meth:`render` method.
    """
    template_name = 'django_cradmin/menuitem.django.html'

    def __init__(self, label, url, icon='circle-o', active=False, attributes={}):
        """
        Parameters:
            label: A label shown in the menu.
            url: The url to go to whem the user clicks the menu item.
            icon: The name of a font-awesome icon (E.g.: "database", "user", ...).
            active: Should be ``True`` if the menuitem should be styled as active.
        """
        self.label = label
        self.url = url
        self.icon = icon
        self.attributes = attributes
        self.active = active

    def render(self):
        return render_to_string(self.template_name, {
            'menuitem': self
        })

    def is_active(self):
        return self.active


class Menu(object):
    """
    Base class for the menu.

    You subclass this for your site, and set
    :obj:`django_cradmin.crinstance.BaseInstance.menuclass`.

    In advanced cases, you may create multiple subclasses of
    this for your site, and override
    :obj:`django_cradmin.crinstance.BaseInstance.get_menuclass`

    Attributes:
        cradmin_instance (BaseInstance): The current cradmin instance.
        request (HttpRequest): Shortcut for ``cradmin_instance.request``.
        menu (list): A list of MenuItem objects. You use :meth:`.add`
            to add items to the menu.
    """

    #: The name of the template to use for rendering the menu.
    #: Used by :meth:`.get_template_name`.
    template_name = "django_cradmin/menu.django.html"

    def __init__(self, cradmin_instance):
        """
        Parameters:
            cradmin_instance (django_cradmin.crinstance.BaseInstance):
        """
        self.cradmin_instance = cradmin_instance
        self.request = cradmin_instance.request
        self.headeritems = []
        self.mainitems = []
        self.footeritems = []
        self.build_menu()

    def add(self, *args, **kwargs):
        """
        Add menu item.

        args and kwargs are forwarded to the menu class (see :meth:`.get_menuitem_class`).
        """
        menuitemclass = self.get_menuitem_class()
        self.mainitems.append(
            menuitemclass(*args, **kwargs)
        )

    def get_menuitem_class(self):
        """
        Get the class used to render each menu item.

        Returns:
            :class:`.MenuItem` by default.
        """
        return MenuItem

    def add_headeritem(self, *args, **kwargs):
        """
        Add item to the menu header.

        args and kwargs are forwarded to the menu class (see :meth:`.get_headeritem_class`).
        """
        headeritem_class = self.get_headeritem_class()
        self.headeritems.append(
            headeritem_class(*args, **kwargs)
        )

    def get_headeritem_class(self):
        """
        Get the class used to render each item in the menu header.

        Returns:
            :class:`.MenuItem` by default.
        """
        return MenuItem

    def add_footeritem(self, *args, **kwargs):
        """
        Add item to the menu footer.

        args and kwargs are forwarded to the menu class (see :meth:`.get_footeritem_class`).
        """
        footeritem_class = self.get_footeritem_class()
        self.footeritems.append(
            footeritem_class(*args, **kwargs)
        )

    def get_footeritem_class(self):
        """
        Get the class used to render each item in the menu footer.

        Returns:
            :class:`.MenuItem` by default.
        """
        return MenuItem

    def build_menu(self):
        """
        Build the menu. You HAVE to override this.

        Example::

            def build_menu(self):
                self.add(label='Home', url='/myadmin/')
                self.add(label='My menu item', url='/myadmin/my/item')
        """
        raise NotImplementedError()

    def __iter__(self):
        """
        Iterate over all items in the menu.

        Returns:
            An iterator over subclasses of :class:`.MenuItem`.
        """
        return iter(self.menu)

    def appindex_url(self, appname):
        """
        Shortcut for ``self.cradmin_instance.appindex_url(...)``.

        See :meth:`django_cradmin.BaseInstance.appindex_url`.
        """
        return self.cradmin_instance.appindex_url(appname)

    def roleselectview_url(self):
        """
        Shortcut for ``self.cradmin_instance.roleselectview_url()``.

        See :meth:`django_cradmin.BaseInstance.roleselectview_url`.
        """
        return self.cradmin_instance.roleselectview_url()

    def get_template_name(self):
        """
        Get the name of the template to use for rendering the menu.

        Defaults to :obj:`.template_name`.
        """
        return self.template_name

    def render(self, context):
        """
        Render the menu.

        Returns:
            The menu as HTML.
        """
        return render_to_string(self.get_template_name(), context)
