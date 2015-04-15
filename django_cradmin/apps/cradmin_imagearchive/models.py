from __future__ import unicode_literals
from builtins import object
import os
import posixpath
from django.conf import settings
from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.generic import GenericForeignKey
from django.template.loader import render_to_string
from django.utils.translation import ugettext_lazy as _
from future.utils import python_2_unicode_compatible


def archiveimage_upload_to(archiveimage, filename):
    if archiveimage.id is None:
        raise ValueError('Can not set image until after the ArchiveImage object has been created.')
    name, extension = os.path.splitext(filename)
    filenamepattern = getattr(settings, 'DJANGO_CRADMIN_IMAGEARCHIVE_FILENAMEPATTERN',
                              'cradmin_imagearchive_images/{id}{extension}')
    return filenamepattern.format(
        id=archiveimage.id,
        extension=extension)


class ArchiveImageManager(models.Manager):
    def filter_owned_by_role(self, role):
        return self.get_queryset().filter(
            role_object_id=role.id,
            role_content_type=ContentType.objects.get_for_model(role.__class__))


@python_2_unicode_compatible
class ArchiveImage(models.Model):
    objects = ArchiveImageManager()

    role_content_type = models.ForeignKey(
        ContentType,
        verbose_name=_('role'),
        help_text=_('The role owning this image.'))
    role_object_id = models.PositiveIntegerField()
    role = GenericForeignKey('role_content_type', 'role_object_id')

    #: The image.
    image = models.ImageField(
        max_length=255, null=True, blank=False,
        height_field='image_height',
        width_field='image_width',
        verbose_name=_('image'),
        help_text=_('Select an image to add to the archive.'),
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
        max_length=255, blank=True, null=False,
        verbose_name=_('name'),
        help_text=_(
            'Give the image a name (optional). If you leave this blank, the name of the uploaded image file is used.'
        )
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

    #: Create datetime.
    created_datetime = models.DateTimeField(
        editable=False,
        auto_now_add=True
    )

    class Meta(object):
        verbose_name = _('archive image')
        verbose_name_plural = _('archive images')

    def clean(self):
        if not self.name:
            if self.image:
                self.name = os.path.splitext(posixpath.basename(self.image.name))[0]
        if self.name:
            self.file_extension = os.path.splitext(self.name)[1]

    def __str__(self):
        return self.name

    def __repr__(self):
        return 'ArchiveImage(name={name}, image_width={image_width}, image_height={image_height})'.format(
            name=self.name.encode('ascii', 'replace'),
            image_width=self.image_width,
            image_height=self.image_height)

    def get_preview_html(self):
        return render_to_string('django_cradmin/apps/cradmin_imagearchive/preview.django.html', {
            'archiveimage': self
        })


class ArchiveImageVariant(ArchiveImage):
    """
    An :class:`ArchiveImage` is the originally uploaded raw image, while an
    ArchiveImageVariant is an edit of the image.

    When you create foreign keys to ArchiveImage, you will typically want to create
    an ArchiveImageVariant if you want to allow your users to edit the original
    image (crop, apply filters, etc.).
    """
    archiveimage = models.ForeignKey(ArchiveImage, related_name='archiveimagevariant_set')

    #: The X coordinate to start the crop at. Defaults to 0.
    crop_x = models.PositiveIntegerField(default=0)

    #: The Y coordinate to start the crop at. Defaults to 0.
    crop_y = models.PositiveIntegerField(default=0)

    #: The width to crop the image to. Defaults to None (which means use the width of the original image).
    crop_width = models.PositiveIntegerField()

    #: The height to crop the image to. Defaults to None (which means use the height of the original image).
    crop_height = models.PositiveIntegerField()
