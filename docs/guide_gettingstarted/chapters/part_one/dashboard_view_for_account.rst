Dashboard View for Account
==========================
Our main goal for now is to create a dashboard view, or index view if you prefer, which will give us some information about
the Account we are currently holding. The next step to make this happen is to connect the ``cramdin_instance`` with a
CRadmin application. These apps lives inside a module named ``crapps`` in our Django App. A full documentation for the
CRadmin app can be read the in the class documentation :class:`django_cradmin.crapp.App`.

In CRadmin the apps are essentially our views. This is where we define the urls, layout and content of the various
pages for our CRadmin interface.

First we create a module called ``crapps`` which will hold all of our cradmin applications. Inside here, we create a
file called ``account_dashboard.py``. The Project structure will look something like ::

    cradmin_gettingstarted
        crapps
            init.py
            account_dashboard.py
        migrations
        tests
        init.py
        account_admin_cradmin_instance.py
        models.py

The file named ``account_dashboard.py`` will contain a class which is a sub of the ``WithinRoleTemplateView``. This view
is used when you extends the ``django_cradmin/base.django.html`` template which inherit from Djangos generic
templateview. As the name suggests, our ``WithinRoleTemplateView`` is used when you have a role, as we sat in the
cradmin instance file to the class Account.

Inside the ``account_dashboard.py`` file we add this content::

    from django_cradmin.viewhelpers.generic import WithinRoleTemplateView

    class AccountDashboardView(WithinRoleTemplateView):
        template_name = 'cradmin_gettingstarted/account.dashboard.django.html'

You could choose to use the built-in template in CRadmin, hence not setting a template name. However, we want to show
you some functionality which is done in the template, thus we create our own and put in the template folder for our
Django project, just as we always do.

Eventhough it is common practice to not put code in an ``__init__.py``file, we put our ``crapp.App`` class in here. This
makes it possible to load different urls from our CRadmin application in an easy way. Besides all of our crapps modules
are selfcontained, so being outside the CRadmin app we either import the whole shabang or we don't import it at all.

So in the ``__init__.py`` file inside the crapps folder we add the url to the view as this::

    from django_cradmin import crapp


    class App(crapp.App):
        appurls = [
            crapp.Url(r'^$', AccountDashboardView.as_view(), name=crapp.INDEXVIEW_NAME)
        ]

Template for Account Dashboard
------------------------------
As mentioned earlier we want to use our own template, so I have created a file named ``account_dashboard.django.html`` which
is placed inside the Django applications template folder with the following content::

    {% extends "django_cradmin/base.django.html" %}

    {% block title %}
        {{ request.cradmin_role.name }}
    {% endblock title %}

    {% block content %}

    {% endblock content %}

Now, as you can see in the title block we are requesting the account name for the cradmin_role. To make this work we
need to implement the :func:`django_cradmin.crinstance.BaseCrAdminInstance.get_titletext_for_role` in our
``account_admin_cradmin_instance.py`` file and tell it to return the account name, like this::

    def get_titletext_for_role(self, role):
        return role.name

Testing the View
----------------
Before we contiune our work, let us take a short break. Go outside, stretch our legs and get some fresh air.

Now that we feel refreshed, it is time to test the recent work. CRadmin has test helpers to make testing work fast and
easy. We consider it very important to test code, so it is equally important to have tools which makes the testing go
smoothly. We will start simple and explain some basic functionality for testing with CRadmin. If you want to read more
about testing in CRadmin, go over to the class documentation :class:`django_cradmin.cradmin_testhelpers.TestCaseMixin`.


We have the same structure in our tests module as we have for our Django App, meaning inside the tests directory there
is a new module named ``test_crapps``. Inside here we put the file ``test_account_dashboard.py``::

    tests
        test_crapps
            __init__.py
            test_account_dashboard.py
        __init__.py
        test_account_admin_cradmin_instance.py


