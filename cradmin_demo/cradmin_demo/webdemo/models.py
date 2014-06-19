from django.conf import settings
from django.db import models


class Site(models.Model):
    name = models.CharField(max_length=100)
    admins = models.ManyToManyField(settings.AUTH_USER_MODEL)


# class Tag(models.Model):
    # tag = models.SlugField()


class Page(models.Model):
    site = models.ForeignKey(Site)
    title = models.CharField(max_length=100)
    body = models.TextField()
    # tags = models.ManyToManyField(Tag)

    def __unicode__(self):
        return self.title
