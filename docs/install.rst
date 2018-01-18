#####################
Install and configure
#####################

.. _installguide:

***************************
Recommended system packages
***************************
- Python 2.7+ or Python 3.4+
- libjpeg, liblcms1, libfreetype6 and zlib for the required format support in Pillow (if you use any image functionality)


On Mac OSX with homebrew::

    $ brew install libjpeg little-cms freetype lzlib

.. note::

    If you get the error `OError: encoder zip not available`, you will
    need to install the packages listed above, uninstall
    pillow (`pip uninstall Pillow`), and re-install pillow
    with `pip install Pillow==<version> --no-cache-dir`.


*******
Install
*******
Install ``django_cradmin``::
    
    $ pip install django_cradmin


*********
Configure
*********
Add ``django_cradmin`` and ``crispy_forms`` to the
``INSTALLED_APPS`` setting::
    
    INSTALLED_APPS = (
        ...
        'django_cradmin',
        'crispy_forms',
        ...
    )
    

Add ``django.core.context_processors.request`` and
``django_cradmin.context_processors.cradmin`` to the
``TEMPLATE_CONTEXT_PROCESSORS`` setting::

    TEMPLATE_CONTEXT_PROCESSORS = (
        "django.contrib.auth.context_processors.auth",
        "django.core.context_processors.debug",
        "django.core.context_processors.i18n",
        "django.core.context_processors.media",
        "django.core.context_processors.static",
        "django.core.context_processors.tz",
        "django.contrib.messages.context_processors.messages",
        "django.core.context_processors.request",
        "django_cradmin.context_processors.cradmin",
    )


Set the ``CRISPY_TEMPLATE_PACK`` setting to ``bootstrap3``::

    CRISPY_TEMPLATE_PACK = 'bootstrap3'