The first thing we're going to test is if the account name for an instance of our Account model is displayed in the
template. We create a test class which is a subclass of both ``TestCase`` and ``cradmin_testhelpers.TestCaseMixin``. In
this class we tell which view we want to test. Further we write a method to check the html title in the template, where
we create both an Account and an AccountAdministrator with mommy. Further we mock a get request by using functionality
from CRadmin.

Our test file for the account dashboard view looks like this::

    from django.conf import settings
    from django.test import TestCase
    from model_mommy import mommy

    from django_cradmin import cradmin_testhelpers


    class TestAccountIndexView(TestCase, cradmin_testhelpers.TestCaseMixin):
        """"""
        viewclass = AccountDashboardView

    def test_get_title(self):
        account = mommy.make(
            'cradmin_gettingstarted.Account',
            name='My account'
        )
        mommy.make(
            'cradmin_gettingstarted.AccountAdministrator',
            account=account,
            user=mommy.make(settings.AUTH_USER_MODEL)
        )
        mockresponse = self.mock_getrequest(
            htmls_selector=True,
            cradmin_role=account
        )
        mockresponse.selector.prettyprint()
        page_title = mockresponse.selector.one('title').alltext_normalized
        self.assertEqual(account.name, page_title)

In the ``self.mock_get_request`` hmtls selector is True and the CRadmin role is our newly created account. Htmls
is created by us to make it easy to use CSS selectors with HTML in unittests. The line
``mockresponse.selector.prettyprint()`` writes the template out to your terminal. Normally this is NOT pushed up to
GitHub or wherever you store you code. It's just a tool making it easy for a developer to see the whole template with
all its CSS classes and HTML tags. The line ``page_title = mockresponse.selector.one('title').alltext_normalized``
fetches the templates title. We tell the HTMLS that we expect just one instance of a title and that we want all the text
appear with normalize whitespace, meaning all text within this element and all child elements has the string stripped
of whitespaces in both ends and all consecutive whitespace characters is repleced with a single space. If we want to
just get the text within a element, we use ``text_normalized`` instead. For this example, I think both would work.
Nevertheless, we now have fetched the title from our template and can do a assert equal to see if it matches
the account name.

Project urls
------------
Earlier on we wrote a reg-ex for our index view in the ``__init__.py`` file within our CRadmin application(crapps). The
next url releated step is to tell our Django project to include this url. The file we now need to open is the one
containing the projects url patterns. In here we include the urls from our CRadmin instance::

    urlpatterns = [
        url(r'^gettingstarted/', include(AccountAdminCradminInstance.urls())),
    ]

Apps in our CRadmin instance
----------------------------
The next step is to tell the CRadmin instance to include our CRadmin application, which is done by importing the class
App from the ``__init__.py`` file where our reg-ex is written. Our ``account_admin_cradmin_instance.py`` looks like
this::

    class AccountAdminCradminInstance(crinstance.BaseCrAdminInstance):
        roleclass = Account

        apps = [
            ('account_admin', crapps.App)
        ]

The string `account_admin` is the name given of the CRadmin application(crapps). This name is used in several different
ways, like setting which crapps is the frontpage application and when creating links in a template. While we have the
CRadmin instance file open, lets add a few more elements. First we need to decide which crapps is our frontpage, since
we only have one CRadmin application so far, it's an easy choice. Further we need to give the CRadmin instance an id.
Our ``account_admin_cradmin_instance.py`` file will now look like this::

    class AccountAdminCradminInstance(crinstance.BaseCrAdminInstance):
        id = 'account_admin'
        roleclass = Account
        rolefrontpage_appname = 'account_admin'

        apps = [
            ('account_admin', crapps.App)
        ]

        def get_rolequeryset(self):
            queryset = Account.objects.all()
            if not self.request.user.is_superuser:
                queryset = queryset.filter(accountadministrator__user=self.request.user)
            return queryset

        def get_titletext_for_role(self, role):
            return role.name