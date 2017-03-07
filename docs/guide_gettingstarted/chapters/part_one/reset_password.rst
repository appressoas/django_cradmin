.. _reset_password:

Reset Password
==============
From time to time you want to reset your password into something else, maybe you have the good routine of changing
your passwords every three month. CRadmin offers an easy workflow to implement the needed functionality for reseting
passwords. To make it work we just have to add a new application in our settings installed apps and include the urls
in our project urls, just as we did with the authentication in the last chapter.

For a better understanding of the CRadmin reset functionality, please read :ref:`cradmin_resetpassword`

Settings
--------
In the settings file where the ``INSTALLED_APPS`` is located, beneath the authentication app we added in the last
chapter, add the following line of code. ::

        'django_cradmin.apps.cradmin_resetpassword',

Project Urls
------------
In our file for the projetc urls we than include the urls for the rest password application in CRadmin. ::

    url(r'^gettingstarted/resetpassword/', include('django_cradmin.apps.cradmin_resetpassword.urls')),

Localhost
---------
If you now go to ``gettingstarted/resetpassword/begin`` a view asks you to enter your email and start the process of
reseting the password.
