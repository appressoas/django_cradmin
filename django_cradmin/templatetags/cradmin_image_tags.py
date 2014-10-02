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
