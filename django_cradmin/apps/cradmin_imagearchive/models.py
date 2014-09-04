from django.conf import settings
from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.generic import GenericForeignKey
from django.utils.translation import ugettext_lazy as _


def archiveimage_upload_to(archiveimage, filename):
    filenamepattern = getattr(settings, 'DJANGO_CRADMIN_IMAGEARCHIVE_FILENAMEPATTERN',
                              'cradmin_imagearchive_images/{id}.{extension}')
    return filenamepattern.format(
        id=archiveimage.id,
        extension=archiveimage.file_extension)


class ArchiveImage(models.Model):
    role = models.ForeignKey(
        ContentType,
        verbose_name=_('role'),
        help_text=_('The role owning this image.'))
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    #: The image.
    image = models.ImageField(
        max_length=255, null=True, blank=False,
        height_field='logo_height',
        width_field='logo_width',
        verbose_name=_('logo'),
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
        help_text=_(
            'You can give the image a name. This is mostly useful for '
            'yourself and other administrators.'),
    )

    #: An optional description of the image.
    description = models.TextField(
        blank=False, null=False,
        verbose_name=_('description'),
        help_text=_(
            'An optional description of the image. Think if this as a description '
            'of the image for visually impaired users. This means that you should describe '
            'the information carried in the image (if any).'),
    )


    class Meta:
        verbose_name = _('archive image')
        verbose_name_plural = _('archive images')
