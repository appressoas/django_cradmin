from __future__ import unicode_literals
from builtins import object
from django.conf.urls import url
from django.conf.urls import patterns
from functools import update_wrapper

from .decorators import cradminview, has_access_to_cradmin_instance


#: The name of the app index view (the landing page for the app).
#: We do not enforce this, but we assume that each app has a
#: view with this name.
INDEXVIEW_NAME = 'INDEX'


class Url(object):
    """
    Url is mostly the same as func:`django.conf.urls.url`.
    You use Url to add urls to an app.
    """
    def __init__(self, regex, view, kwargs=None, name=None):
        self.regex = regex
        self.view = view
        self.kwargs = kwargs
        self.name = name


class App(object):
    appurls = []

    def __init__(self, appname, request):
        self.appname = appname
        self.request = request

    def reverse_appurl(self, viewname, args=None, kwargs=None):
        """
        Works just like :func:`django.core.urlresolvers.reverse`, except
        that the name is the name given in :obj:`.appurls`, not the full
        name of the URL.

        This means that you should use this to reverse urls within this app.
        """
        return self.request.cradmin_instance.reverse_url(
            appname=self.appname, viewname=viewname,
            args=args, kwargs=kwargs)

    def reverse_appindexurl(self, args=None, kwargs=None):
        """
        Shortcut for::

            reverse_appurl(crapp.INDEXVIEW_NAME, args=args, kwargs=kwargs)
        """
        return self.reverse_appurl(viewname=INDEXVIEW_NAME, args=args, kwargs=kwargs)

    @classmethod
    def _wrap_view(cls, appname, view):
        def viewwrapper(request, *args, **kwargs):
            request.cradmin_app = cls(appname, request)
            return has_access_to_cradmin_instance(cradminview(view))(request, *args, **kwargs)

        # Take name and docstring from view
        update_wrapper(viewwrapper, view, updated=())

        return viewwrapper

    @classmethod
    def build_urls(cls, cradmin_instance_id, appname):
        """
        Used internally by :meth:`django_cradmin.crinstance.BaseCrAdminInstance.urls`
        to build urls for all views in the app.
        """
        urls = []
        for pattern in cls.appurls:
            urls.append(
                url(
                    pattern.regex, cls._wrap_view(appname, pattern.view),
                    name='{}-{}-{}'.format(cradmin_instance_id, appname, pattern.name),
                    kwargs=pattern.kwargs))
        return patterns('', *urls)
