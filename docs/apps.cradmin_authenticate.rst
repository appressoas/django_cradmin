#############################################
`cradmin_authenticate` --- Login/logout views
#############################################

The purpose of the :mod:`cradmim.apps.cradmin_authenticate` app is to provide a
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

Required settings:
    LOGIN_REDIRECT_URL
        The default URL to redirect to after login unless you
        provide a ``next``-attribute as input to the view
        (see :ref:`authenticate_redirect_after_login`).

Optional settings:
    DJANGO_CRADMIN_FORGOTPASSWORD_URL
        If this is set, we show a forgot password link on the login page.



************
How it works
************
We determine the username field from the ``USERNAME_FIELD``
attribute of the user model. As long as the username field is
``email`` or ``username``, and you use password to login,
the view should just work out of the box.

You can extend ``django_cradmin.apps.cradmin_authenticate.views.LoginView`` and
add a custom login form class by overriding the ``get_form_class``-method.


.. _authenticate_redirect_after_login:

*****************************
Where to redirect after login
*****************************
You can change the ``LOGIN_REDIRECT_URL`` setting as documented
above if you want to change the default URL to redirect to after
login. If login is part of a workflow where you just want users
to login before they continue to the next step, you can use
the ``next`` querystring parameter. Example:

.. sourcecode:: django

    <a href="{% url 'cradmin-authenticate-login' %}?next=/comments/add">
        Add comment
    </a>


*****************************
Where to redirect after login
*****************************
Just like with the login view, you can supply a ``next`` querystring
attribute to the logout view. This can be used for workflows
like login as another user:

.. sourcecode:: django

    <a href="{% url 'cradmin-authenticate-logout' %}?next={% url 'cradmin-authenticate-login' %}">
        Login as another user
    </a>


************************
Nesting "next" redirects
************************

You can nest ``next`` --- you just have to url quote correctly.

Lets say you want to add an add comment as another user
button. This means that you want to logout, login, and then redirect to
the add comment view, which we for this example assume is at ``/comments/add``.
This would look something like this in a template:

.. sourcecode:: django

    <a href="{% url 'cradmin-authenticate-logout' %}?next={% url 'cradmin-authenticate-login' %}%3Fnext%3D%2Fcomments%2Fadd">
        Add comment as another user
    </a>

The ``%<number><letter>`` stuff is URL escape codes. You will most likely want
to handle this using python code. Lets generate the same URL using Python::

    from django.utils.http import urlencode
    from django.core.urlresolvers import reverse

    login_url = '{login_url}?{arguments}'.format(
        login_url=reverse('cradmin-authenticate-login'),
        arguments=urlencode({
            'next': '/comments/add'
        })
    )
    logout_url = '{logout_url}?{arguments}'.format(
        logout_url=reverse('cradmin-authenticate-logout'),
        arguments=urlencode({
            'next': login_url
        })
    )



*********************
Views and their names
*********************
The app provides the following two views:

cradmin-authenticate-login
    The view named ``cradmin-authenticate-login`` is used for login.
cradmin-authenticate-logout
    The view named ``cradmin-authenticate-logout`` is used for logging users out.
