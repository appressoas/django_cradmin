from __future__ import unicode_literals
from django.template import Library
from django_cradmin import imageutils
import logging
from django_cradmin.imageutils.backends.backendinterface import ImageTypeMapSettingNotDefined, InvalidImageType

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
    Tag wrapper around
    :meth:`~django_cradmin.imageutils.backends.backendinterface.Interface.transform_image`.

    Parameters:

        imageurl: The URL of the image to transform.
        options: Image transformation options.
    """
    if 'options' in options:
        options = options['options']
    return imageutils.get_backend().transform_image(imageurl, **options)


@register.simple_tag()
def cradmin_transform_image_using_imagetype(imageurl, imagetype, fallbackoptions=None):
    """
    Tag wrapper around
    :meth:`~django_cradmin.imageutils.backends.backendinterface.Interface.transform_image_using_imagetype`.

    Parameters:

        imageurl: The URL of the image to transform.
        imagetype: See
            :meth:`~django_cradmin.imageutils.backends.backendinterface.Interface.transform_image_using_imagetype`.
        fallbackoptions: An optional dict of options to use if ``imagetype``
            is not in the :setting:`DJANGO_CRADMIN_IMAGEUTILS_IMAGETYPE_MAP` setting.
    """
    try:
        return imageutils.get_backend().transform_image_using_imagetype(imageurl, imagetype)
    except (ImageTypeMapSettingNotDefined, InvalidImageType):
        if fallbackoptions:
            return imageutils.get_backend().transform_image(imageurl, **fallbackoptions)
        else:
            raise


@register.inclusion_tag('django_cradmin/imageutils/templatetags/archiveimage-tag.django.html')
def cradmin_create_archiveimage_tag(archiveimage, imagetype, css_class='', fallbackoptions=None):
    """
    Creates an ``<img>`` tag from the given cradmin archiveimage.

    The URL is generated using
    :meth:`.cradmin_transform_image_using_imagetype`.

    The alt-tag is generated from ``archiveimage.screenreader_text``.
    """
    return {
        'archiveimage': archiveimage,
        'url': cradmin_transform_image_using_imagetype(
            imageurl=archiveimage.image.url,
            imagetype=imagetype,
            fallbackoptions=fallbackoptions),
        'css_class': css_class,
    }
