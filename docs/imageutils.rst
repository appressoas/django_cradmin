#############################################################################
Image utilities --- A general purpose backend neutural set of image utilities
#############################################################################

The purpose of the ``cradmin.imageutils`` module is to provide image utilities
through an API that can be swapped out. The default implementation uses
sorl-thumbnail, but that can easily be replaced with something like Cloudinary
or Transloadit by implementing a fairly simple API, and changing a Django setting.


********
Concepts
********
The ``cradmin.imageutils`` package is centered around a swappable
image utility backend defined by
:class:`django_cradmin.imageutils.backends.backendinterface.Interface`.

The interface defines two central methods:

- :meth:`~django_cradmin.imageutils.backends.backendinterface.Interface.transform_image`
  --- Used to transform an image specified as an URL using kwargs (you specify height, width, crop, etc.
  directly)
- :meth:`~django_cradmin.imageutils.backends.backendinterface.Interface.transform_image_using_imagetype`
  --- Works just like ``transform_image``, except that it takes the transformation options
  as a key in the :setting:`DJANGO_CRADMIN_IMAGEUTILS_IMAGETYPE_MAP` setting (a dict) instead of
  specifying options directly. This is much more maintainable in a project since it gives
  a clear overview of all image transformations used in a single place.


************************
Swapping out the backend
************************
To swap out the backend, you need to:

1. Create a custom imageutils class as a subclass of
   :class:`django_cradmin.imageutils.backends.backendinterface.Interface`.
2. Update the :setting:`DJANGO_CRADMIN_IMAGEUTILS_BACKEND` setting with the
   string path to your custom imageutils backend class.


************************************************************
Avoid specifying image transformations all over the codebase
************************************************************
We provide the ``DJANGO_CRADMIN_IMAGEUTILS_IMAGETYPE_MAP``
setting where you can map imagetype (a name you define) mapped
to options for :meth:`django_cradmin.imageutils.backends.backendinterface.Interface.transform_image`.

Example::

    DJANGO_CRADMIN_IMAGEUTILS_IMAGETYPE_MAP = {
        'logo': {
            'width': 200,
            'height': 60,
            'crop': 'limit',
            'quality': 80,
        },
        'imagelisting-same-size': {
            'width': 353,
            'height': 200,
            'crop': 'fill',
            'quality': 80,
        },
        'imagelisting-same-width': {
            'width': 445,
            'crop': 'limit',
            'quality': 80,
        },
    }

See the examples below for information about how to use this in code and templates.

.. note::

    Your custom backend can support many more options than
    the default backend, and you can add any options supported by your
    ``django_cradmin.imageutils`` backend to the
    :setting:`DJANGO_CRADMIN_IMAGEUTILS_IMAGETYPE_MAP` setting.


********
Examples
********

In Python code
==============
Create an image URL in Python code from an imagetype specified
in the :setting:`DJANGO_CRADMIN_IMAGEUTILS_IMAGETYPE_MAP` setting::

    from django_cradmin import imageutils
    url = imageutils.get_backend().transform_image_using_imagetype(
        myimage.url, 'imagelisting-same-width')

Create an image URL in Python code using raw cloudinary options::

    from django_cradmin import imageutils
    url = imageutils.get_backend().transform_image(
        myimage.url, width=200, height=300, crop="fill")



In Django templates
===================

Create an image URL in a Django template from an imagetype specified
in the :setting:`DJANGO_CRADMIN_IMAGEUTILS_IMAGETYPE_MAP` setting:

.. code-block:: htmldjango

    {% load cradmin_image_tags %}

    <img src="{% cradmin_transform_image_using_imagetype myimage.url 'imagelisting-same-width' %}">

Create an ``<img>`` tag in a Django template from an imagetype specified
in the :setting:`DJANGO_CRADMIN_IMAGEUTILS_IMAGETYPE_MAP` setting:

.. code-block:: htmldjango

    {% load cradmin_image_tags %}

    {% cradmin_create_archiveimage_tag myimage.url 'imagelisting-same-width' %}

    {# ... you can also specify a css class #}

    {% cradmin_create_archiveimage_tag myimage.url 'imagelisting-same-width' css_class="img-responsive" %}

Create an image URL in a Django template using raw cloudinary options:

.. code-block:: htmldjango

    {% load cradmin_image_tags %}

    <img src="{% cradmin_transform_image myimage.url width=200 height=300 crop="fill" %}">


****************************
Imageutils backend interface
****************************
.. currentmodule:: django_cradmin.imageutils.backends.backendinterface.Interface

.. autoclass:: django_cradmin.imageutils.backends.backendinterface.Interface
    :members:


***********************************************
The default imageutils backend - sorl thumbnail
***********************************************
.. currentmodule:: django_cradmin.imageutils.backends.sorl_thumbnail.SorlThumbnail

.. autoclass:: django_cradmin.imageutils.backends.sorl_thumbnail.SorlThumbnail
    :members:


*************
Template tags
*************

See :doc:`templatetags`.
