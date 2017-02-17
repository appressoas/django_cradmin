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

First you create a Django app inside you project, just like you always do in Django, and create your models and do some
simple testing to get started on that part. In this guide we will create a message system where you can write messages
as an administrator with the correct role and look at messages written by other as a common user without a special role.

Setting up the models
=====================
The models.py file looks like this in the beginning::

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

Setting database model and connect the model with CRadmin instance
------------------------------------------------------------------
We begin by creating the file ``gettingstarted_cradmin_instance.py`` with the class ``BaseCrAdminInstance``, which will
contain our main CRadmin configuration. This class will inherit from
:class:`django_cradmin.crinstance`. Then we add the database model and queryset for our ``CrAdminInstance``.
This is done by overriding the variable :obj:`django_cradmin.crinstance.BaseCrAdminInstance.roleclass` and the function
:func:`django_cradmin.crinstance.BaseCrAdminInstance.get_rolequeryset`. Our ``gettingstarted_cradmin_instance.py``
file looks like this::

    from django_cradmin import crinstance
    from django_cradmin.demo.cradmin_gettingstarted.models import Account


    class GettingStartedCradminInstance(crinstance.BaseCrAdminInstance):
        roleclass = Account

        def get_rolequeryset(self):
            queryset = Account.objects.all()
            if not self.request.user.is_superuser:
                queryset = queryset.filter(accountadministrator__user=self.request.user)
            return queryset

When we make a query now and request an account without setting an ``user`` in
:class:`django_cradmin.demo.cradmin_gettingstarted.models.AccountAdministrator` and connecting this ``user`` to the
:class:`django_cradmin.demo.cradmin_gettingstarted.models.Account` the rolequeryset will be empty.
Likewise, ``get_rolequersyet`` should not be empty when an ``user`` is connected to the
:class:`django_cradmin.demo.cradmin_gettingstarted.models.Account`. Lets write two tests to confirm this theory::

    from unittest import mock

    from django.conf import settings
    from django.test import TestCase
    from model_mommy import mommy

    from django_cradmin.demo.cradmin_gettingstarted.gettingstarted_cradmin_instance import GettingStartedCradminInstance


    class TestGettingStartedCradminInstance(TestCase):
        def test_none_super_user_makes_empty_rolequeryset(self):
            mommy.make('cradmin_gettingstarted.Account')
            mockrequest = mock.MagicMock()
            mockrequest.user = mommy.make(settings.AUTH_USER_MODEL)
            cradmin_instance = GettingStartedCradminInstance(request=mockrequest)
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
            cradmin_instance = GettingStartedCradminInstance(request=mockrequest)
            self.assertEqual(1, cradmin_instance.get_rolequeryset().count())

Building an index view for Account
----------------------------------
We have now set up a ``CrAdminInstance`` and connected it to a model, but it doesn't quite work yet. To make it work
we must first connect it to a :class:`django_cradmin.crapp.App`. In cradmin, the apps are essentially your views.
This is where you define the urls, layout and content of the various pages in your cradmin interface.

First we create a module called ``crapps`` which will hold all of our cradmin applications. Inside here, we create a
file called ``account_index.py``. The Project structure will look something like ::

    cradmin_gettingstarted
        crapps
            init.py
            account_index.py
        migrations
        tests
        init.py
        gettingstarted_cradmin_instance.py
        models.py
Inside the ``account_index.py`` file we add this content::

    from django_cradmin.viewhelpers.generic import WithinRoleTemplateView

    class AccountIndexView(WithinRoleTemplateView):
        template_name = 'cradmin_gettingstarted/account.index.django.html'

There are many different viewhelpers in CRadmin suthing different purposes. However, to view an account we need an
user which is an administrator for that account, thus we use the ``WithinRoleTemplateView`` as super for our index view.

Then in the ``__init__.py`` file inside the crapps folder we add the url to the view as this::

    from django_cradmin import crapp
    from django_cradmin.demo.cradmin_gettingstarted.crapps.account_index import AccountIndexView


    class App(crapp.App):
        appurls = [
            crapp.Url(r'^$', AccountIndexView.as_view(), name=crapp.INDEXVIEW_NAME)
        ]
Since this is a getting started guide we do not chose to use any built in templates inside cradmin expect the base,
but rather take the time to create an html file insde the template folder. There are different cradmin html files
you can extend. In this example we need to extend the ``django_cradmin/base.django.html`` html file. Further we add
blocks which shows the title and content. So our ``account_index.django.html`` file will look like this::

    {% extends "django_cradmin/base.django.html" %}

    {% block title %}
        {{ request.cradmin_role.account_name }}
    {% endblock title %}

    {% block content %}

    {% endblock content %}
Now, as you can see in the title block we are requesting the account name for the cradmin_role. To make this work we
need to implement the :func:`django_cradmin.crinstance.BaseCrAdminInstance.get_titletext_for_role` in our
``gettingstarted_cradmin_instance.py`` file and tell it to return the account name, like this::

    def get_titletext_for_role(self, role):
        return role.account_name

