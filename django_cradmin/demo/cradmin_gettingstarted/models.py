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
