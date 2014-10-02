from django.template import Library
from django_cradmin import imageutils

register = Library()


@register.simple_tag
def cradmin_thumbnail(*args, **kwargs):
    """
    Template tag that forwards all arguments to
    :meth:`django_cradmin.imageutils.request_thumbnail`.
    """
    return imageutils.request_thumbnail(*args, **kwargs).url
