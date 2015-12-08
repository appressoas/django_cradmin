from __future__ import unicode_literals

from django.conf import settings
from django.db import models
from future.utils import python_2_unicode_compatible


@python_2_unicode_compatible
class Site(models.Model):
    name = models.CharField(max_length=100)
    admins = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='listfilterdemo_admins')


@python_2_unicode_compatible
class Person(models.Model):
    site = models.ForeignKey(Site)
    name = models.CharField(max_length=255)
    banned_datetime = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.name
