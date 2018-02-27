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


.. setting:: DJANGO_CRADMIN_HIDE_PAGEHEADER_IN_FORMVIEWS

DJANGO_CRADMIN_HIDE_PAGEHEADER_IN_FORMVIEWS
===========================================
Can be used to hide the page header in form views by default.


.. setting:: DJANGO_CRADMIN_HIDE_PAGEHEADER_IN_LISTINGVIEWS

DJANGO_CRADMIN_HIDE_PAGEHEADER_IN_LISTINGVIEWS
==============================================
Can be used to hide the page header in listing views by default.


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
The default header class rendered in the header block of
the base template for all cradmin view templates (standalone-base-internal.django.html).
If this is ``None``, or not specified (the default), we do not render
a header.

Must be the string path to a subclass of
:class:`django_cradmin.crheader.AbstractHeaderRenderable`.




.. setting:: DJANGO_CRADMIN_DEFAULT_EXPANDABLE_CLASS

DJANGO_CRADMIN_DEFAULT_EXPANDABLE_CLASS
=======================================
The default expandable menu class rendered at the end of ``<body>`` by
the base template for all cradmin view templates (standalone-base-internal.django.html).
If this is ``None``, or not specified (the default), we do not render
an expandable menu.

Must be the string path to a subclass of
:class:`django_cradmin.crmenu.AbstractMenuRenderable`.


.. setting:: DJANGO_CRADMIN_DEFAULT_STATIC_COMPONENT_IDS

DJANGO_CRADMIN_DEFAULT_STATIC_COMPONENT_IDS
===========================================
List of static components registered with the
:class:`django_cradmin.javascriptregistry.registry.Registry` singleton
that should be available by default in all templates extending
the ``standalone-base-internal.django.html`` template unless
something else is specified by the view or cradmin instance.


**********
imageutils
**********

.. setting:: DJANGO_CRADMIN_IMAGEUTILS_BACKEND

DJANGO_CRADMIN_IMAGEUTILS_BACKEND
=================================
The string path of a :doc:`django_cradmin.imageutils <imageutils>` backend.
Defaults to::

    DJANGO_CRADMIN_IMAGEUTILS_BACKEND = "django_cradmin.imageutils.backends.sorl_thumbnail.SorlThumbnail"


.. setting:: DJANGO_CRADMIN_IMAGEUTILS_IMAGETYPE_MAP

DJANGO_CRADMIN_IMAGEUTILS_IMAGETYPE_MAP
=======================================
A map between an *imagetype* (a name you define) and
options for :meth:`django_cradmin.imageutils.backends.backendinterface.Interface.transform_image`.

See :doc:`imageutils` for more information.


********************
cradmin_imagearchive
********************


.. setting:: DJANGO_CRADMIN_IMAGEARCHIVE_LISTING_IMAGETYPE

DJANGO_CRADMIN_IMAGEARCHIVE_LISTING_IMAGETYPE
=============================================
The :doc:`imageutils` imagetype that defines how images in the
cradmin listing of archive images in cradmin imagearchive is transformed.
If this is not defined, we default to scaling the image to fit within
a 100x60 px box. If you you change this, you will also want to
change :setting:`.DJANGO_CRADMIN_IMAGEARCHIVE_LISTING_IMAGEWIDTH`


.. setting:: DJANGO_CRADMIN_IMAGEARCHIVE_LISTING_IMAGEWIDTH

DJANGO_CRADMIN_IMAGEARCHIVE_LISTING_IMAGEWIDTH
==============================================
The width of the column containing the image preview in the listing
of archive images in the cradmin view. Defaults to ``100``.


.. setting:: DJANGO_CRADMIN_IMAGEARCHIVE_PREVIEW_IMAGETYPE

DJANGO_CRADMIN_IMAGEARCHIVE_PREVIEW_IMAGETYPE
=============================================
The :doc:`imageutils` imagetype that defines how previews of images
in cradmin imagearchive is transformed. If this is not defined, we default
to scaling the image to fit within a 300x300 px box.


.. setting:: DJANGO_CRADMIN_IMAGEARCHIVE_FILENAMEPATTERN

DJANGO_CRADMIN_IMAGEARCHIVE_FILENAMEPATTERN
===========================================
The pattern to use for the filename for ``cradmin_imagearchive`` images. Defaults
to::

    cradmin_imagearchive_images/{id}-{uuid}{extension}

You can change this if you want to store archive images in another directory.
Any pattern must contain all the variables in the pattern above.


.. setting:: DJANGO_CRADMIN_IMAGEARCHIVE_MAX_FILESIZE

DJANGO_CRADMIN_IMAGEARCHIVE_MAX_FILESIZE
========================================
Max file size for images uploaded to the image archive as a string
compatible with :func:`django_cradmin.utils.crhumanize.py.dehumanize_readable_filesize`.

Defaults to ``None``, which means that there is no limit by default. Examples::

    DJANGO_CRADMIN_IMAGEARCHIVE_MAX_FILESIZE = '500KB'
    DJANGO_CRADMIN_IMAGEARCHIVE_MAX_FILESIZE = '10MB'
    DJANGO_CRADMIN_IMAGEARCHIVE_MAX_FILESIZE = '2.5GB'


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
