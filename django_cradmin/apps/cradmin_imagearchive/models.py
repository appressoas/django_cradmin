import os
from django.conf import settings
from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.generic import GenericForeignKey
from django.utils.translation import ugettext_lazy as _


def archiveimage_upload_to(archiveimage, filename):
    if archiveimage.id is None:
        raise ValueError('Can not set image until after the ArchiveImage object has been created.')
    name, extension = os.path.splitext(filename)
    filenamepattern = getattr(settings, 'DJANGO_CRADMIN_IMAGEARCHIVE_FILENAMEPATTERN',
                              'cradmin_imagearchive_images/{id}{extension}')
    return filenamepattern.format(
        id=archiveimage.id,
        extension=extension)


class ArchiveImage(models.Model):
    content_type = models.ForeignKey(
        ContentType,
        verbose_name=_('role'),
        help_text=_('The role owning this image.'))
    object_id = models.PositiveIntegerField()
    role = GenericForeignKey('content_type', 'object_id')

    #: The image.
    image = models.ImageField(
        max_length=255, null=True, blank=False,
        height_field='image_height',
        width_field='image_width',
        verbose_name=_('image'),
        upload_to=archiveimage_upload_to)

    #: The height of the :obj:`.image`. Autopopulated by the :obj:`.image` field.
    image_height = models.IntegerField(null=True, blank=True, editable=False)

    #: The width of the :obj:`.image`. Autopopulated by the :obj:`.image` field.
    image_width = models.IntegerField(null=True, blank=True, editable=False)

    #: The file extension
    file_extension = models.CharField(
        max_length=255, blank=False, null=False, editable=False)

    #: The name of the image file.
    name = models.CharField(
        max_length=255, blank=False, null=False,
        verbose_name=_('name'),
    )

    #: An optional description of the image.
    description = models.TextField(
        blank=True, null=False, default='',
        verbose_name=_('description'),
        help_text=_(
            'An optional description of the image. Think if this as a description '
            'of the image for visually impaired users. This means that you should describe '
            'the information carried in the image (if any).'),
    )

    class Meta:
        verbose_name = _('archive image')
        verbose_name_plural = _('archive images')

    def clean(self):
        self.file_extension = os.path.splitext(self.image.name)[1]
