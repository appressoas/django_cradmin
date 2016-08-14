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
