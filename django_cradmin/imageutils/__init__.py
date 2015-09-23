from __future__ import unicode_literals
from django.conf import settings
from django.utils.module_loading import import_string


_backend = None


def get_backend():
    """
    Get the configured imageutils backend, defaulting to and object of
    class:`django_cradmin.imageutils.backends.sorl_thumbnail.SorlThumbnail`
    if the :setting:`DJANGO_CRADMIN_IMAGEUTILS_BACKEND` setting is not defined.
    """
    global _backend
    if not _backend:
        backendclasspath = getattr(settings, 'DJANGO_CRADMIN_IMAGEUTILS_BACKEND',
                                   'django_cradmin.imageutils.backends.sorl_thumbnail.SorlThumbnail')
        _backend = import_string(backendclasspath)()
    return _backend
