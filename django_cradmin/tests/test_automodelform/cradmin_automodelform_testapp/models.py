from __future__ import unicode_literals

import datetime

from django.db import models
from django.utils import timezone


class AutoFormTestModel(models.Model):
    datetimefield_with_default = models.DateTimeField(default=timezone.now)
    datetimefield_without_default = models.DateTimeField()
    datefield_with_default = models.DateTimeField(default=datetime.date.today)
    datefield_without_default = models.DateTimeField()
    filefield = models.FileField()

    def __str__(self):
        return 'MyModel#{}'.format(self.id)
