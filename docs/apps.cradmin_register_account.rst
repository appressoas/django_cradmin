##########################################################
`cradmin_register_account` --- A register account workflow
##########################################################

The purpose of the :mod:`django_cradmin.apps.cradmin_register_account` app is to provide a
general purpose register account workflow where all you need to do is provide a
form class.

It is designed to work with any user model, and we provide out of the box
ready to use form classes for the default Django user model, and for
custom user models with email and password.


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



**********
Quickstart
**********

Set the ``DJANGO_CRADMIN_SITENAME`` setting to the name of your site::

    DJANGO_CRADMIN_SITENAME = 'Testsite'

Set the ``LOGIN_URL`` or ``DJANGO_CRADMIN_REGISTER_ACCOUNT_REDIRECT_URL`` setting
to the URL you want your users to go to after the user is created and activated::

    DJANGO_CRADMIN_REGISTER_ACCOUNT_REDIRECT_URL = '/authenticate/login'

Set the ``DJANGO_CRADMIN_REGISTER_ACCOUNT_FORM_CLASS`` setting to a register account
form class compatible with your user model:

    If you are using the default ``django.contrib.auth.models.User`` model::

        DJANGO_CRADMIN_REGISTER_ACCOUNT_FORM_CLASS = \
            'django_cradmin.apps.cradmin_register_account.forms.auth_user.AuthUserCreateAccountForm'

    If you have a custom user model with an ``email``-field and a ``set_password()``-method,
    you can use::

        DJANGO_CRADMIN_REGISTER_ACCOUNT_FORM_CLASS = \
            'django_cradmin.apps.cradmin_register_account.forms.email.EmailUserCreateAccountForm'

    If your user model does not fit with any of these descriptions, or for more details,
    continue reading this document.

Now you should be able to visit http://localhost:8000/register/begin to register a new user.

*********
Configure
*********

Required settings:
    DJANGO_CRADMIN_SITENAME
        The name of the site.

    DJANGO_CRADMIN_REGISTER_ACCOUNT_REDIRECT_URL or LOGIN_URL
        The URL to redirect to after login is found in the following order:

        1. Via the ``next``-attribute as input to the view
           (see :ref:`register_account_redirect_after_login`).
        2. Use the ``DJANGO_CRADMIN_REGISTER_ACCOUNT_REDIRECT_URL`` setting if defined.
        3. Use the ``LOGIN_URL`` setting.

        This means that you have to set one of the settings in order for
        the workflow to work out of the box.

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

The register account forms are just normal Django ModelForm subclasses. They must provide:

- Layout via Django crispy forms layouts.
- Validation.
- A save method that sets the user as inactive and it should
  most likely set a usable password unless you use an authentication
  backend that sets passwords in some other way.

To make this easier, we provide some classes you can extend or use.

If you use ``django.contrib.auth.models.User``, the following form classes can be used
without any modification, or as base class for your own register account form class:


    In the ``django_cradmin.apps.cradmin_register_account.forms.auth_user_form`` module:

    .. autosummary::
        :nosignatures:

        ~django_cradmin.apps.cradmin_register_account.forms.auth_user.AuthUserCreateAccountForm
        ~django_cradmin.apps.cradmin_register_account.forms.auth_user.AuthUserCreateAccountAutoUsernameForm

If you have a custom user model, you may be able to use the following form classes
without any modification, or as base class for your own register account form class:

    In the ``django_cradmin.apps.cradmin_register_account.forms.auth_user_form`` module:

    .. autosummary::
        :nosignatures:

        ~django_cradmin.apps.cradmin_register_account.forms.email.EmailUserCreateAccountForm

If you want to create a completely custom register account form, you will most likely want
to extend one of these abstract form classes:

    In the ``django_cradmin.apps.cradmin_register_account.forms.base`` module:

    .. autosummary::
        :nosignatures:

        ~django_cradmin.apps.cradmin_register_account.forms.base.AbstractCreateAccountForm
        ~django_cradmin.apps.cradmin_register_account.forms.base.AbstractCreateAccountWithPasswordForm


Form classes for ``django.contrib.auth.models.User``
====================================================
The following forms are available in ``django_cradmin.apps.cradmin_register_account.forms.auth_user``.
They provide ready-to-use register account forms suitable if your user model is ``django.contrib.auth.models.User``.
They can also be used as base classes for your own register account forms.


.. autoclass:: django_cradmin.apps.cradmin_register_account.forms.auth_user.AuthUserCreateAccountForm
    :members:

.. autoclass:: django_cradmin.apps.cradmin_register_account.forms.auth_user.AuthUserCreateAccountAutoUsernameForm
    :members:


Form classes for custom user models
===================================
The following forms are available in ``django_cradmin.apps.cradmin_register_account.forms.email``.
They provide ready-to-use register account forms suitable if your user model has an ``email``-field
and a ``set_password()``-method. They can also be used as base classes for your own register account forms.


.. autoclass:: django_cradmin.apps.cradmin_register_account.forms.email.EmailUserCreateAccountForm
    :members:


Abstract register account form classes
======================================
The following base forms are available in ``django_cradmin.apps.cradmin_register_account.forms.base``.
They provide a common structure for all the register account forms.


.. autoclass:: django_cradmin.apps.cradmin_register_account.forms.base.AbstractCreateAccountForm
    :members:

.. autoclass:: django_cradmin.apps.cradmin_register_account.forms.base.AbstractCreateAccountWithPasswordForm
    :members:


.. _register_account_redirect_after_login:

****************************************************
Where to redirect after the account has been created
****************************************************
You can change the ``DJANGO_CRADMIN_REGISTER_ACCOUNT_REDIRECT_URL`` setting
as documented above if you want to change the default URL to redirect to after
the account has been created. If account creation is part of a workflow where you
just want users to register a user before they continue to the next step, you can use
the ``next`` querystring parameter. Example:

.. sourcecode:: django

    <a href="{% url 'cradmin-register-account-begin' %}?next=/account/edit/details">
        Create account
    </a>
