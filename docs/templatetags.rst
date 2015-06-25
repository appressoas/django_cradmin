#############
Template tags
#############


.. _cradmin_icon_tags:

*****************
cradmin_icon_tags
*****************

The ``cradmin_icon_tags`` Django template tag library defines tags that makes
it easy to swap out the icons used by the provided Django cradmin components.

It is used like this:

.. code-block:: htmldjango

    {% load cradmin_icon_tags %}

    <span class="{% cradmin_icon 'search' %}"></span>

where ``{% cradmin_icon 'search' %}`` will look up css classes for the
icon in the ``DJANGO_CRADMIN_CSS_ICON_MAP`` Django setting.
If ``DJANGO_CRADMIN_CSS_ICON_MAP`` is not set, we default to
:obj:`.django_cradmin.css_icon_map.FONT_AWESOME`, but you can
easily provide your own with something like this in your settings.py::

    from django_cradmin import css_icon_map
    DJANGO_CRADMIN_CSS_ICON_MAP = css_icon_map.FONT_AWESOME.copy()
    DJANGO_CRADMIN_CSS_ICON_MAP.update({
        'search': 'my my-search-icon'
    })

You can even add your own icons and use ``cradmin_icon`` for your own
views/components.


.. currentmodule:: django_cradmin.css_icon_map

.. automodule:: django_cradmin.css_icon_map
    :members:
