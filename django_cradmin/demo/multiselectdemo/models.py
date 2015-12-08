from __future__ import unicode_literals

from django.db import models
from future.utils import python_2_unicode_compatible


@python_2_unicode_compatible
class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(null=False, blank=True, default='')

    def __str__(self):
        return self.name
