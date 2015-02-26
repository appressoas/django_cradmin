##############################################################################
:mod:`django_cradmin.apps.cradmin_passwordreset` --- A password reset workflow
##############################################################################

The purpose of the ``cradmin_passwordreset`` app is to provide a
general purpose password reset workflow.

It is designed to work with any user model as long as it
has an ``email`` field or property and a ``set_password``-method
like the Django User model.


************
How it works
************

Step One --- Send the password reset email
==========================================

For un-authenticated users
    If you want an un-authenticated user to reset their password,
    you send them to the view named ``cradmin-passwordreset-begin-unauthenticated``.

    The view asks for an email address using a form. When users post the form,
    we send them an email with a link to reset their password. After sending the email,
    the view redirects to the view named ``cradmin-passwordreset-email-sent``.

For authenticated users
    If you want an authenticated user to reset their password,
    you send them to the view named ``cradmin-passwordreset-begin-authenticated``.

    This view only works for authenticated users. It sends an email with a link to
    reset their password. After sending the email, the view redirects to the view
    named ``cradmin-passwordreset-email-sent``.


Step two --- Reset the password
===============================
When the user clicks the link provided in the password reset email,
we ask them to choose a new password, and to repeat the new password.
When we post the form , the password is validated
(see :ref:`password_reset_force_strong_passwords`) and if it validates,
it is updated using the ``set_password(raw_password)`` method of the
user model.


*****************************************************
About the password reset links and how we secure them
*****************************************************
Password reset links have to be activated


.. _password_reset_force_strong_passwords:

*****************************
How to force strong passwords
*****************************
TODO (User.validate_password).

****************************************
Email templates and how to override them
****************************************
TODO


***************************************
View templates and how to override them
***************************************
TODO
