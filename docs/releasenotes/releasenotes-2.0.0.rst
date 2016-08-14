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
