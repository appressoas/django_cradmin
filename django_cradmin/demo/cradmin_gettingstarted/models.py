from django.conf import settings
from django.db import models


class Account(models.Model):
    """
    The account which works as the cradmin_role.
    """
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
    administrator = models.ForeignKey(settings.AUTH_USER_MODEL)
    account = models.ForeignKey(Account)
