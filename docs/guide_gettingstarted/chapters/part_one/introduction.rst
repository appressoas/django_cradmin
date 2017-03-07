.. warning:: This guide is under development, and does not work at this time.

.. _gettingstarted_part_one:

Introduction
============
If you have not already done so, please follow the steps in the :ref:`installguide` guide before continuing.

If you are new to CRadmin we advice you to read :ref:`newbieguide` before advancing.

With this project we aim to make the admin interface easier to use, prettier to look at, and more flexible than the
original admin interface in Django.

In this guide we will create a message system where you can write messages as an administrator with the correct role
and look at messages written by other as a common user without a special role. We do not show you where from where we
import project file since this application is build inside CRadmin alongside aother applications made for demo purpose.
Hence, your project sturcture will not look like ours. However, when we import from external libraries or from CRadmin
itself, we will show it.

Setting up the Models
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
        name = models.CharField(
            blank=False,
            null=False,
            max_length=50,
            verbose_name='Account name'
        )

        def __str__(self):
            return self.name


    class AccountAdministrator(models.Model):
        """
        A user which is an administrator for the :class:`.Account`."
        """

        #: A user with privileges for handling an :class:`.Account`
        user = models.ForeignKey(settings.AUTH_USER_MODEL)

        #: The :class:`.Account` in question to which be administrated
        account = models.ForeignKey(Account)

Next Chapter
------------
Continue to :ref:`setting_up_first_cradmin_instance`