Testing the view
----------------
Before we add the cradmin_instance to the project urls and watch our work on localhost, we need to test that it behaves
as intended. Before we do this, it is time for you to stretch your legs and rest your eyes for 10 minutes. Okay, now
that you are refreshed, we can take a look a first look at the :class:`django_cradmin.cradmin_testhelpers.TestCaseMixin`
in CRadmin. For now lets keep it simple and just mock a get request for our view to be sure that the title on our html
page is the same as the account_name for an instance of
:class:`django_cradmin.demo.cradmin_gettingstarted.models.Account` which is returned by the ``get_titletext_for_role``
in our ``gettingstarted_cradmin_instance_py`` file.

Our test file for the index view looks like this::

    from django.conf import settings
    from django.test import TestCase
    from model_mommy import mommy

    from django_cradmin import cradmin_testhelpers
    from django_cradmin.demo.cradmin_gettingstarted.crapps import AccountIndexView


    class TestAccountIndexView(TestCase, cradmin_testhelpers.TestCaseMixin):
        """"""
        viewclass = AccountIndexView
The viewclass is just which view you want to test. Next step is to add a method in our test class which checks if the
title is what we want it to be::

    def test_get_title(self):
        account = mommy.make('cradmin_gettingstarted.Account', account_name='My account')
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
Okay, here a lot of things is going on. So lets take it one step at the time. First the modles which we need is created
by mommy. Next we mock a get request where the cradmin role is the account created by mommy, and htmls_selector is True.
``Htmls selector`` is used to easy get hold of CSS selectors so we can check their values. In the next line prettyprint
is called, and this is actually not needed since all it does is to print out the html file in you monitor. It's just a
cool functionality often used to easily see different tag names and css classes before finish writing the test. Normaly
we delete the prettyprint line to prevent alot of printing in terminal when running tests. Anyway, the next line is
where we get the page title, and add the ``alltext_normalized`` so we can compare a string with a string. Finally we
check if the account name is equal to the html title.

Setting up urls
===============
Now we are ready to see our index view on localhost. First we need to connect our new app, the index view, with the
CRadmin instance. This is done by adding the following code in the ``gettingstarted_cradmin_instance`` file::

    class GettingStartedCradminInstance(crinstance.BaseCrAdminInstance):
        roleclass = Account

        apps = [
            ('index', crapps.App)
        ]
Project urls
____________
Now that we have told CRadmin to read the url in our crapps __init__ file, we need to tell our Django project to include
the cradmin instance. So in the file for all your project urls, you import the ``gettingstarted_cradmin_instance`` file
and then you add the following to include the urls::

    urlpatterns = [
        url(r'^gettingstarted/', include(GettingStartedCradminInstance.urls())),
    ]

Create an Account and display account name in html
==================================================
Now is a good time to add the models to your ``admin.py`` file. This way you can create an account and
add a user to that account. Now since we are using rolebased accesscontrol we need to add login functionality so the
account created in Django admin will show up in you template. CRadmin has an easy way to get login and logout up and
running in no time. All you need to do is to add the following in your project settings::

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
Cradmin instance
----------------
As you may have read, the :class:`django_cradmin.crinstance.BaseCrAdminInstance` requires a ``rolefrontpage_appname``
so it know which app is your frontpage. CRadmin calls this ``INDEXVIEW_NAME``, and we sat this name in the ``__ini__``
file when we added the appurls. So your ``gettingstarted_cradmin_instance`` file should now look like this::

    from django_cradmin import crinstance
    from django_cradmin.demo.cradmin_gettingstarted import crapps
    from django_cradmin.demo.cradmin_gettingstarted.models import Account


    class GettingStartedCradminInstance(crinstance.BaseCrAdminInstance):
        id = 'gettingstarted'
        roleclass = Account
        rolefrontpage_appname = 'index'

        apps = [
            ('index', crapps.App)
        ]

        def get_rolequeryset(self):
            queryset = Account.objects.all()
            if not self.request.user.is_superuser:
                queryset = queryset.filter(accountadministrator__user=self.request.user)
            return queryset

        def get_titletext_for_role(self, role):
            return role.account_name
Index view
----------
In the ``account_index.py`` file we need to add some context data. We return all AccountAdministrator objects to the
index where the account is the same as the cradmin role, and write tests to confirm that the method ``get_rolequeryset``
handles the filtration on a level of satifaction. Our ``account_index`` file will now look something like this::

    from django_cradmin.demo.cradmin_gettingstarted.models import Account
    from django_cradmin.viewhelpers.generic import WithinRoleTemplateView


    class AccountIndexView(WithinRoleTemplateView):
        template_name = 'cradmin_gettingstarted/account.index.django.html'

        def __get_account_admin(self):
            return AccountAdministrator.objects.filter(account=self.request.cradmin_role)

        def get_context_data(self, **kwargs):
            context = super(AccountIndexView, self).get_context_data()
            context['accounts'] = self.__get_accounts()
            return context
Test view
_________
First we add a new block to our template so that the Account name shows as a h1 tag for the page and we load the
cradmin_tags which we will use in testing::

    {% extends "django_cradmin/base.django.html" %}
    {% load cradmin_tags %}

    {% block title %}
        {{ request.cradmin_role.account_name }}
    {% endblock title %}

    {% block page-cover-title %}
        {{ request.cradmin_role.account_name }}
    {% endblock page-cover-title %}

