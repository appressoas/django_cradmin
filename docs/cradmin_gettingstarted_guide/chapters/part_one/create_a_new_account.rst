.. _create_a_new_account:

Create a New Account
====================

If you now go to Django Admin, add another account for the same user and than go to "localhost/gettingstarted" in your
browser, you will see you now can choose which account you would like to edit. This page is created by CRadmin without
us doing anything else than a bit inheritance in our view. However, having to go to djangoadmin for creating new
accounts is not userfriendly. Now we are going to create functionality which lets an authenticated user create a new
account. Now there are several ways to create needed functionality. We are going to create a new CRadmin instance which
don't require a role and make this our new hompepage. Furthermore we will create a new CRadmin application with the
dashboard view for our new homepage and a view for creating a new instance of the account object. Thus, we also need to
restructure our project layout a little bit with a new module for our cradmin instances. So when all our new files are
created and placed in the right module, our project structure will look like this ::

    cradmin_gettingstarted
        cradmin_instances
            __init__.py
            account_admin_cradmin_instance.py
            create_account_cradmin_instance.py
        crapps
            account_adminui (no changes here)
            create_account
                __init__.py
                create_account_dashboard_view.py
                create_account_view.py
            __init__.py
        templates
            cradmin_gettingstarted
                account_dashboard.django.html
                create_account_dashboard.django.html
        tests
            test_cradmin_instances
                __init__.py
                test_account_admin_cradmin_instance.py
                test_create_account_cradmin_instance.py
            test_crapps
                test_account_adminui (no changes here)
                test_create_account
                    __init__.py
                    test_create_account_dashboard_view.py
                    test_create_account_view.py

CRadmin instance
----------------
In our new CRadmin instance file ``create_account_cradmin_instance.py`` we need to inherit from the cradmin instance
class named `NoRoleMixin` and overwrite the method `has_access` so it returns True if the user is authenticated.
Strictly speaking, we do not need to override the `has_access`method, since the super class `NoRoleMixin` already
returns True if the user is authenticated. But since this is a getting started guide it is important to show some of
the behind scene action. Further we alos use the class `BaseCrAdminInstance` as a super. We give our CRadmin instance
an id, and sets the name of which crapps to be our rolefrontpage. ::

    from django.http import Http404

    from django_cradmin import crinstance


    class CreateAccountCrAdminInstance(crinstance.NoRoleMixin, crinstance.BaseCrAdminInstance):
        id = 'create_account'
        rolefrontpage_appname = 'dashboard'

        apps = [
            ('dashboard', create_account.App),
        ]

        def has_access(self):
            if self.request.user.is_authenticated:
                return True

Dashboard view
--------------
Next we move on to the file ``create_account_dashboard_view`` within our crapps named `create_account`. Since we are now
working with a CRadmin instance which don't require a role and it pretty much stands alone, it makes sense to use the
`StandaloneBaseTemplateView` for our dashboard view. We tell the view which template we want to use and return context
with an authenticated user's email. ::


    from django_cradmin import viewhelpers


    class CreateAccountDashboardView(viewhelpers.generic.StandaloneBaseTemplateView):
        template_name = 'cradmin_gettingstarted/create_account_dashboard.django.html'

        def __get_user(self):
            if self.request.user.is_authenticated:
                user_email = self.request.user.email
                return user_email

        def get_context_data(self, **kwargs):
            context = super(CreateAccountDashboardView, self).get_context_data()
            context['user'] = self.__get_user()
            return context

