########
Tutorial
########


Install
=======
If you have not already done so, please follow the steps in the :ref:`installguide` guide before continuing.


Introduction
============
With this project we aim to make the admin interface easier to use, prettier to look at, and more flexible than the
original admin interface in Django.

This guide will give a small introduction to some basic usage of CRadmin, based on the
`Django poll tutorial <https://docs.djangoproject.com/en/1.7/intro/tutorial01/>`_. All commands in this tutorial
assume that you are in the ``polls`` directory of this project (the same place where ``models.py`` is placed).


Setting up a CRadmin interface
==============================

Setting database model
----------------------
We begin by creating the file ``cradmin.py`` with the class ``CrAdminInstance``, which will contain our main CRadmin
configuration. This class will inherit from :class:`django_cradmin.crinstance.BaseCrArminInstance`.
Then we add the database model and queryset for our ``CrAdminInstance``. This is done by overriding the variable
:obj:`django_cradmin.crinstance.BaseCrAdminInstance.roleclass` and the function
:func:`django_cradmin.crinstance.BaseCrAdminInstance.get_rolequeryset`. Our ``cradmin.py`` file now looks like this::

    from django_cradmin import crinstance
    from . import models
    from .views import cradmin_question


    class CrAdminInstance(crinstance.BaseCrAdminInstance):
        roleclass = models.Question

        def get_rolequeryset(self):
            return models.Question.objects.all()


How to write tests for the crinstance? Follow this link to the writing tests guide.

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
