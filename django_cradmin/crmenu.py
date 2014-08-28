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

    def __init__(self, cradmin_instance):
        """
        Parameters:
            cradmin_instance (django_cradmin.crinstance.BaseInstance):
        """
        self.cradmin_instance = cradmin_instance
        self.request = cradmin_instance.request
        self.menu = []
        self.build_menu()

    def add(self, *args, **kwargs):
        """
        Add menu items.

        args and kwargs are forwarded to the menu class (see :meth:`.get_menuitemclass`).
        """
        menuitemclass = self.get_menuitemclass()
        self.menu.append(
            menuitemclass(*args, **kwargs)
        )

    def get_menuitemclass(self):
        """
        Get the class used to render each menu item.

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
