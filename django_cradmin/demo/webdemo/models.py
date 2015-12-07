from __future__ import unicode_literals
from builtins import object

from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from future.utils import python_2_unicode_compatible

from django_cradmin.apps.cradmin_imagearchive import models as imagearchivemodels


@python_2_unicode_compatible
class Site(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(
        null=False, blank=True, default='')
    admins = models.ManyToManyField(settings.AUTH_USER_MODEL)

    def __str__(self):
        return self.name


@python_2_unicode_compatible
class Page(models.Model):
    site = models.ForeignKey(Site)
    title = models.CharField(
        max_length=100,
        verbose_name=_('Title'))
    intro = models.TextField(
        verbose_name=_('Intro'),
        help_text=_('A short introduction.'))
    image = models.ForeignKey(
        imagearchivemodels.ArchiveImage,
        verbose_name=_('Image'),
        null=True, blank=True)
    attachment = models.FileField(
        verbose_name=_('Attachment'),
        null=True, blank=True)
    body = models.TextField(
        verbose_name=_('Body'))
    publishing_time = models.DateTimeField(
        verbose_name=_('Publishing time'),
        default=timezone.now,
        blank=False, null=False,
        help_text=_('The time when this will be visible on the website.'))
    unpublish_time = models.DateTimeField(
        verbose_name=_('Unpublish time'),
        default=None,
        blank=True, null=True,
        help_text=_('Hide the item on the website after this time.'))
    internal_notes = models.TextField(
        verbose_name=_('Internal notes'),
        help_text=_('Put internal notes here. Will not be visible on the website.'),
        blank=True, null=False, default='')
    subscribers = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        verbose_name=_('Subscribed users'))

    def __str__(self):
        return self.title

    class Meta(object):
        verbose_name = _('Page')
        verbose_name_plural = _('Pages')
        ordering = ('title', 'intro')


@python_2_unicode_compatible
class PageTag(models.Model):
    page = models.ForeignKey(Page, related_name='tags')
    tag = models.SlugField()

    def __str__(self):
        return self.tag
