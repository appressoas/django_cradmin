from django.db import models


class SomeItem(models.Model):
    name = models.CharField(
        max_length=30,
        verbose_name='The name'
    )
    somenumber = models.IntegerField(null=True, blank=True)
    text = models.TextField(
        blank=True, null=False, default=''
    )
