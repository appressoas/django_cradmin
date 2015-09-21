from __future__ import unicode_literals
from django.template import Library
from django_cradmin import imageutils
import logging


register = Library()
logger = logging.getLogger(__name__)


# @register.simple_tag
# def cradmin_thumbnail(*args, **kwargs):
#     """
#     Template tag that forwards all arguments to
#     :meth:`django_cradmin.imageutils.request_thumbnail`.
#     """
#     try:
#         return imageutils.request_thumbnail(*args, **kwargs).url
#     except:
#         logger.exception('cradmin_thumbnail failed. args=%r, kwargs=%r', args, kwargs)
#         return ''
#
#
# @register.simple_tag
# def cradmin_archiveimage_thumbnail(archiveimage, **kwargs):
#     """
#     Template tag that creates a thumbnail for the given
#     :class:`django_cradmin.apps.cradmin_imagearchive.models.ArchiveImage`.
#
#     Parameters:
#         archiveimage: An ArchiveImage object.
#         kwargs: Same as for :meth:`django_cradmin.imageutils.request_thumbnail`.
#     """
#     image = archiveimage.image
#     try:
#         return imageutils.request_thumbnail(image, **kwargs).url
#     except:
#         logger.exception('cradmin_thumbnail failed. archiveimage=%r, kwargs=%r', archiveimage, kwargs)
#         return ''

@register.simple_tag()
def cradmin_transform_image(imageurl, **options):
    """
    Tag wrapper around ``django_cradmin.imageutils.get_backend().transform_image(...)``.
    """
    return imageutils.get_backend().transform_image(imageurl, **options)[0]


@register.simple_tag()
def cradmin_transform_image_using_imagetype(imageurl, imagetype):
    """
    Tag wrapper around
    ``django_cradmin.imageutils.get_backend().transform_image_using_imagetype(...)``.
    """
    return imageutils.get_backend().transform_image_using_imagetype(imageurl, imagetype)[0]


@register.inclusion_tag('django_cradmin/imageutils/templatetags/archiveimage-tag.django.html')
def cradmin_create_archiveimage_tag(archiveimage, imagetype, css_class=''):
    """
    Creates an ``<img>`` tag from the given cradmin archiveimage.

    The URL is generated using
    ``django_cradmin.imageutils.get_backend().transform_image_using_imagetype(...)``.

    The alt-tag is generated from ``archiveimage.screenreader_text``.
    """
    return {
        'archiveimage': archiveimage,
        'url': imageutils.get_backend().transform_image_using_imagetype(
            archiveimage.image.url, imagetype)[0],
        'css_class': css_class,
    }
