from __future__ import unicode_literals
from django.db import models
from future.utils import python_2_unicode_compatible


class TstRole(models.Model):
    """
    Used by tests that require a role object.
    """


@python_2_unicode_compatible
class SomeItem(models.Model):
    name = models.CharField(
        max_length=30,
        verbose_name='The name'
    )
    somenumber = models.IntegerField(null=True, blank=True)
    text = models.TextField(
        blank=True, null=False, default=''
    )

    def __str__(self):
        return self.name
