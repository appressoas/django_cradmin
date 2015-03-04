##########################################################
`cradmin_register_account` --- A register account workflow
##########################################################

The purpose of the :mod:`django_cradmin.apps.cradmin_register_account` app is to provide a
general purpose activate account workflow.

It is designed to work with any user model as long as it
has an ``email`` field or property and an ``is_active``-object
like the Django User model or an ``activate_user()``-method.


*******
Install
*******
This app requires the following apps:

- :doc:`apps.cradmin_generic_token_with_metadata`
- :doc:`apps.cradmin_register_account`

In addition to the changes required by the apps listed above, add the following
to ``INSTALLED_APPS``::

    INSTALLED_APPS = (
        # ...
        'django_cradmin.apps.cradmin_register_account',
    )


And add something like this to your root url config::

    urlpatterns = patterns(
        # ...
        url(r'^register/', include('django_cradmin.apps.cradmin_register_account.urls')),
        # ...
    )



*********
Configure
*********

Required settings:
    DJANGO_CRADMIN_SITENAME
        The name of the site.

    DJANGO_CRADMIN_REGISTER_ACCOUNT_FORM_CLASS
        Must be set to the full Python path to a Django ModelForm
        that handles input and saving of new users. We provide default
        implementations for the default Django user model, and an
        implementation usable with many custom user models.

        See :ref:`register_account_form_class` for details.


************
How it works
************

Step One --- Create an inactive user
====================================
The first step is to create a user object. This is taken care of by
the view named ``cradmin-register-account-begin``. This view displays
and validate/process the form configured via the
``DJANGO_CRADMIN_REGISTER_ACCOUNT_FORM_CLASS`` setting.

Step two --- Activate the account
=================================
Uses the :doc:`cradmin_activate_account <apps.cradmin_activate_account>` app.


.. _register_account_form_class:

*********************
Register account form
*********************




Abstract account form classes
=============================
The following base forms are available in ``django_cradmin.apps.cradmin_register_account.forms.base``
They provide a common structure for all the register account forms.

.. currentmodule:: django_cradmin.apps.cradmin_register_account.forms.base

.. autoclass:: django_cradmin.apps.cradmin_register_account.forms.base.AbstractCreateAccountForm
    :members:

.. autoclass:: django_cradmin.apps.cradmin_register_account.forms.base.AbstractCreateAccountWithPasswordForm
    :members:
