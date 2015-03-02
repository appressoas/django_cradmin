##########################################################
`cradmin_activateaccount` --- An activate account workflow
##########################################################

The purpose of the :mod:`django_cradmin.apps.cradmin_activateaccount` app is to provide a
general purpose activate account workflow.

It is designed to work with any user model as long as it
has an ``email`` field or property and an ``is_active``-object
like the Django User model or an ``activate_user()``-method.


*******
Install
*******
Add the following to ``INSTALLED_APPS``::

    INSTALLED_APPS = (
        # ...
        'django_cradmin',
        'django_cradmin.apps.cradmin_generic_token_with_metadata',
        'django_cradmin.apps.cradmin_activateaccount',
    )


And add something like this to your root url config::

    urlpatterns = patterns(
        # ...
        url(r'^activateaccount/', include('django_cradmin.apps.cradmin_activateaccount.urls')),
        # ...
    )



*********
Configure
*********

Required settings:
    DJANGO_CRADMIN_SITENAME
        The name of the site.
        You **must set this setting** unless you override the email subject
        and message templates as explained in :ref:`activate_account_emailtemplates`.



Optional settings:
    DJANGO_CRADMIN_ACTIVATE_ACCOUNT_FROM_EMAIL
        Defaults to the ``DEFAULT_FROM_EMAIL`` setting.

    DJANGO_CRADMIN_ACTIVATE_ACCOUNT_DEFAULT_NEXT_URL
        The URL to redirect to when the account has been activated.
        Defaults to the ``LOGIN_URL`` setting.


************
How it works
************

Step One --- Send the activate account email
============================================
TODO

Step two --- Activate the account
=================================
TODO


.. _activate_account_emailtemplates:

****************************************
Email templates and how to override them
****************************************
You can override the following templates:

cradmin_activateaccount/email/subject.django.txt
    Override this to set the email subject.

cradmin_activateaccount/email/message.django.txt
    Override this to set the email message.
    Any whitespace at the beginning of this template is removed automatically.

cradmin_activateaccount/email/signature.django.txt
    Override this to replace signature of the email.
    Any whitespace at the end of this template is removed automatically.

cradmin_activateaccount/email/body.django.txt
    Override this to replace both the message and the signature.
    Any whitespace at both ends of this template is removed automatically.


All of the email templates get the following context variables:

- ``DJANGO_CRADMIN_SITENAME``: The value of the setting with the same name.
- ``activate_url``: The URL that users should click to activate their account.
- ``user``: The user that is activating their account.
