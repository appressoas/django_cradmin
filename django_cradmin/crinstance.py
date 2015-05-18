from __future__ import unicode_literals
from builtins import object
from django.contrib.auth.decorators import login_required
from django.conf.urls import patterns, url, include
from django.shortcuts import render
from django.core.urlresolvers import reverse
from django.utils.html import format_html

from .registry import cradmin_instance_registry
from . import crapp
from .views import roleselect


def reverse_cradmin_url(instanceid, appname, roleid,
                        viewname=crapp.INDEXVIEW_NAME,
                        args=None, kwargs=None):
    """
    Reverse an URL within a cradmin instance.

    Usage is very similar to :func:`django.core.urlresolvers.reverse`,
    but you specify the cradmin instance, appname, roleid and viewname
    instead of the url-name

    Examples::

        myapp_index_url = reverse_cradmin_url(
            instanceid='siteadmin',
            appname='myapp',
            roleid=site.id)

        myapp_add_url = reverse_cradmin_url(
            instanceid='siteadmin',
            appname='myapp',
            roleid=site.id,
            viewname='add')
    """
    if args:
        args = [roleid] + list(args)
    else:
        if not kwargs:
            kwargs = {}
        kwargs['roleid'] = roleid

    urlname = u'{}-{}-{}'.format(instanceid, appname, viewname)
    return reverse(urlname, args=args, kwargs=kwargs)


