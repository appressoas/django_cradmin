#####################################################
`cradmin_resetpassword` --- A password reset workflow
#####################################################

The purpose of the :mod:`django_cradmin.apps.cradmin_resetpassword` app is to provide a
general purpose password reset workflow.

It is designed to work with any user model as long as it
has an ``email`` field or property and a ``set_password``-method
like the Django User model.


*******
Install
*******
Add the following to ``INSTALLED_APPS``::

    INSTALLED_APPS = (
        # ...
        'django_cradmin',
        'django_cradmin.apps.cradmin_user_single_use_token',
        'django_cradmin.apps.cradmin_resetpassword',
    )


And add something like this to your root url config::

    urlpatterns = patterns(
        # ...
        url(r'^resetpassword/', include('django_cradmin.apps.cradmin_resetpassword.urls')),
        # ...
    )



*********
Configure
*********

Required settings:
    DJANGO_CRADMIN_SITENAME
        The name of the site.
        You **must set this setting** unless you override the email subject
        and message templates as explained in :ref:`password_reset_emailtemplates`.



Optional settings:
    DJANGO_CRADMIN_RESETPASSWORD_NO_SUCCESS_MESSAGE
        Set this to `False` to prevent adding a message to ``django.contrib.messages``
        on success. More details in :ref:`password_reset_step_three`.

    DJANGO_CRADMIN_RESETPASSWORD_FROM_EMAIL
        Defaults to the ``DEFAULT_FROM_EMAIL`` setting.

    DJANGO_CRADMIN_RESETPASSWORD_FINISHED_REDIRECT_URL
        The URL to redirect to when the password has been reset.
        Defaults to the ``LOGIN_URL`` setting. More details in :ref:`password_reset_step_three`.


************
How it works
************

Step One --- Send the password reset email
==========================================
If you want an un-authenticated user to reset their password,
you send them to the view named ``cradmin-resetpassword-begin``.

The view asks for an email address using a form. When users post the form,
we send them an email with a link to reset their password. After sending the email,
the view redirects to the view named ``cradmin-resetpassword-email-sent``.


Step two --- Reset the password
===============================
When the user clicks the link provided in the password reset email,
they are redirected to the view named ``cradmin-resetpassword-reset``.

In this view, we ask them to choose a new password, and to repeat the new password.
When we post the form , the password is validated
(see :ref:`password_reset_force_strong_passwords`) and if it validates,
it is updated using the `set_password(raw_password)` method of the
user model.


.. _password_reset_step_three:

Step three --- Redirect the user to some url
============================================
After updating the password, we add:

    Your password has been updated.

to ``django.contrib.messages.success`` and redirect to the url
configured in the ``DJANGO_CRADMIN_RESETPASSWORD_FINISHED_REDIRECT_URL``
setting.

You can set `DJANGO_CRADMIN_RESETPASSWORD_NO_SUCCESS_MESSAGE = False` to prevent
adding a message to ``django.contrib.messages``.

Override the ``cradmin_passwordreset/successmessage.django.html``
template to change the success message.


*****************************************************
About the password reset links and how we secure them
*****************************************************
Password reset links use :doc:`apps.cradmin_user_single_use_token`. This means
that the token at the end of the password reset URL:

- Is random generated and very hard to guess.
- Does not contain any information about the user.


.. _password_reset_force_strong_passwords:

*****************************
How to force strong passwords
*****************************
TODO (User.validate_password).



.. _password_reset_emailtemplates:

****************************************
Email templates and how to override them
****************************************
You can override the following templates:

cradmin_passwordreset/email/subject.django.txt
    Override this to set the email subject.

    Template context variables:

    - ``DJANGO_CRADMIN_SITENAME``: The value of the setting with the same name.

cradmin_passwordreset/email/message.django.txt
    Override this to set the email message.

    Any whitespace at the beginning of this template is removed automatically.

    Template context variables:

    - ``DJANGO_CRADMIN_SITENAME``: The value of the setting with the same name.
    - ``reset_url``: The URL that users should click to reset their password.
    - ``user``: The user that is resetting their email.

cradmin_passwordreset/email/signature.django.txt
    Override this to replace signature of the email.

    Any whitespace at the end of this template is removed automatically.

    Template context variables:

    - ``DJANGO_CRADMIN_SITENAME``: The value of the setting with the same name.
    - ``user``: The user that is resetting their email.

cradmin_passwordreset/email/body.django.txt
    Override this to replace both the message and the signature.
    Has the same context variables available as the message and signature
    templates.

    Any whitespace at both ends of this template is removed automatically.


***************************************
View templates and how to override them
***************************************
TODO
