Login Functionality in CRadmin
==============================
So far we have a view with no security when it comes to demanding that the user is logged in before checking out an
account. Therefore the next step is to create a login view in CRadmin. This is easily done by adding
``django_cradmin.app.cradmin_authenticate`` to your installed apps for the Django project and include its urls::

    INSTALLED_APPS = (
        # ...
        'django_cradmin',
        'django_cradmin.apps.cradmin_authenticate',
    )

And in your urls.py file for the project you add::

    urlpatterns = patterns(
        # ...
        url(r'^authenticate/', include('django_cradmin.apps.cradmin_authenticate.urls')),
        # ...
    )

Now when you go to `localhost/gettingstarted` a view asking for email and password should show up. If you want to read
more about `cradmin_authenticate`, check out our documentation :ref:`cradmin_authenticate`