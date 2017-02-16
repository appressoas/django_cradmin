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