class BaseCrAdminInstance(object):
    """
    Base class for a django_cradmin instance.

    You define a subclass of this to setup a django_cradmin instance.

    Attributes:
        request (HttpRequest): The current HttpRequest.
    """
    #: The ID of the cradmin instance. Must be unique for the Django
    #: instance/site. Must be a string.
    #: This is typically a short readable slug that describes what
    #: the cradmin instance does.
    #: You do not need to specify this except you need to communicate/link
    #: between cradmin instances.
    id = None

    #: The regex for matching the role id.
    #: Defaults to ``\d+``.
    roleid_regex = r'\d+'

    #: The menu class for this cradmin instance.
    menuclass = None

    #: The class defining the role for this cradmin instance.
    roleclass = None

    #: The name of the app that the user should be redirected to
    #: after selecting a role. Subclasses MUST eighter specify
    #: this or override :meth:`rolefrontpage_url`.
    rolefrontpage_appname = None

    #: Apps within the instance.
    #: Iterable of ``(appname, appclass)`` tuples where ``appname``
    #: is a slug for the app and ``appclass`` is a subclass of
    #: :class:`django_cradmin.crapp.App`.
    #: Can also be specified by overriding :meth:`.get_apps`.
    apps = []

    def __init__(self, request):
        """
        Parameters:
            request (HttpRequest): The current HttpRequest.
                Stored in :attr:`.request`.
        """
        self.request = request

    def get_rolequeryset(self):
        """
        Get the roles for the authenticated user.

        You get the authenticated user from ``self.request.user``.
        """
        raise NotImplementedError()

    def get_titletext_for_role(self, role):
        """
        Get a short title briefly describing the given ``role``.
        """
        raise NotImplementedError()

    def get_descriptiontext_for_role(self, role):
        """
        Get a longer description for the given ``role``.

        This is never used directly on its own - it is just the default text
        used by :meth:`.get_descriptionhtml_for_role`. If you want
        HTML in your description, override :meth:`.get_descriptionhtml_for_role`
        instead.
        """
        return None

    def get_descriptionhtml_for_role(self, role):
        """
        Get a longer description for the given ``role``.
        This is always shown after/below :meth:`.get_titletext_for_role`.

        Defaults to :meth:`.get_descriptiontext_for_role` filtered to
        make it HTML safe and wrapped in a paragraph tag.
        """
        descriptiontext = self.get_descriptiontext_for_role(role)
        if descriptiontext:
            return format_html(u'<p>{}</p>', descriptiontext)
        else:
            return ''

    def get_roleid(self, role):
        """
        Get the ID for the given ``role``.
        """
        return role.pk

    def get_role_from_roleid(self, roleid):
        """
        Get the role for the given ``roleid``.

        Defaults to looking up a :obj:`roleclass` object where
        ``pk==roleid``.

        Returns:
            A role object or ``None``.
        """
        try:
            return self.roleclass.objects.get(pk=roleid)
        except self.roleclass.DoesNotExist:
            pass
        return None

    def invalid_roleid_response(self, roleid):
        """
        This is called whenever someone requests a role slug that does not exist
        (if :meth:.`get_role_from_roleid`) returns ``None``.

        Returns:
            django.http.HttpResponse: Defaults to rendering
                ``django_cradmin/invalid_roleid.django.html``.
        """
        return render(self.request, 'django_cradmin/invalid_roleid.django.html', {
            'roleid': roleid
        })

    def get_role_from_rolequeryset(self, role):
        """
        Returns the given role extracted via the :meth:`.get_rolequeryset`
        queryset.

        Raises ObjectDoesNotExist if the role is not found in the queryset.
        """
        return self.get_rolequeryset().get(pk=role.pk)

    def missing_role_response(self, role):
        """
        This is called whenever someone requests a role that exists but that
        they do not have (where meth:`.get_role_from_rolequeryset` raises ``DoesNotExist``).

        Returns:
            django.http.HttpResponse: Defaults to rendering
                ``django_cradmin/missing_role.django.html``
        """
        return render(self.request, 'django_cradmin/missing_role.django.html', {
            'role': role
        })

    def _get_menu(self):
        if not hasattr(self, '_menu'):
            menuclass = self.menuclass
            self._menu = menuclass(self)
        return self._menu

    def get_menu(self):
        """
        Get the navigation menu for the authenticated user.

        Parameters:
            user (Django User): The user requesting the menu.

        Returns:
            An instance of :obj:`.menuclass` by default, but you can
            override this method to determine/create the menu dynamically.

        See Also:
            :class:`django_cradmin.menu.BaseCrAdminMenu`.
        """
        return self._get_menu()

    def reverse_url(self, appname, viewname, args=None, kwargs=None, roleid=None):
        """
        Reverse an URL within this cradmin instance.

        The advantage over using :func:`django.core.urlresolvers.reverse`
        is that you do not need to hardcode the id of the cradmin instance,
        and that the ``roleid`` is automatically added to args or kwargs
        (depending on which one you use to pass arguments to the url).
        """
        if roleid is None:
            roleid = self.get_roleid(self.request.cradmin_role)
        return reverse_cradmin_url(
            instanceid=self.id,
            appname=appname, viewname=viewname, roleid=roleid,
            args=args, kwargs=kwargs)

    def appindex_url(self, appname, roleid=None):
        """
        Reverse the url of the landing page for the given app.

        The landing page is the view named :obj:`django_cradmin.crapp.INDEXVIEW_NAME`.
        """
        return self.reverse_url(appname, viewname=crapp.INDEXVIEW_NAME, roleid=roleid)

    def rolefrontpage_url(self, roleid=None):
        """
        Returns the URL that the user should be redirected to
        after selecting a role.
        """
        if roleid is None:
            roleid = self.get_roleid(self.request.cradmin_role)
        return self.appindex_url(self.rolefrontpage_appname, roleid=roleid)

    def roleselectview_url(self):
        """
        Return the URL of the roleselect view.

        See:
            :meth:`.get_roleselect_view`.
        """
        return reverse('{}-roleselect'.format(self.id))

    @classmethod
    def get_roleselect_view(cls):
        """
        The view for selecting role.

        Defaults to::

            from django_cradmin.views import roleselect
            from django.contrib.auth.decorators import login_required
            return login_required(roleselect.RoleSelectView.as_view())

        If you want to provide your own role select view, you can simply implement
        it here. Another option is to extend RoleSelectView and override the ``template_name``.

        Note:

            The name of the URL for this view is ``<cradmin instance id>-roleselect``,
            where ``<cradmin instance id>`` is :obj:`.id`. You can reverse the URL of
            this view with :meth:`.roleselectview_url`.
        """
        return login_required(roleselect.RoleSelectView.as_view())

    @classmethod
    def matches_urlpath(cls, urlpath):
        """
        If you have more than one BaseCrAdminInstance in a single Django
        instance, you have to implement this classmethod on each of the
        instances to be able to lookup/detect the _current_ BaseCrAdminInstance.

        Parameters:
            urlpath: The url path (HttpRequest.path) to match against.

        Returns:
            ``True`` if the given urlpath is for a view within this CrAdmin instance.
        """
        raise NotImplementedError()

    @classmethod
    def get_apps(cls):
        """
        See :obj:`.apps`. Defaults to returning :obj:`.apps`, but can be overridden.
        """
        return cls.apps

    @classmethod
    def _get_app_urls(cls):
        urls = []
        for appname, appclass in cls.get_apps():
            appurlpatterns = appclass.build_urls(cls.id, appname)
            urls.append(url(r'^(?P<roleid>{})/{}/'.format(
                cls.roleid_regex, appname),
                include(appurlpatterns)))
        return urls

    @classmethod
    def urls(cls):
        """
        Get the url patterns for the cradmin instance.
        """
        cradmin_instance_registry.add(cls)
        return patterns(
            '',
            url('^$', cls.get_roleselect_view(),
                name='{}-roleselect'.format(cls.id)),
            *cls._get_app_urls())