Cradmin uses ``cradmin_test_css_class`` as class for html tags. When we do this you can still change other classes on
your tags without have to change anything in your tests. In the ``base.django.html`` which we extends in our template
there is already a test CSS class for the page-cover-title block, so that test-css-class would work without loading the
cradmin tags.
We can now write a test to confirm that the cover title is equal to our Account name. Add a test in your
``test_account_index``::

    def test_get_heading(self):
        account = mommy.make('cradmin_gettingstarted.Account', account_name='Test Account')
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
Here we use a new build in mock method which expects a 200 response from the get request, thus the test fails if another
status code than 200 is return. Further we do not need to say that ``html_selectors=True``. We check that the
``cradmin_test_css_class`` named "test-primary-h1" exists and that is value is equal to the name of the Account.
Next we want to test if the name of an account which we are not the administrator off, shows up in the template. You can
test this with cradmin instances or right in the template. I`m gonna choose the latter since we're looping over all
account in the html file. So in the ``account_index.django.html`` template we add some code to make it look a tad nicer
and a ``cradmin_tes_css_class``::

    {% block content %}
        <section class="adminui-page-section  adminui-page-section--center-lg">
            <div class="container">
                <div class="blocklist blocklist--tight">
                    {% for account in account_admin %}
                        <section class="blocklist__item">
                            <h2 class="blocklist__itemtitle">Account Administrator</h2>
                            <p class="{% cradmin_test_css_class 'account-user-email' %}">{{ account.user.email }}</p>
                        </section>
                    {% endfor %}
                </div>
            </div><!-- end container-->
        </section>
    {% endblock content %}
In the ``test_account_index`` file we can now write a test where only one of two users first name should show::

    def test_only_account_where_user_is_admin_shows_on_page(self):
        account_one = mommy.make('cradmin_gettingstarted.Account', account_name='Wrong role account')
        account_two= mommy.make('cradmin_gettingstarted.Account', account_name='Right role account')
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
        self.assertTrue(mockresponse.selector.one('.test-account-user-email'))
        admin_email = mockresponse.selector.one('.test-account-user-email').alltext_normalized
        self.assertEqual('me@example.com', admin_email)

Create a new account
====================
If you now go to Django Admin and add another account for the same user. After that you go to root of you localhost and
you will see you now can choose which account you would like to edit. This page is created by CRadmin without us doing
anything else than a bit inheritance in our view. But it´s a bit unpractical to go into Django admin and create a new
account, so lets add a Create button on our ``account_index.django.html`` file which points to a new view. We use
the same CRadmin instance and add the url in the __ini__ file. We better organize this in a manner which make sens, we
need to create a new module in our ``crapps`` module, and name this ``account``. We also move the content from our old
``__init__`` file to the newly created ``__init__`` file. Finally we need to update the import in our
``gettingstarted__cradmin_instance`` file. Finally we implement the new crapps structur in our test module, and update
the import in our ``test_account_index.py`` file as well. So our new project structure now looks something like this::

    cradmin_gettingstarted
        crapps
            account
                __init__.py (move appurls to this file)
                account_index.py
        __init__.py (no appurls in here anymore)
        templates
        tests
            test_crapps
                test_account
                    __init__.py
                    test_account_index.py
            __init__.py
            test_gettingstarted_cradmin_instance.py
        __init__.py
        admin.py
        gettingstarted_cradmin_instance (remeber to update imports here)
        models.py

Add Create button
-----------------










We begin by creating the file ``cradmin_question.py`` in the views folder of our ``polls`` app. In this file we
add this content::

    from django_cradmin import crapp
    from django_cradmin.viewhelpers import objecttable
    from polls import models


    class QuestionListView(objecttable.ObjectTableView):
        model = models.Question
        columns = ['question_text']

        def get_queryset_for_role(self, role):
            return models.Question.objects.all()


    class App(crapp.App):
        appurls = [
            crapp.Url(r'^$', QuestionListView.as_view(), name=crapp.INDEXVIEW_NAME)
        ]

This code snippet defines a :class:`django_cradmin.crapp.App`` instance with a :class:`django_cradmin.crapp.Url`
pointing to a :class:`django_cradmin.viewhelpers.objecttable.ObjectTableView`.

The ``App`` is essentially just a place where we define the urls for our cradmin views, and the ``ObjectTableView`` is a
view for presenting a list of objects as a table. In our ``ObjectTableView``, ``QuestionListView``, we define the bare
minimum for a ``ObjectTableView``:

 - ``model``: the Django model we read data from
 - :obj:`django_cradmin.viewhelpers.objecttable.ObjectTableView.columns`: what columns should each row contain. In this case
   we simply entered a model-value from ``Question``; ``question_text``.
 - :func:`django_cradmin.viewhelpers.objecttable.ObjectTableView.get_queryset_for_role()`: define the queryset that should be
   returned for the list.

You should now have a list of all questions in the database, but this is not particularily useful on its own, so
now it's time to add some functionality to our view!

Adding and editing objects
--------------------------