Dahsboard template
------------------
In the template we now have to extend the ``django_cradmin/standalone-base.django.html`` since our view is a
`StandaloneBaseTemplateView`. Further the template consists of an if tests which handles an empty context from the view.
This if test is not really needed since we already have implemented the CRadmin authenticate application, and this
secure that only logged in users gets access to this template. However, we want to show some possibilities with an if
test in a template and how CRadmin test css classes can be used for testing that a user gets different information
depending on being logged in or not. If you want to check out the base CSS style classes used in CRadmin, go to
`localhost/styleguide`. ::

    {% extends "django_cradmin/standalone-base.django.html" %}
    {% load cradmin_tags %}

    {% block page-cover-title %}
        Welcome
    {% endblock page-cover-title %}

    {% block content %}
        <section class="adminui-page-section  adminui-page-section--center-lg">
            <div class="container">
                {% if user %}
                    <div class="blocklist blocklist--tight">
                        <section class="blocklist__item">
                            <h2 class="blocklist__itemtitle">Logged in as</h2>
                            <p class="{% cradmin_test_css_class 'authenticated-user' %}">{{ user }}</p>
                        </section>
                    </div>
                {% else %}
                    <div class="blocklist blocklist--tight">
                        <section class="blocklist__item">
                            <h2 class="blocklist__itemtitle">Not a authenticated user</h2>
                            <p class="message message--error {% cradmin_test_css_class 'not-authenticated-user' %}">
                                You need to be logged in as a registered user to get access.
                            </p>
                        </section>
                    </div>
                {% endif %}
            </div>
        </section>
    {% endblock content %}

Crapp Urls
----------
In our ``__init__.py`` within our newly created crapps (create_account) we set our new urls. ::

    from django_cradmin import crapp


    class App(crapp.App):
        appurls = [
            crapp.Url(
                r'^$',
                CreateAccountDashboardView.as_view(),
                name=crapp.INDEXVIEW_NAME),
            crapp.Url(
                r'^create-account$',
                create_account_view.CreateAccountView.as_view(),
                name='create_account'
            ),
        ]

Test CRadmin Instance
---------------------
In this test case we do a simple test just to make sure a none super user has access to the page, and one test to see if
an anonymous user don't have access.
::

    from unittest import mock

    from django.conf import settings
    from django.test import TestCase
    from model_mommy import mommy


    class TestCreateAccountCradminInstance(TestCase):
        def test_none_super_user_has_access(self):
            mockrequest = mock.MagicMock()
            mockrequest.user = mommy.make(settings.AUTH_USER_MODEL)
            cradmin_instance = CreateAccountCrAdminInstance(request=mockrequest)
            self.assertTrue(cradmin_instance.has_access())

        def test_unauthenticated_user_no_access(self):
            mockrequest = mock.MagicMock()
            mockrequest.user = AnonymousUser()
            crinstance = CreateAccountCrAdminInstance(request=mockrequest)
            self.assertFalse(mockrequest.user.is_authenticated())
            self.assertFalse(crinstance.has_access())

Test Create Account Dashboard
-----------------------------
In this test we want to see if the template shows the correct content based on if a user if logged in or not. Here we
are using the CRadmin css test classes to be sure that our tests passes regardless of what kind of other CSS classes
you need to have in the template. ::

    import mock
    from django.test import TestCase

    from django_cradmin import cradmin_testhelpers


    class TestCreateAccountDashboard(TestCase, cradmin_testhelpers.TestCaseMixin):
        viewclass = create_account.CreateAccountDashboardView

        def test_not_logged_in_user_gets_error_message(self):
            mockresponse = self.mock_http200_getrequest_htmls()
            self.assertTrue(mockresponse.selector.one('.test-not-authenticated-user'))
            error_message = mockresponse.selector.one('.test-not-authenticated-user').text_normalized
            self.assertEqual('You need to be logged in as a registered user to get access.', error_message)

        def test_logged_in_user_email_in_template(self):
            request_user = mock.MagicMock()
            request_user.email = 'mail@example.com'
            mockresponse = self.mock_http200_getrequest_htmls(
                requestuser=request_user
            )
            self.assertTrue(mockresponse.selector.one('.test-authenticated-user'))
            email_in_template = mockresponse.selector.one('.test-authenticated-user').text_normalized
            self.assertEqual(request_user.email, email_in_template)

Next Chapter
------------
TODO