#################################
Django cradmin 2.0.0 releasenotes
#################################


************
What is new?
************
- New theme. No longer based on bootstrap, and using SASS instead of LESS.
- ``django_cradmin.viewhelpers`` can be imported as ``from django_cradmin import viewhelpers``. After
  this import, you can use ``viewhelpers.create.CreateView``, ``viewhelpers.update.UpdateView``, ...
- Views using any of the base templates for cradmin must inherit from one of the views in
  ``django_cradmin.viewhelpers`` or mix in one of the subclasses of
  :class:`django_cradmin.javascriptregistry.viewmixin.MinimalViewMixin`.
- New menu system. Much more flexible, with a much simpler core based on ``django_cradmin.viewhelpers.listbuilder``.


***************
New menu system
***************
Menus are structurally changed, and they are defined in a different manner.
Read :doc:`crmenu` for details.


Migrating from the old menu system
==================================
From a simple cases updating your menu for 2.x is fairly easy:

1. Add menu items in :meth:`django_cradmin.crinstance.BaseCrAdminInstance.get_menu_item_renderables` instead
   of in the ``build_menu``-method of your Menu. Since the attributes of
   :class:`django_cradmin.crmenu.LinkItemRenderable` is the same as for
   the old ``add_menuitem()``-method, this is easy. Just make sure to change
   the ``active`` attribute to ``is_active``.
2. Remove your old ``django_cradmin.crmenu.Menu`` subclass.
3. Remove the ``menuclass``-attribute from your BaseCrAdminInstance subclass.


If your old menu was defined like this::

    from django_cradmin import crinstance, crmenu

    class Menu(crmenu.Menu):
        def build_menu(self):
            self.add_menuitem(
                label=_('Dashboard'), url=self.appindex_url('dashboard'),
                active=self.request.cradmin_app.appname == 'dashboard')

    class CrInstance(crinstance.BaseCrAdminInstance):
        # ... other required BaseCrAdminInstance attributes and methods ...

        menuclass = Menu

It will look like this in cradmin 2.x::

    class CrInstance(crinstance.BaseCrAdminInstance):
        # ... other required BaseCrAdminInstance attributes and methods ...

        def get_menu_item_renderables(self):
            return [
                crmenu.LinkItemRenderable(
                    label=_('Dashboard'), url=self.appindex_url('dashboard'),
                    is_active=self.request.cradmin_app.appname == 'dashboard'),
            ]


****************************
Django base template changes
****************************

standalone-base-internal.django.html
====================================
- The div with id ``django_cradmin_bodycontentwrapper`` no longer exists, and this also means
  that the ``outside-bodycontentwrapper`` template block no longer exists.
- We no longer load any javascript by default.


django_cradmin/base-internal.django.html
========================================
- We use the new template blocks from ``standalone-base-internal.django.html`` (see the section above).
- The ``pageheader`` and ``pageheader-inner`` blocks no longer exist. Use:
    - ``page-cover`` instead of ``pageheader``.
    - ``page-cover-content`` instead of ``pageheader-inner``, or use ``page-cover-title``
      to just set the content of the H1 tag.

You can use the following regex in PyCharm to searh and all replace ``page-header-content``
blocks that only contain a H1 tag with the new ``page-cover-title`` block:

    Text to find::

        \{\% block pageheader\-inner \%\}\s*\<h1\>\s*([^>]+?)\s*\<\/h1\>\s*\{\% endblock pageheader\-inner \%\}

    Replace with::

        \{\% block page-cover-title \%\}\n    $1\n\{\% endblock page-cover-title \%\}

The regex in *Text to find* is both Python an java compatible, so you should be able
to create a python script to handle this if needed.

Recommended migration route:

- Replace pageheader-inner with the regex above.
- Search for pageheader-inner, and update the more complex cases manually to use something like this::

    {% block page-cover-title %}
        My title
    {% endblock page-cover-title %}

    {% block page-cover-content %}
        {{ block.super }}
        Stuff below the title in the old pageheader-inner block.
    {% endblock page-cover-content %}



layouts/standalone/focused.django.html
======================================

The ``innerwrapper_pre`` and ``innerwrapper_post`` blocks no longer exists. You
will typically want to update templates using these blocks with:

.. code-block:: django

    {% extends "django_cradmin/focused.django.html" %}

    {% block body %}

        {# The content you had in innerwrapper_pre here #}

        {{ block.super }}

        {# The content you had in innerwrapper_pre here #}

    {% endblock body %}

If you want the pre and post content to line up with the focused content,
wrap them in section tags with the ``page-section page-section--tight`` css classes:


.. code-block:: django

    {% extends "django_cradmin/focused.django.html" %}

    {% block body %}
        <section class="page-section page-section--tight">
            {# The content you had in innerwrapper_pre here #}
        </section>

        {{ block.super }}

        <section class="page-section page-section--tight">
            {# The content you had in innerwrapper_post here #}
        </section>
    {% endblock body %}


*****************
CSS class changes
*****************
The css framework is completely new, so all CSS classes have new names and they are structured
differently. This section has a


Removed css classes
===================

- ``django-cradmin-listbuilder-floatgridlist``: This was never ready to use out of the box,
  and it is better to create this per app to make it work perfectly with whatever
  javascript library required to handle the layout.


Listbuilder lists
=================
Listbuilder lists use the new ``list`` css class. Unlike the old ``django-cradmin-listbuilder-list`` css
class, this does not override typography styles. Instead it only focus on layout-specific styles.

This means that you need to use css classes to style heading elements unless you want them to have
their original sizes.



********************************
Deprecated in the python library
********************************

- django_cradmin.crmenu.MenuItem.get_active_item_wrapper_tag is deprecated. Use
  :meth:`django_cradmin.crmenu.MenuItem.get_menu_item_active_htmltag`.


*******************************
Removed from the python library
*******************************

- ``django_cradmin.viewhelpers.listbuilder.lists.FloatGridList`` is removed for the reason explained
  for the ``django-cradmin-listbuilder-floatgridlist`` css class above.


****************************
Changes in the template tags
****************************

- The ``django_cradmin.templatetags.cradmin_tags.cradmin_theme_staticpath`` template tag
  raises an exception if ``request`` is not in the template context.
