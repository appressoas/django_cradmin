from __future__ import unicode_literals
from builtins import object
from django.conf import settings
from django.db import models
from django.utils.translation import ugettext_lazy as _
from future.utils import python_2_unicode_compatible

from django_cradmin.apps.cradmin_imagearchive import models as imagearchivemodels


class Site(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(
        null=False, blank=True, default='')
    admins = models.ManyToManyField(settings.AUTH_USER_MODEL)


# class Tag(models.Model):
    # tag = models.SlugField()

@python_2_unicode_compatible
class Page(models.Model):
    site = models.ForeignKey(Site)
    title = models.CharField(
        max_length=100,
        verbose_name=_('Title'))
    intro = models.TextField(
        verbose_name=_('Intro'))
    image = models.ForeignKey(
        imagearchivemodels.ArchiveImage,
        verbose_name=_('Image'),
        null=True, blank=True)
    body = models.TextField(
        verbose_name=_('Body'))
    # tags = models.ManyToManyField(Tag)

    def __str__(self):
        return self.title

    class Meta(object):
        verbose_name = _('Page')
        verbose_name_plural = _('Pages')
        ordering = ('title', 'intro')
