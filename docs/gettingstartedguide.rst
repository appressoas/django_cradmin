########
Tutorial
########

.. warning:: This guide is under development, and does not work at this time.

Install
=======
If you have not already done so, please follow the steps in the :ref:`installguide` guide before continuing.


New to CRadmin
==============
If you are new to CRadmin we advice you to read :ref:`newbieguide` before advancing.


Introduction
============
With this project we aim to make the admin interface easier to use, prettier to look at, and more flexible than the
original admin interface in Django.


In this guide we will create a message system where you can write messages as an administrator with the correct role
and look at messages written by other as a common user without a special role. We do not show you where from where we
import project file since this application is build inside CRadmin alongside aother applications made for demo purpose.
Hence, your project sturcture will not look like ours. However, when we import from external libraries or from CRadmin
itself, we will show it.

Setting up the models
---------------------
First you create a Django app inside your project, just like you always do in Django, and create your models and do
some model testing to get started on that part. The models.py file looks like this in the beginning::

    from django.conf import settings
    from django.db import models

    class Account(models.Model):
        """
        The account which works as the cradmin_role.
        """

        #: The name of the account which create, edit and delete messages
        account_name = models.CharField(
            blank=False,
            null=False,
            max_length=50,
            verbose_name='Account name'
        )

        def __str__(self):
            return self.account_name


    class AccountAdministrator(models.Model):
        """
        A user which is an administrator for the :class:`.Account`."
        """

        #: A user with privileges for handling an :class:`.Account`
        user = models.ForeignKey(settings.AUTH_USER_MODEL)

        #: The :class:`.Account` in question to which be administrated
        account = models.ForeignKey(Account)



Setting up a CRadmin interface
==============================
One central part of the interface is the ``cramdin_instance``. In this file we connect our CRadmin apps, known as
``crapps``. Further we can render different kind of menus, header and footer. A full explenation of the methods and
functionality which is possible with a ``cradmin_instance`` can be read in class documentation
:class:`django_cradmin.crinstance.BaseCrAdminInstance`

Setting database model and connect the model with the CRadmin instance
----------------------------------------------------------------------
We begin by creating the file ``account_admin_cradmin_instance.py`` which is a subclass of
``BaseCrAdminInstance`` and it will contain our main CRadmin configuration. For now we place this file at the same level
as our models.py file. By overriding the variable ``roleclass`` and method ``get_rolequeryset`` we add a databasemodel
as the roleclass and decides which objects to be returned from the database. Our ``account_admin_cradmin_instance.py``
file looks like this::

    from django_cradmin import crinstance

    class AccountAdminCradminInstance(crinstance.BaseCrAdminInstance):
        roleclass = Account

        def get_rolequeryset(self):
            queryset = Account.objects.all()
            if not self.request.user.is_superuser:
                queryset = queryset.filter(accountadministrator__user=self.request.user)
            return queryset

