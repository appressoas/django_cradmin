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
