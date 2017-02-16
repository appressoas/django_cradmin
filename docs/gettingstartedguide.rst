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

        #: A user which have access to an account. A user may have many accounts and an account may have one or more users
        account_user = models.ManyToManyField(settings.AUTH_USER_MODEL)

        def __str__(self):
            return self.account_name


    class AccountAdministrator(models.Model):
        """
        A user which is an administrator for the :class:`.Account`."
        """

        #: A user with privileges for handling an :class:`.Account`
        administrator = models.ForeignKey(settings.AUTH_USER_MODEL)

        #: The :class:`.Account` in question to which be administrated
        account = models.ForeignKey(Account)


Setting up a CRadmin interface
==============================

Setting database model
----------------------
We begin by creating the file ``gettingstarted_cradmin_instance.py`` with the class ``CrAdminInstance``, which will
contain our main CRadmin configuration. This class will inherit from
:class:`django_cradmin.crinstance.BaseCrArminInstance`. Then we add the database model and queryset for our
``CrAdminInstance``. This is done by overriding the variable
:obj:`django_cradmin.crinstance.BaseCrAdminInstance.roleclass` and the function
:func:`django_cradmin.crinstance.BaseCrAdminInstance.get_rolequeryset`. Our ``gettingstarted_cradmin_instance.py``
file now looks like this::

    from django_cradmin import crinstance
    from django_cradmin.demo.cradmin_gettingstarted.models import Account


    class GettingStartedCradminInstance(crinstance.BaseCrAdminInstance):
        roleclass = Account

        def get_rolequeryset(self):
            queryset = Account.objects.all()
            if not self.request.user.is_superuser:
                queryset = queryset.filter(account_user=self.request.user)
            return queryset

When we make a query now and request an account without setting an ``account_user`` the rolequeryset will be empty as
shown in the :ref:`writing_tests_guide`. To be sure the ``get_rolequeryset`` works as intended, lets write a test where
the ``get_rolequeryset`` is not empty.


Building a basic cradmin view
-----------------------------
We have now set up a ``CrAdminInstance`` and connected it to a model, but it doesn't quite work yet. To make it work
we must first connect it to a :class:`django_cradmin.crapp.App`. In cradmin, the apps are essentially your views.
This is where you define the urls, layout and content of the various pages in your cradmin interface.

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
