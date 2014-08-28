from django.db import models


class SomeItem(models.Model):
    name = models.CharField(
        max_length=30,
        verbose_name='The name'
    )
    text = models.TextField(
        blank=True, null=False, default=''
    )
