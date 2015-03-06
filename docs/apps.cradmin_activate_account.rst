###########################################################
`cradmin_activate_account` --- An activate account workflow
###########################################################

The purpose of the :mod:`django_cradmin.apps.cradmin_activate_account` app is to provide a
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
        'django_cradmin.apps.cradmin_activate_account',
    )


And add something like this to your root url config::

    urlpatterns = patterns(
        # ...
        url(r'^activateaccount/', include('django_cradmin.apps.cradmin_activate_account.urls')),
        # ...
    )



***********
Quick start
***********
If you install and setup the app as explained above, you just need to set
the ``DJANGO_CRADMIN_SITENAME`` setting::

    DJANGO_CRADMIN_SITENAME = 'Testsite'

Now you should be able to use the
:class:`~django_cradmin.apps.cradmin_activate_account.utils.ActivationEmail`
class to initiate account activation.


*************************
The ActivationEmail class
*************************

.. autoclass:: django_cradmin.apps.cradmin_activate_account.utils.ActivationEmail
    :members:


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
First we generate a token using :doc:`apps.cradmin_generic_token_with_metadata`.
This is a single use token with the user and the *next url* as metadata.
We send an email with a link containing this token.


Step two --- Activate the account
=================================
When the user clicks on the email, we get the user and *next url* from the
token (which is part of the URL). If the token validates, we activate
the account, add a success message using the Django message framework,
and redirect to the *next url*.


.. _activate_account_emailtemplates:

****************************************
Email templates and how to override them
****************************************
You can override the following templates:

cradmin_activate_account/email/subject.django.txt
    Override this to set the email subject.

cradmin_activate_account/email/message.django.txt
    Override this to set the email message.
    Any whitespace at the beginning of this template is removed automatically.

cradmin_activate_account/email/signature.django.txt
    Override this to replace signature of the email.
    Any whitespace at the end of this template is removed automatically.

cradmin_activate_account/email/body.django.txt
    Override this to replace both the message and the signature.
    Any whitespace at both ends of this template is removed automatically.


All of the email templates get the following context variables:

- ``DJANGO_CRADMIN_SITENAME``: The value of the setting with the same name.
- ``activate_url``: The URL that users should click to activate their account.
- ``user``: The user that is activating their account.


*********************************************
UI message templates and how to override them
*********************************************
You do not have to override the entire templates to adjust
the text in the UI. We provide the following templates for
you to override:

cradmin_activate_account/messages/success.django.html
    The success message added to ``django.contrib.messages.success``
    when the account is successfully activated. The activated
    user is available as the ``user`` template context variable.

cradmin_activate_account/messages/activation-link-invalid.django.html
    The message shown in the UI when the activation link is invalid.

cradmin_activate_account/messages/activation-link-expired.django.html
    The message shown in the UI when the activation link is expired.
