########
Settings
########

.. setting:: DJANGO_CRADMIN_THEME_PATH

DJANGO_CRADMIN_THEME_PATH
=========================
The staticfiles path to the theme CSS. If this is not
set, we use ``django_cradmin/dist/css/cradmin_theme_default/theme.css``.


.. setting::  DJANGO_CRADMIN_CSS_ICON_MAP

DJANGO_CRADMIN_CSS_ICON_MAP
===========================
A dictionary mapping generalized icon names to css classes.
It is used by the ``cradmin_icon`` template tag. If you do
not set this, you will get font-awesome icons as defined
in :obj:`.django_cradmin.css_icon_map.FONT_AWESOME`.

.. seealso:: :ref:`cradmin_icon_tags` and :issue:`43`.


.. setting::  DJANGO_CRADMIN_CSS_ICON_LIBRARY_PATH

DJANGO_CRADMIN_CSS_ICON_LIBRARY_PATH
====================================
The staticfiles path to the css icon library.
Defaults to ``"django_cradmin/dist/vendor/fonts/fontawesome/css/font-awesome.min.css"``.


.. setting:: DJANGO_CRADMIN_MENU_SCROLL_TOP_FIXED

DJANGO_CRADMIN_MENU_SCROLL_TOP_FIXED
====================================
If this is ``True``, the menu template will add an angularjs directive that
automatically scrolls the menu when the window is scrolled.


.. setting:: DJANGO_CRADMIN_HIDE_PAGE_HEADER

DJANGO_CRADMIN_HIDE_PAGE_HEADER
===============================
If this is ``True``, we do not render the page header. This only affects views
that use templates inheriting from the ``django_cradmin/standalone-base.django.html``
template. This means all the views in ``django_cradmin.viewhelpers``, but not the login
views, or other standalone (non-crapp.App views).


.. setting:: DJANGO_CRADMIN_INCLUDE_TEST_CSS_CLASSES

DJANGO_CRADMIN_INCLUDE_TEST_CSS_CLASSES
=======================================
Enable CSS classes for unit tests? The CSS classes added
using the :func:`django_cradmin.templatetags.cradmin_tags.cradmin_test_css_class` template
tag is not included unless this is ``True``. Should only be ``True`` when running
automatic tests. Defaults to ``False``.



.. setting:: DJANGO_CRADMIN_DEFAULT_HEADER_CLASS

DJANGO_CRADMIN_DEFAULT_HEADER_CLASS
===================================
The default header class rendered in the ``header`` block of
the base template for all cradmin view templates (standalone-base-internal.django.html).
If this is ``None``, or not specified (the default), we do not render
a header.

Must be the string path to a subclass of
:class:`django_cradmin.crheader.AbstractHeaderRenderable` or a callable with the same
signature as the AbstractHeaderRenderable constructor.

A callable is typically used to dynamically determine the header
based on the provided kwargs. The callable must return an object
of :class:`django_cradmin.crheader.AbstractHeaderRenderable` or a subclass.


.. setting:: DJANGO_CRADMIN_DEFAULT_FOOTER_CLASS

DJANGO_CRADMIN_DEFAULT_FOOTER_CLASS
===================================
The default footer class rendered in the ``footer`` block of
the base template for all cradmin view templates (standalone-base-internal.django.html).
If this is ``None``, or not specified (the default), we do not render
a footer.

Must be the string path to a subclass of
:class:`django_cradmin.crheader.AbstractHeaderRenderable` or a callable with the same
signature as the AbstractHeaderRenderable constructor.

A callable is typically used to dynamically determine the footer
based on the provided kwargs. The callable must return an object
of :class:`django_cradmin.crheader.AbstractHeaderRenderable` or a subclass.


.. setting:: DJANGO_CRADMIN_DEFAULT_EXPANDABLE_MENU_CLASS

DJANGO_CRADMIN_DEFAULT_EXPANDABLE_MENU_CLASS
============================================
The default expandable menu class rendered at the end of ``<body>`` by
the base template for all cradmin view templates (standalone-base-internal.django.html).
If this is ``None``, or not specified (the default), we do not render
an expandable menu.

Must be the string path to a subclass of
:class:`django_cradmin.crmenu.AbstractMenuRenderable` or a callable with the same
signature as the AbstractMenuRenderable constructor.

A callable is typically used to dynamically determine the expandable
menu based on the provided kwargs. The callable must return an object
of :class:`django_cradmin.crmenu.AbstractMenuRenderable` or a subclass.


.. setting:: DJANGO_CRADMIN_DEFAULT_STATIC_COMPONENT_IDS

DJANGO_CRADMIN_DEFAULT_STATIC_COMPONENT_IDS
===========================================
List of static components registered with the
:class:`django_cradmin.javascriptregistry.registry.Registry` singleton
that should be available by default in all templates extending
the ``standalone-base-internal.django.html`` template unless
something else is specified by the view or cradmin instance.


.. setting:: DJANGO_CRADMIN_EMAIL_ENCODING

DJANGO_CRADMIN_EMAIL_ENCODING
=============================
Custom encoding for cradmin_email mails. Defaults to the django defaults. Example::

    DJANGO_CRADMIN_EMAIL_ENCODING = 'latin1'


***********
uicontainer
***********

.. setting:: DJANGO_CRADMIN_UICONTAINER_VALIDATE_BEM

DJANGO_CRADMIN_UICONTAINER_VALIDATE_BEM
=======================================
Set this to ``False`` in production to disable validation of
BEM blocks and elements. See
:meth:`django_cradmin.uicontainer.container.AbstractContainerRenderable.should_validate_bem`.
for more details.


.. setting:: DJANGO_CRADMIN_UICONTAINER_VALIDATE_DOM_ID

DJANGO_CRADMIN_UICONTAINER_VALIDATE_DOM_ID
==========================================
Set this to ``False`` in production to disable validation of
DOM ids. See
:meth:`django_cradmin.uicontainer.container.AbstractContainerRenderable.should_validate_dom_id`.
for more details.
