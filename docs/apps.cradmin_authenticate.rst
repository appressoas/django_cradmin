######################################################################
:mod:`django_cradmin.apps.cradmin_authenticate` --- Login/logout views
######################################################################

The purpose of the ``cradmin_authenticate`` app is to provide a
general purpose login/logout workflow.

It is designed to work with any user model that uses and email
and a password for login.


*******
Install
*******
Add the following to ``INSTALLED_APPS``::

    INSTALLED_APPS = (
        # ...
        'django_cradmin',
        'django_cradmin.apps.cradmin_authenticate',
    )


And add something like this to your root url config::

    urlpatterns = patterns(
        # ...
        url(r'^authenticate/', include('django_cradmin.apps.cradmin_authenticate.urls')),
        # ...
    )



*********
Configure
*********

Optional settings:
    DJANGO_CRADMIN_FORGOTPASSWORD_URL
        If this is set, we show a forgot password link on the login page.
