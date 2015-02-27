############################################################################################
:mod:`django_cradmin.apps.cradmin_user_single_use_token` --- Secure unique single use tokens
############################################################################################

.. currentmodule:: django_cradmin.apps.cradmin_user_single_use_token.models


The purpose of the ``cradmin_user_single_use_token`` app is to provide
single-use secure and unique tokens connected to a User object.

Each token belongs to a user and an app. Tokens only live for a
limited time, and this time can be configured on a per app basis.

Very useful for single-use URLs like password reset, account activation, etc.


************
How it works
************
When you have a User and want to generate a unique token for that user, use::

    from django_cradmin.apps.cradmin_user_single_use_token.models import UserSingleUseToken
    from django.contrib.auth import get_user_model

    myuser = get_user_model().get(...)
    singleusetoken = UserSingleUseToken.objects.generate(app='myapp', user=myuser)
    # Use singleusetoken.token

This creates a UserSingleUseToken object with a ``token``-attribute that
contains a unique token. The app is provided for two reasons:

- Makes it easier  to debug/browse the data model because you know what app
  generated the token.
- Makes it possible to configure different time to live for each app.

When you have a token, typically from part of an URL, and want to get the
user owning the token, use::

    user = UserSingleUseToken.objects.pop(app='myapp', token=token)

This returns the user, and deletes the UserSingleUseToken from the database.

.. seealso::
    :meth:`.UserSingleUseTokenBaseManager.generate` and  :meth:`.UserSingleUseTokenBaseManager.pop`.



*********************************
Use case --- password reset email
*********************************
Lets say you want to use UserSingleUseToken to generate a password reset email.

First, we want to give the user an URL where they can go to reset the password::

    url = 'http://example.com/resetpassword/{}'.format(
        UserSingleUseToken.objects.generate(app='passwordreset', user=self.request.user)

Since we are using Django, we will most likely want the url to be to a view,
so this would most likely look more like this::

    def start_password_reset_view(request):
        url = request.build_absolute_uri(reverse('my-reset-password-accept-view', kwargs={
            'token': UserSingleUseToken.objects.generate(app='passwordreset', user=self.request.user)
        }
        # ... send an email giving the receiver instructions to click the url


In the view that lives at the URL that the user clicks to confirm the password
reset request, we do something like the following::

    class ResetThePassword(View):
        def get(request, token):
            try:
                token = UserSingleUseToken.objects.get(app='passwordreset', token=token)
            except UserSingleUseToken.DoesNotExist:
                return HttpResponse('Invalid password reset token.')
            else:
                if token.is_expired():
                    return HttpResponse('Your password reset token has expired.')
                # show a password reset form

        def post(request, token):
            try:
                user = UserSingleUseToken.objects.pop(app='passwordreset', token=token)
            except UserSingleUseToken.DoesNotExist:
                return HttpResponse('Invalid password reset token.')
            else:
                # reset the password


*********
Configure
*********
You can configure the time to live of the generated tokens using the
``DJANGO_CRADMIN_SECURE_USER_TOKEN_TIME_TO_LIVE_MINUTES`` setting::

    DJANGO_CRADMIN_SECURE_USER_TOKEN_TIME_TO_LIVE_MINUTES = {
        'default': 1440,
        'myapp': 2500
    }

It defaults to::

    DJANGO_CRADMIN_SECURE_USER_TOKEN_TIME_TO_LIVE_MINUTES = {
        'default': 60*24*4
    }



*********************
Delete expired tokens
*********************
To delete expired tokens, you can use::

    UserSingleUseToken.objects.delete_expired()

or the ``cradmin_secure_user_token_delete_expired`` management command::

    $ python manage.py cradmin_secure_user_token_delete_expired


.. note::
    You do not need to delete expired tokens very often unless you generate a lot of
    tokens. Expired tokens are not available through the :meth:`.UserSingleUseTokenBaseManager.pop`
    method. So if you use the API as intended, you will never use an expired token.


***
API
***

.. automodule:: django_cradmin.apps.cradmin_user_single_use_token.models
    :members:
