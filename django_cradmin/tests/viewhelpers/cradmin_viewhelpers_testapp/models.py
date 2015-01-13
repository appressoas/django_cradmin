from django.db import models


class TestModel(models.Model):
    testfield = models.CharField(verbose_name=u'Test Value', max_length=100)
