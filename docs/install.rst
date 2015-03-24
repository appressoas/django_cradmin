#####################
Install and configure
#####################

.. _installguide:

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
    

Add ``django.core.context_processors.request`` to the
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
    )
    

Set the ``CRISPY_TEMPLATE_PACK`` setting to ``bootstrap3``::

    CRISPY_TEMPLATE_PACK = 'bootstrap3'
