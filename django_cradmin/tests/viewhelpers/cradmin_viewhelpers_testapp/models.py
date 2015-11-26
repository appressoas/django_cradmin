from __future__ import unicode_literals
from django.db import models


class TestModel(models.Model):
    testfield = models.CharField(verbose_name=u'Test Value', max_length=100)


class FilterTestModel(models.Model):
    mybooleanfield = models.BooleanField(default=False)
    mycharfield = models.CharField(null=True, blank=True, default='', max_length=255)
    myintnullfield = models.IntegerField(default=None, null=True, blank=True)

    def __str__(self):
        return 'FilterTestModel(mycharfield={!r}, mybooleanfield={})'.format(
            self.mycharfield, self.mybooleanfield)
