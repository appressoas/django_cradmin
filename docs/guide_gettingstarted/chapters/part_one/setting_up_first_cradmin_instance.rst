Setting up the First CRadmin Instance
=====================================
One central part of the interface is the ``cramdin_instance``. In this file we connect our CRadmin apps, known as
``crapps``. Further we can render different kind of menus, header and footer. A full explenation of the methods and
functionality which is possible with a ``cradmin_instance`` can be read in class documentation
:class:`django_cradmin.crinstance.BaseCrAdminInstance`

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

Test CRadmin Instance
---------------------
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
