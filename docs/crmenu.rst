###################
Cradmin menu system
###################


*************************************
Using crmenu with BaseCrAdminInstance
*************************************

Simple example
==============
Lets create a menu with two links, one to the "dashboard" app, and one
to the "pages" app (both apps are within the cradmin instance)::

    class CrInstance(crinstance.BaseCrAdminInstance):
        # ... other required BaseCrAdminInstance attributes and methods ...

         apps = [
            ('dashboard', dashboard.App),
            ('dashboard', pages.App),
         ]

        def get_menu_item_renderables(self):
            return [
                crmenu.LinkItemRenderable(
                    label=ugettext_lazy('Dashboard'),
                    url=self.appindex_url('dashboard'),
                    is_active=self.request.cradmin_app.appname == 'dashboard'),
                crmenu.LinkItemRenderable(
                    label=ugettext_lazy('Pages'),
                    url=self.appindex_url('pages'),
                    is_active=self.request.cradmin_app.appname == 'pages'),
            ]


How it all fits together
========================

The menu is split into a main menu and an expandable menu. Both the
main and expandable menu are subclasses of :class:`django_cradmin.crmenu.AbstractMenuRenderable`.

By default the main menu and the expandable menu get their menu items from
:meth:`django_cradmin.crinstance.BaseCrAdminInstance.get_menu_item_renderables`,
but you can make them have different items by overriding:

- :meth:`~django_cradmin.crinstance.BaseCrAdminInstance.get_main_menu_item_renderables`
- :meth:`~django_cradmin.crinstance.BaseCrAdminInstance.get_expandable_menu_item_renderables`

If you want to change how the menu is rendered, you can change the menu renderer
classes by overring the following attributes:

    - :obj:`~django_cradmin.crinstance.BaseCrAdminInstance.main_menu_renderable_class`
    - :obj:`~django_cradmin.crinstance.BaseCrAdminInstance.expandable_menu_renderable_class`

If changing the renderer classes is not enough, you can override the methods that
creates renderable objects:

    - :meth:`~django_cradmin.crinstance.BaseCrAdminInstance.get_main_menu_renderable`
    - :meth:`~django_cradmin.crinstance.BaseCrAdminInstance.get_expandable_menu_renderable`

The last option gives you full control, and only require you to return an
:class:`django_cradmin.renderable.AbstractRenderable` object.


**********************
Implementation details
**********************

A menu is just a :class:`django_cradmin.renderable.AbstractRenderable`, and
with some overrides of methods in :class:`django_cradmin.crinstance.BaseCrAdminInstance`,
you can even use any direct subclass of AbstractRenderable. For most cases
you will want to use a subclass of :class:`django_cradmin.crmenu.AbstractMenuRenderable`
for your menu. AbstractMenuRenderable is a subclass of
:class:`django_cradmin.viewhelpers.listbuilder.base.List`, so you can put any
renderables in it, including nested menus.

Since we just use the AbstractRenderable framework, it is really easy to use
a plain Django template for your menu. This is nice when working with complex
menus.


***
API
***

.. currentmodule:: django_cradmin.crmenu

.. automodule:: django_cradmin.crmenu
   :members:
