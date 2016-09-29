from __future__ import unicode_literals

from builtins import object

from django.conf import settings
from django.conf.urls import url, include
from django.core.urlresolvers import reverse
from django.shortcuts import render
from django.utils.html import format_html
from django.views import View
from django_cradmin import crheader
from django_cradmin import crmenu
from django_cradmin.decorators import has_access_to_cradmin_instance

from . import crapp
from .registry import cradmin_instance_registry
from .views import roleselect


def reverse_cradmin_url(instanceid, appname=None, roleid=None,
                        viewname=crapp.INDEXVIEW_NAME,
                        args=None, kwargs=None):
    """
    Reverse an URL within a cradmin instance.

    Usage is very similar to :func:`django.core.urlresolvers.reverse`,
    but you specify the cradmin instance, appname, roleid and viewname
    instead of the url-name

    Examples:

        Reverse the frontpage on an app::

            myapp_index_url = reverse_cradmin_url(
                instanceid='siteadmin',
                appname='myapp',
                roleid=site.id)

        Reverse a specific view within an app::

            myapp_add_url = reverse_cradmin_url(
                instanceid='siteadmin',
                appname='myapp',
                roleid=site.id,
                viewname='add')
    """
    if appname:
        if roleid:
            if args:
                args = [roleid] + list(args)
            else:
                if not kwargs:
                    kwargs = {}
                kwargs['roleid'] = roleid
        urlname = u'{}-{}-{}'.format(instanceid, appname, viewname)
    else:
        urlname = instanceid
    return reverse(urlname, args=args, kwargs=kwargs)