Here we have defined a roleclass and returned all Account objects in the database which have an user defined in
the class AccountAdministrator. If you are logged in as a superuser, all Accounts will be returne. So if we query an
Account which is not connected to an AccountAdministrator, the ``get_rolequeryset`` should be empty. Likewise, the
``get_rolequeryset`` should not be empty when a user is connected to the Account class through the AccountAdministrator.
Lets write two tests to check if this theory holds water. For most of the tests we`ll be using mommy, and for some tests
we also use MagicMock::

    from unittest import mock

    from django.conf import settings
    from django.test import TestCase
    from model_mommy import mommy

    class Testaccount_adminCradminInstance(TestCase):
        def test_none_super_user_makes_empty_rolequeryset(self):
            mommy.make('cradmin_gettingstarted.Account')
            mockrequest = mock.MagicMock()
            mockrequest.user = mommy.make(settings.AUTH_USER_MODEL)
            cradmin_instance = AccountAdminCradminInstance(request=mockrequest)
            self.assertEqual(0, cradmin_instance.get_rolequeryset().count())

        def test_user_is_in_rolequeryset(self):
            user = mommy.make(settings.AUTH_USER_MODEL)
            account = mommy.make('cradmin_gettingstarted.Account')
            mommy.make(
                'cradmin_gettingstarted.AccountAdministrator',
                account=account,
                user=user
            )
            mockrequest = mock.MagicMock()
            mockrequest.user = user
            cradmin_instance = AccountAdminCradminInstance(request=mockrequest)
            self.assertEqual(1, cradmin_instance.get_rolequeryset().count())

As the tests shows, our queryset is empty when the Account is not connected to an AccountAdministrator. Further, the
queryset returned one object from the database when we connected the two. So far so good.


Building an index view for Account
----------------------------------
Our main goal for now is to create an indexview or a dashboard if you prefer, which will give us some information about
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

As mentioned earlier we want to use our own template, so I have created a file named ``account_dashboard.django.html`` which
is placed inside the Django applications template folder with the following content::

    {% extends "django_cradmin/base.django.html" %}

    {% block title %}
        {{ request.cradmin_role.account_name }}
    {% endblock title %}

    {% block content %}

    {% endblock content %}

Now, as you can see in the title block we are requesting the account name for the cradmin_role. To make this work we
need to implement the :func:`django_cradmin.crinstance.BaseCrAdminInstance.get_titletext_for_role` in our
``account_admin_cradmin_instance.py`` file and tell it to return the account name, like this::

    def get_titletext_for_role(self, role):
        return role.account_name

Testing the view
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

Our test file for the index view looks like this::

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
            account_name='My account'
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
        self.assertEqual(account.account_name, page_title)

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
            return role.account_name

Enhance our Index View
----------------------
So far our index view does very little, so lets expand it by fetching the Account and the user which is the Account
Administrator and get this as context data used in our template. We use our `cradmin_role` to get the Account object,
and filter eith the id of the `cradmin_role` to filter the AccountAdministrator objects.

Our ``account_dashboard.py`` file now looks something like this::

    from django_cradmin.demo.cradmin_gettingstarted.models import Account
    from django_cradmin.viewhelpers.generic import WithinRoleTemplateView


    class AccountDashboardView(WithinRoleTemplateView):
        template_name = 'cradmin_gettingstarted/account_dashboard.django.html'

        def __get_account_admin(self):
        return AccountAdministrator.objects.get(pk=self.request.cradmin_role.id)

        def get_context_data(self, **kwargs):
            context = super(AccountDashboardView, self).get_context_data()
            context['account_admin'] = self.__get_account_admin()
            context['account'] = self.request.cradmin_role
            return context

Test the View and Expand the Template
-------------------------------------
Now that we have written some more code, it is time to do some testing. Oh yeah, if you now have been infront of your
screen for the last 60 minutes, please do stretch your legs and get some fresh air before continuing.

In these tests we are gonna do one test which is more or less the same test as we did when checking the templates title.
The reason why we do almost the same test one more time is to show some of the smooth functionality in CRadmin. We are
gonna use the ``cradmin_test_css_class`` which is CSS classes only shown in a test environment. In the page cover title
block which we soon add to our template, CRadmin has already added a test css class for us, named `test-primary-h1`.
Another CRadmin test functionality we are going to use is the ``mock_http200_getrequest_htmls``. This method does two
things which we want to point out at this time. First, it automaticly assert the status code, so if we get any other
status code than 200 give a test failure. Second, we do not need to say `htmls_selector=True` since is implemented in
the method.

First we add a page cover title block in our template::

    {% extends "django_cradmin/base.django.html" %}
    {% load cradmin_tags %}

    {% block title %}
        {{ request.cradmin_role.account_name }}
    {% endblock title %}

    {% block page-cover-title %}
        {{ request.cradmin_role.account_name }}
    {% endblock page-cover-title %}

Then in our ``test_account_dashboard.py`` file we add a method which tests if we fetch the account name and sets it as a
primary heading::

    def test_get_heading(self):
        account = mommy.make(
            'cradmin_gettingstarted.Account',
            account_name='Test Account'
        )
        mommy.make(
            'cradmin_gettingstarted.AccountAdministrator',
            account=account,
            user=mommy.make(settings.AUTH_USER_MODEL)
        )
        mockresponse = self.mock_http200_getrequest_htmls(
            cradmin_role=account
        )
        self.assertTrue(mockresponse.selector.one('.test-primary-h1'))
        heading = mockresponse.selector.one('.test-primary-h1').alltext_normalized
        self.assertEqual(account.account_name, heading)

If you use the prettyprint() functionality as explained in the first test, you will see there is a CSS class named
`test-primary-h1`. In the test we first checks that this CSS class exists, so we konw that the loading of CRadmin tags
works as intended in our template. Then we remove whitespaces and strips the string by normalizing the text. Last we
check if the normalized text from the template is equal to the account name.

Now let us add a blocklist item to our template in the content block. We are using CRadmin CSS classes to get a good
admin layout. Further we add a `cradmin_test_css_class` which we are going to use in our test when we check if the
users email is equal to the account administrator's email. We expand our ``account_dashboard.django.html`` file with the
following::

    {% block content %}
        <section class="adminui-page-section  adminui-page-section--center-lg">
            <div class="container">
                <div class="blocklist blocklist--tight">
                    <section class="blocklist__item">
                    <h2 class="blocklist__itemtitle">Account administrator</h2>
                    <p class="{% cradmin_test_css_class 'admin-user-email' %}">{{ account_admin.user.email }}</p>
                </section>
                </div>
            </div><!-- end container-->
        </section>
    {% endblock content %}

In the ``test_account_dashboard`` file we can now write a test where only one of two users email should show in the template
::

    def test_only_account_where_user_is_admin_shows_on_page(self):
        account_one = mommy.make(
            'cradmin_gettingstarted.Account',
            account_name='Wrong role account'
        )
        account_two= mommy.make(
            'cradmin_gettingstarted.Account',
            account_name='Right role account'
        )
        mommy.make(
            'cradmin_gettingstarted.AccountAdministrator',
            account=account_one,
            user=mommy.make(settings.AUTH_USER_MODEL, email='not_me@example.com')
        )
        mommy.make(
            'cradmin_gettingstarted.AccountAdministrator',
            account=account_two,
            user=mommy.make(settings.AUTH_USER_MODEL, email='me@example.com')
        )
        mockresponse = self.mock_http200_getrequest_htmls(
            cradmin_role=account_two)
        self.assertTrue(mockresponse.selector.one('.test-admin-user-email'))
        admin_email = mockresponse.selector.one('.test-admin-user-email').alltext_normalized
        self.assertEqual('me@example.com', admin_email)


Moving on to Localhost
----------------------
We have tested the functioanlity we have created so far, and everything seems to be working as wanted. The time
has come to see our result on localhost. If you haven't done it yet, please add the models to your ``admin.py`` file.
Fire up localhost and go to Djangoadmin and create an Account and an AccountAdministrator. If you have the same url
patterns as suggested in this tutorial, you should see the template at `localhost/gettingstarted`. Another thing worth
checking out is to add a second Account in Djangoadmin for the AccountAdministrator. If you then go back to
`localhost/gettingstarted` you should see a view where you can choose which account you want to edit. This view is
automaticly added by CRadmin.

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

Create an Edit View for Account
===============================
The main goal for this part of the tutorial is to create functionality which allows us to change the name of an existing
account. We're goning to use a mixin class which holds our form and uses CRadmin uicontainer to render the form. Further
will our view class have a super class from CRadmin. As mentioned earlier there are different formview classes in
CRadmin which extends Djangos views. When we want to edit an account, the view is a subclass of the CRadmin class
``WithinRoleUpdateView``. This view is a modelform view.


Since we now have more than one file inside our CRadmin application(crapps) module, it is time to create a new module
within our `crapps` module, and call it `account_adminui`. Put ``__init__.py`` file with our urls and the file
``account_dashboard_view.py`` inside the new module. Rerun all tests to be sure everyting works as intended with the new
crapps structure::

    cradmin_gettingstarted
        crapps
            account_adminui
                __init__.py
                account_dashboard_view.py
                edit_account_view.py
                mixins.py
            __init__.py

Mixins
------
In our mixins file we import uicontainer and formview from CRadmin, and render a form based on the Account class. We
also needs to tell CRadmin the role, which in our case is Account. The mixin file will look something like this::

    from django_cradmin import uicontainer
    from django_cradmin.viewhelpers import formview


    class AccountCreateUpdateMixin(object):
        model = Account
        roleid_field = 'account'
        fields = [
            'account_name'
        ]

        def get_form_renderable(self):
            return uicontainer.layout.AdminuiPageSectionTight(
                children=[
                    uicontainer.form.Form(
                        form=self.get_form(),
                        children=[
                            uicontainer.fieldwrapper.FieldWrapper('account_name'),
                            uicontainer.button.SubmitPrimary(
                                text='Save')
                        ]
                    )
                ]
            ).bootstrap()

The View
--------
The file ``edit_account_view.py`` overrides the method `get_queryset_for_role` where we filter on the pk of the current
CRadmin role. Since our CRadmin role is account, you could argue that we filter on the pk for the account we are
currently lookin at. The ``edit_account_view.py`` file looks something like ::

    class AccountUpdateView(mixins.AccountCreateUpdateMixin, formview.WithinRoleUpdateView):
        """"""
        def get_queryset_for_role(self):
            return Account.objects.filter(id=self.request.cradmin_role.pk)

The url
-------
We add a new url in the ``__init__.py`` file inside our account adminui crapps::

    class App(crapp.App):
        appurls = [
            crapp.Url(
                r'^$',
                account_dashboard.AccountDashboardView.as_view(),
                name=crapp.INDEXVIEW_NAME
            ),
            crapp.Url(
                r'^edit/(?P<pk>\d+)$',
                edit_account.AccountUpdateView.as_view(),
                name='edit'
            )
        ]

The template
------------
We do not create a new template for this edit view, but rather use the built-in CRadmin template. So in our
``account_dashboard.django.html`` file we add a new blocklist section after the one which gives the name for the account
administrator. To make our button work we need to tell the `href` to look for a view within the current CRadmin
instance. This is done by using Django template tags syntax. We also pass along the id of the current account as the
pk, which is accessible from the `get_context_data` method in our ``account_dashboard_view.py`` file. A full explenation
about CRadmin template tags can be read at :ref:`cradmin_tags` ::

    <section class="blocklist__item">
        <h2 class="blocklist__itemtitle">Edit Account</h2>
        <a href='{% cradmin_appurl viewname="edit" pk=account.id %}' class="button  button--primary">
            Change name
        </a>
    </section>

This is all the code neded to be able to change the account name in our edit view. Before we start testing, it is again
time to look at the clock and see if you have been infront of the screen for 60 minutes. If yes, take som fresh air and
stretch those legs of yours.

Test Edit Account View
----------------------
There are several scenarios which you could test for an edit view. We are going to test three of those. First if the
form is rendered with the name of the current account. Second, we try to post the form but leave the new account name
empty. This means we should get a response code of 200. Finally we post the form with a new account name for the current
Account object. Here we should get a 302 Found redirects response.

We need to set the account id as a pk when testing, and this is done with ``viewkwargs``. Further we
need to pass the account name when we post the form, and this is done with ``requestkwargs``. Beside this there is
nothing new in our test methods. Our file ``test_edit_account.py`` looks something like this.::

    from django.conf import settings
    from django.test import TestCase
    from model_mommy import mommy

    from django_cradmin import cradmin_testhelpers


    class TestUpdateAccountView(TestCase, cradmin_testhelpers.TestCaseMixin):
        viewclass = edit_account_view.AccountUpdateView

        def test_get_form_renderable(self):
            account = mommy.make(
                'cradmin_gettingstarted.Account',
                account_name='Charisma'
            )
            mommy.make(
                'cradmin_gettingstarted.AccountAdministrator',
                account=account,
                user=mommy.make(settings.AUTH_USER_MODEL)
            )
            mockresponse = self.mock_http200_getrequest_htmls(
                cradmin_role=account,
                viewkwargs={'pk': account.id}
            )
            self.assertTrue(mockresponse.selector.one('#id_account_name'))
            form_account_name = mockresponse.selector.one('#id_account_name').get('value')
            self.assertEqual(account.account_name, form_account_name)

        def test_post_without_required_account_name(self):
            account = mommy.make(
                'cradmin_gettingstarted.Account',
                account_name='Charisma'
            )
            mommy.make(
                'cradmin_gettingstarted.AccountAdministrator',
                account=account,
                user=mommy.make(settings.AUTH_USER_MODEL)
            )
            mockresponse = self.mock_http200_postrequest_htmls(
                cradmin_role=account,
                viewkwargs={'pk': account.id},
                requestkwargs={
                    'data': {
                        'account_name': ''
                    }
                }
            )
            self.assertTrue(mockresponse.selector.one('#id_account_name_wrapper'))
            warning_message = mockresponse.selector.one('#id_account_name_wrapper .test-warning-message').alltext_normalized
            self.assertEqual('This field is required.', warning_message)

        def test_post_with_required_account_name_updates_db(self):
            """Should get a 302 Found redirects and have one Account object in database with a new name"""
            account = mommy.make(
                'cradmin_gettingstarted.Account',
                account_name='Charisma'
            )
            mommy.make(
                'cradmin_gettingstarted.AccountAdministrator',
                account=account,
                user=mommy.make(settings.AUTH_USER_MODEL)
            )
            accounts_in_db = Account.objects.all()
            self.assertEqual(1, accounts_in_db.count())
            self.mock_http302_postrequest(
                cradmin_role=account,
                viewkwargs={'pk': account.id},
                requestkwargs={
                    'data': {
                        'account_name': 'The idol'
                    }
                }
            )
            accounts_in_db = Account.objects.all()
            self.assertEqual(1, accounts_in_db.count())
            get_account_from_db = Account.objects.filter(pk=account.id).get()
            self.assertEqual('The idol', get_account_from_db.account_name)

Since we changed the structure in our crapps module, I have updated the structur of the tests module, so it now looks
like this::

    tests
        test_crapps
            test_account_adminui
                __init__.py
                test_account_dashboard_view.py
                test_edit_account_view.py
            __init__.py
        test_models
            __init__.py
            test_account.py
            test_account_administrator.py
        __init__.py
        test_account_admin_cradmin_instance.py

Create a new account
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
class named `NoRoleMixin` and overwrite the method `has_acces` so it returns True if the user is authenticated. We don't
need to override this method since CRadmin handles it for us. But since this is a getting started guide it is important
to show some of the behind scene action. Further we alos use the class `BaseCrAdminInstance` as a super. We give our
CRadmin instance an id, and sets the name of which crapps to be our rolefrontpage. ::

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
Again we are adding both CRadmin CSS style classes and CRadmin test css classes. If you want to check out the base
CSS style classes used in CRadmin, go to `localhost/styleguide`.
::

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

Test CRadmin instance
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
In this test we want to see if the template shows the correct content based on if a user if logged in or not. One could
argue that it is unneccassary to have this test in the template since we already have an test on the CRadmin instance.
However urls are a source to many a evil, so there is nothing wrong with another layer of security. Here we are using
the CRadmin css test classes to be sure that our tests passes regardless of what kind of other CSS classes you need to
have in the template.
::

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

Create Account View
-------------------
In our view for creating a new account we use the same modelform as for creating an account, thus inheriting from the
`AccountCreateUpdateMixin`. Furthermore we also inherit from `WithinRoleCreateView`. We set the `roleid_field` here to
`create_account` which is the id to the CRadmin instance for create account. The first method is overriding the
`save_object` method and here we create and save an AccountAdministrator at the same time as an Account is created.
Now in the method `get_success_url` we want to be taken to the ``AccountDashboardView``. This view lives inside our
other CRadmin instance, so we need to return the `reverse_cradmin_url` and pass along the cradmin instance id of where
we want to go and which app within the Cradmin instance we want to go to. Since we want to go to a place which demands a
role, we also pass the role id. When doing this, we can go from one CRadmin instance without a role to another CRadmin
instance which have a role. ::

    from django_cradmin.crinstance import reverse_cradmin_url
    from django_cradmin.viewhelpers import formview


    class CreateAccountView(mixins.AccountCreateUpdateMixin, formview.WithinRoleCreateView):
        roleid_field = 'create_account'

        def save_object(self, form, commit=True):
            self.new_account = super(CreateAccountView, self).save_object(form, commit)
            account_administrator = AccountAdministrator(
                user=self.request.user,
                account=self.new_account
            )
            account_administrator.full_clean()
            account_administrator.save()
            return self.new_account

        def get_success_url(self):
            return reverse_cradmin_url(
                instanceid='account_admin',
                appname='account_admin',
                roleid=self.new_account.id
            )

Test Create Account View
------------------------
Contiune here by checking if these tests are okay. Should you really get to see the template when not being an
authenticated user? Same for second test, should not `requestuser` be a must in the post request?
::

    import mock
    from django.conf import settings
    from django.test import TestCase
    from model_mommy import mommy

    from django_cradmin import cradmin_testhelpers
    from django_cradmin.demo.cradmin_gettingstarted.models import Account


    class TestCreateAccountView(TestCase, cradmin_testhelpers.TestCaseMixin):
        viewclass = create_account_view.CreateAccountView

        def test_get_render_form(self):
            mockrespone = self.mock_http200_getrequest_htmls()
            self.assertEqual(mockrespone.selector.one('#id_account_name_label').text_normalized, 'Account name')

        def test_post_form(self):
            self.mock_http302_postrequest(
                requestkwargs={
                    'data': {
                        'account_name': 'Flaming Youth'
                    }
                }
            )
            account_in_db = Account.objects.all()
            new_account = Account.objects.filter(account_name='Flaming Youth').get()
            self.assertEqual(1, account_in_db.count())
            self.assertEqual('Flaming Youth', new_account.account_name)

