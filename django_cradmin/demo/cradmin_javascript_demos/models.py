from django.db import models


class FictionalFigure(models.Model):
    name = models.CharField(max_length=255)
    about = models.TextField(null=False, blank=True, default='')

    def __str__(self):
        return self.name