class FakeRoleFrontpageView(View):
    def dispatch(self, request, *args, **kwargs):
        raise Exception('This is just a fake view - it should not be possible to access. '
                        'The most common reason for this error is that you have configured '
                        'the BaseCrAdminInstance with flatten_rolefrontpage_url, and not '
                        'provided a URL at the root of the the rolefrontpage_appname '
                        'crapp.App.')


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

    #: The renderable class for the main menu.
    #: See :meth:`.get_main_menu_renderable`.
    main_menu_renderable_class = crmenu.DefaultMainMenuRenderable

    #: The renderable class for the expandable menu
    #: (the menu that is toggled by a button in the main menu).
    #: See :meth:`.get_expandable_menu_renderable`.
    expandable_menu_renderable_class = crmenu.DefaultExpandableMenuRenderable

    #: The header class for this cradmin instance.
    #: Must be a subclass of :class:`django_cradmin.crheader.AbstractHeaderRenderable`.
    header_renderable_class = crheader.DefaultHeaderRenderable

    #: The footer class for this cradmin instance.
    #: Must be a subclass of :class:`django_cradmin.crfooter.AbstractFooter`.
    footer_renderable_class = None

    #: The class defining the role for this cradmin instance.
    #: If you do not set this, the role system will not be used,
    #: which means that you will not get a value in ``request.cradmin_role``.
    roleclass = None

    #: The name of the app that the user should be redirected to
    #: after selecting a role. Subclasses MUST eighter specify
    #: this or override :meth:`rolefrontpage_url`.
    rolefrontpage_appname = None

    #: If this is ``True``, we do not prefix the urls of the
    #: :obj:`~BaseCrAdminInstance.rolefrontpage_appname` with the
    #: appname. This means that it is hosted on ``/baseurl/<roleid>/``
    #: instead of ``/baseurl/<roleid>/<appname>/``.
    #:
    #: If you couple this with setting :obj:`~.BaseCrAdminInstance.roleclass`
    #: to ``None``, the frontpage will be hosted directly on ``/baseurl/``.
    #:
    #: If you set this to ``True``, you have to be ensure that the urls of any views
    #: within the rolefrontpage app does crash any urls in any of the other apps.
    flatten_rolefrontpage_url = False

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

    def get_cradmin_theme_path(self):
        """
        Return a path to a theme in the same format as :setting:`DJANGO_CRADMIN_THEME_PATH`,
        to use a custom theme for this instance.
        """
        return None

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

    def get_menu_item_renderables(self):
        return []

    def get_expandable_menu_item_renderables(self):
        return self.get_menu_item_renderables()

    def get_main_menu_item_renderables(self):
        return self.get_menu_item_renderables()

    def get_main_menu_renderable(self):
        """
        Get the main menu renderable instance.

        Defaults to a instance of the class specified in
        :obj:`~.BaseCrAdminInstance.main_menu_renderable_class`.

        Returns:
            django_cradmin.crmenu.AbstractMenuRenderable: An AbstractMenuRenderable object.
        """
        menu_renderable = self.main_menu_renderable_class(cradmin_instance=self)
        menu_renderable.extend(self.get_main_menu_item_renderables())
        return menu_renderable

    @property
    def main_menu_renderable(self):
        if not hasattr(self, '_main_menu_renderable_cached'):
            self._main_menu_renderable_cached = self.get_main_menu_renderable()
        return self._main_menu_renderable_cached

    def get_expandable_menu_renderable(self):
        """
        Get the expandable menu renderable instance. This is the menu
        that is expanded by a button which by default is in the main
        menu.

        Defaults to a instance of the class specified in
        :obj:`~.BaseCrAdminInstance.expandable_menu_renderable_class`.

        Returns:
            django_cradmin.crmenu.AbstractMenuRenderable: An AbstractMenuRenderable object.
        """
        menu_renderable = self.expandable_menu_renderable_class(cradmin_instance=self)
        menu_renderable.extend(self.get_expandable_menu_item_renderables())
        return menu_renderable

    @property
    def expandable_menu_renderable(self):
        if not hasattr(self, '_expandable_menu_renderable_cached'):
            self._expandable_menu_renderable_cached = self.get_expandable_menu_renderable()
        return self._expandable_menu_renderable_cached

    def get_header_renderable(self):
        """
        Get the header renderable for this cradmin instance.

        Defaults to a instance of the class specified in
        :obj:`~.BaseCrAdminInstance.header_renderable_class`.

        Returns:
            django_cradmin.crheader.AbstractHeaderRenderable: An AbstractHeaderRenderable object.

        See Also:
            :class:`django_cradmin.crheader.AbstractHeaderRenderable`.
        """
        return self.header_renderable_class(cradmin_instance=self)

    def get_footer_renderable(self):
        """
        Get the footer renderable for this cradmin instance.

        Defaults to a instance of the class specified in
        :obj:`~.BaseCrAdminInstance.footer_renderable_class`.

        Returns:
            django_cradmin.crfooter.AbstractHeaderRenderable: An AbstractHeaderRenderable object.

        See Also:
            :class:`django_cradmin.crfooter.AbstractHeaderRenderable`.
        """
        if self.footer_renderable_class:
            return self.footer_renderable_class(cradmin_instance=self)
        else:
            return None

    def reverse_url(self, appname, viewname, args=None, kwargs=None, roleid=None):
        """
        Reverse an URL within this cradmin instance.

        The advantage over using :func:`django.core.urlresolvers.reverse`
        is that you do not need to hardcode the id of the cradmin instance,
        and that the ``roleid`` is automatically added to args or kwargs
        (depending on which one you use to pass arguments to the url).

        Args:
            appname (str): The name of the app.
            viewname (str): The name of the view within the app.
            args (list): Args for the view
            kwargs (dict): Keyword args for the view.
            roleid: The roleid.
        """
        kwargs = {
            'instanceid': self.id,
            'appname': appname,
            'viewname': viewname,
            'args': args,
            'kwargs': kwargs
        }
        if self.roleclass:
            if roleid is None:
                roleid = self.get_roleid(self.request.cradmin_role)
            kwargs['roleid'] = roleid
        return reverse_cradmin_url(**kwargs)

    def appindex_url(self, appname, args=None, kwargs=None, roleid=None):
        """
        Reverse the url of the landing page for the given app.

        The landing page is the view named :obj:`django_cradmin.crapp.INDEXVIEW_NAME`.

        This would be the same as using :meth:`.reverse_url` with ``viewname=crapp.INDEXVIEW_NAME``.

        Args:
            appname (str): The name of the app.
            args (list): Args for the view
            kwargs (dict): Keyword args for the view.
            roleid: The roleid.
        """
        return self.reverse_url(appname, viewname=crapp.INDEXVIEW_NAME, roleid=roleid,
                                args=args, kwargs=kwargs)

    def rolefrontpage_url(self, roleid=None):
        """
        Returns the URL that the user should be redirected to
        after selecting a role.
        """
        if self.roleclass:
            if roleid is None:
                roleid = self.get_roleid(self.request.cradmin_role)
        return self.appindex_url(self.rolefrontpage_appname, roleid=roleid)

    def get_instance_frontpage_url(self):
        """
        Return the URL of the instance frontpage view.

        See:
            :meth:`.get_instance_frontpage_url`.
        """
        if self.__class__.__no_role_and_flatten_rolefrontpage_url():
            return self.rolefrontpage_url()
        else:
            return reverse('{}-frontpage'.format(self.id))

    def roleselectview_url(self):
        """
        Deprecated, use :meth:`.get_instance_frontpage_url` instead.
        """
        return self.get_instance_frontpage_url()

    def get_common_http_headers(self):
        """
        Override this to set common HTTP headers for all views in the instance.

        Returns:
            A mapping object mapping HTTP header name to value. Returns
            empty dict by default.
        """
        return {}

    def has_access(self):
        """
        Check if the given user has access to this cradmin instance.

        Defaults to ``self.request.user.is_authenticated()``, but you
        can override this.
        """
        return self.request.user.is_authenticated()

    def get_foreignkeyselectview_url(self, model_class):
        """
        Get foreign key select view URL for the given model class.

        This can be used by foreign key select widgets to lookup a view
        for this model within the current instance.

        By default this returns ``None``, so you have to override this
        if you want to use it.

        Parameters:
            model_class: A ``django.db.models.Model`` subclass.
        """
        return None

    def get_manytomanyselectview_url(self, model_class):
        """
        Get many-to-many select view URL for the given model class.

        This can be used by many-to-many widgets,
        like :class:`django_cradmin.widgets.modelmultichoice.ModelMultiChoiceWidget`,
        to lookup a view for this model within the current instance.

        By default this returns ``None``, so you have to override this
        if you want to use it.

        Parameters:
            model_class: A ``django.db.models.Model`` subclass.
        """
        return None

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
            this view with :meth:`.get_instance_frontpage_url`.
        """
        return has_access_to_cradmin_instance(cls.id, roleselect.RoleSelectView.as_view())

    @classmethod
    def get_instance_frontpage_view(cls):
        if cls.roleclass:
            return cls.get_roleselect_view()
        else:
            raise NotImplementedError('When you do not define a roleclass, you have '
                                      'to override get_instance_frontpage_view()')

    @classmethod
    def get_apps(cls):
        """
        See :obj:`.apps`. Defaults to returning :obj:`.apps`, but can be overridden.
        """
        return cls.apps

    @classmethod
    def get_app_url(cls, appname, appclass):
        appurlpatterns = appclass.build_urls(cls.id, appname)
        flatten = cls.rolefrontpage_appname == appname and cls.flatten_rolefrontpage_url
        if cls.roleclass:
            if flatten:
                return url(r'^(?P<roleid>{})/'.format(cls.roleid_regex),
                           include(appurlpatterns))
            else:
                return url(r'^(?P<roleid>{})/{}/'.format(cls.roleid_regex, appname),
                           include(appurlpatterns))

        else:
            if flatten:
                return url(r'^', include(appurlpatterns))
            else:
                return url(r'^{}/'.format(appname),
                           include(appurlpatterns))

    @classmethod
    def _get_app_urls(cls):
        urls = []
        for appname, appclass in cls.get_apps():
            urls.append(cls.get_app_url(appname=appname, appclass=appclass))
        return urls

    @classmethod
    def __no_role_and_flatten_rolefrontpage_url(cls):
        return cls.flatten_rolefrontpage_url and not cls.roleclass

    @classmethod
    def urls(cls):
        """
        Get the url patterns for the cradmin instance.
        """
        cradmin_instance_registry.add(cls)
        urls = cls._get_app_urls()
        if cls.__no_role_and_flatten_rolefrontpage_url():
            urls.append(url('^$', FakeRoleFrontpageView.as_view(),
                            name=cls.id))
        else:
            urls.append(url('^$', cls.get_instance_frontpage_view(),
                            name=cls.id))

        return urls

    def add_extra_instance_variables_to_request(self, request):
        """
        Override this method to add extra attributes to the request object
        for all views in this cradmin instance.

        This is called by the decorator that wraps all views within the instance.
        """

    def get_body_css_classes_list(self):
        """
        Get the css classes for the ``<body>`` element that this
        cradmin instance should add for all views as a list.

        Returns an empty list by default, but you should override this
        to add css classes to the ``<body>`` element for all views
        within this instance.
        """
        return []

    def get_body_css_classes_string(self):
        """
        Get the css classes for the ``<body>`` element that this
        cradmin instance should add for all views as a string.

        You should not override this - override :meth:`.get_body_css_classes_list`.
        This method only joins the list returned by that method to make it
        easier to use in Django templates.
        """
        return ' '.join(self.get_body_css_classes_list())

    @property
    def page_cover_bem_block(self):
        """
        Get the name of the BEM block for the page cover.

        Should be overridden if you do not want the default of ``adminui-page-cover``.

        If you need more complex behavior, you should consider:
        - Making your own templates that extend:
            - ``django_cradmin/standalone-base.django.html`` - for all the views outside the role.
            - ``django_cradmin/base.django.html`` - for all the views within the role
        - OR override (this affects all cradmin instances):
            - ``django_cradmin/standalone-base.django.html``
            - ``django_cradmin/base.django.html``
        """
        return 'adminui-page-cover'

    def get_default_javascriptregistry_component_ids(self):
        """
        Get default component IDs for all views within this cradmin instance.
        """
        return []

    def get_default_within_role_javascriptregistry_component_ids(self):
        """
        Get default component IDs for all views within a cradmin_role within this cradmin instance.

        Defaults to :meth:`.get_default_javascriptregistry_component_ids`.
        """
        return self.get_default_javascriptregistry_component_ids() + [
            'django_cradmin_javascript'
        ]


class NoRoleMixin(object):
    """
    Mixin to make a :class:`.BaseCrAdminInstance` not require a role.

    Must be mixed in before :class:`.BaseCrAdminInstance`.
    """
    flatten_rolefrontpage_url = True

    def get_titletext_for_role(self, role):
        return settings.DJANGO_CRADMIN_SITENAME


class NoLoginMixin(object):
    """
    Mixin to make a :class:`.BaseCrAdminInstance` not require login.

    Must be mixed in before :class:`.BaseCrAdminInstance`.
    """
    def has_access(self):
        """
        We give any user access to this instance, including unauthenticated users.
        """
        return True


class NoRoleNoLoginCrAdminInstance(NoRoleMixin, NoLoginMixin, BaseCrAdminInstance):
    """
    Shortcut for creating a :class:`.BaseCrAdminInstance` with the
     :class:`.NoRoleMixin` and :class:`.NoLoginMixin`.
    """
