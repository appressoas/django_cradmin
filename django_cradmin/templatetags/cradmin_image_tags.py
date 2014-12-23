from django.template import Library
from django_cradmin import imageutils
import logging


register = Library()
logger = logging.getLogger(__name__)


@register.simple_tag
def cradmin_thumbnail(*args, **kwargs):
    """
    Template tag that forwards all arguments to
    :meth:`django_cradmin.imageutils.request_thumbnail`.
    """
    try:
        return imageutils.request_thumbnail(*args, **kwargs).url
    except:
        logger.exception('cradmin_thumbnail failed. args=%r, kwargs=%r', args, kwargs)
        return ''


@register.simple_tag
def cradmin_archiveimage_thumbnail(archiveimage, **kwargs):
    """
    Template tag that creates a thumbnail for the given
    :class:`django_cradmin.apps.cradmin_imagearchive.models.ArchiveImage`.

    Parameters:
        archiveimage: An ArchiveImage object.
        kwargs: Same as for :meth:`django_cradmin.imageutils.request_thumbnail`.
    """
    image = archiveimage.image
    try:
        return imageutils.request_thumbnail(image, **kwargs).url
    except:
        logger.exception('cradmin_thumbnail failed. archiveimage=%r, kwargs=%r', archiveimage, kwargs)
        return ''
