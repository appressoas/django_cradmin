import time

from django.conf import settings


class DelayMiddleware(object):
    """
    To use this, you must add the following to your settings:

    - Add ``django_cradmin.delay_middleware.DelayMiddleware`` to ``MIDDLEWARE_CLASSES``.
    - Set ``DJANGO_CRADMIN_DELAY_MIDDLEWARE_MILLISECONDS`` to the number of milliseconds
      delay you want to add to all requests (I.E.: 2000 for 2 seconds).
    """
    def process_request(self, request):
        time.sleep(settings.DJANGO_CRADMIN_DELAY_MIDDLEWARE_MILLISECONDS / 1000.0)
        return None
