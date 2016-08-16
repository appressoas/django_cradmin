#################################
Django cradmin 2.0.0 releasenotes
#################################


************
What is new?
************
- New theme. No longer based on bootstrap, and using SASS instead of LESS.


****************************
Django base template changes
****************************

standalone-base-internal.django.html
====================================
The div with id ``django_cradmin_bodycontentwrapper`` no longer exists, and this also means
that the ``outside-bodycontentwrapper`` template block no longer exists.


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


django_cradmin/menu.django.html
===============================

- The ``mobile-header`` block no longer exists. All of the child blocks (mobile-header-pre, mobile-header-post, ...)
  are also gone. It is replaced by ``menutoggle`` block, but this does not have a 1:1 feature set.
- The ``css-class`` block no longer exists. It has been replaced by the ``cssclasses`` block, but this
  should not be overridden in the same manner. It has child-blocks that you will normally want to
  override instead.


django_cradmin/menuitem.django.html
===================================

- The ``extra-list-item-attributes`` block no longer exists.


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
