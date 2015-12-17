import re

from django_cradmin import crinstance
from django_cradmin import crmenu
from django_cradmin import crapp
from django_cradmin.decorators import has_access_to_cradmin_instance
from django_cradmin.superuserui.views import dashboardview
from django_cradmin.superuserui.views import listview
from django_cradmin.superuserui.views import editview
from django_cradmin.superuserui.views import deleteview


class SuperuserUiCrApp(crapp.App):
    modelconfig = None

    @classmethod
    def get_listview_class(cls):
        return listview.View

    @classmethod
    def get_editview_class(cls):
        return editview.View

    @classmethod
    def get_deleteview_class(cls):
        return deleteview.View

    @classmethod
    def get_appurls(cls):
        appurls = []
        listview_class = cls.get_listview_class()
        if listview_class:
            appurls.append(crapp.Url(
                r'^$',
                listview_class.as_view(modelconfig=cls.modelconfig),
                name=crapp.INDEXVIEW_NAME))
        else:
            raise NotImplementedError('You must return a view class from get_listview_class(). '
                                      'Note that it can be something other than a list view, '
                                      'such as an overview of with information/stats for the model.')

        editview_class = cls.get_editview_class()
        if editview_class:
            appurls.append(crapp.Url(
                r'^edit/(?P<pk>\d+)$',
                editview_class.as_view(),
                name="edit"))

        deleteview_class = cls.get_deleteview_class()
        if deleteview_class:
            appurls.append(crapp.Url(
                r'^delete/(?P<pk>\d+)$',
                deleteview_class.as_view(),
                name="delete"))

        # return [
            # crapp.Url(
            #     r'^$',
            #     listview.View.as_view(),
            #     name=crapp.INDEXVIEW_NAME),
            # crapp.Url(
            #     r'^filter/(?P<filters_string>.+)?$',
            #     PagesListBuilderView.as_view(),
            #     name='filter'),
            # crapp.Url(
            #     r'^create$',
            #     PageCreateView.as_view(),
            #     name="create"),
            # crapp.Url(
            #     r'^edit/(?P<pk>\d+)$',
            #     PageUpdateView.as_view(),
            #     name="edit"),
            # crapp.Url(
            #     r'^preview/(?P<pk>\d+)?$',
            #     PreviewPageView.as_view(),
            #     name="preview"),
            # crapp.Url(
            #     r'^delete/(?P<pk>\d+)$',
            #     PageDeleteView.as_view(),
            #     name="delete"),
        # ]
        return appurls


class ModelConfig(object):
    def __init__(self, model_class=None, menulabel=None, crapp_class=None):
        self.model_class = model_class
        self.menulabel = menulabel
        self.crapp_class = crapp_class
        self.djangoappconfig = None  # This is set in DjangoAppConfig.add_model()

    def get_model_class(self):
        if self.model_class:
            return self.model_class
        else:
            raise NotImplementedError('You must override get_model_class() or provide the '
                                      '``model_class`` parameter for __init__().')

    def get_menulabel(self):
        if self.menulabel:
            return self.menulabel
        else:
            return self.get_model_class()._meta.verbose_name_plural

    def get_unique_identifier(self):
        return '{}_{}'.format(self.model_class._meta.app_label,
                              self.model_class._meta.model_name)

    def get_crapp_class(self):
        if self.crapp_class:
            return self.crapp_class
        else:
            return SuperuserUiCrApp

    def make_crapp_class(self):
        me = self

        class App(self.get_crapp_class()):
            modelconfig = me

        return App


class DjangoAppConfig(object):
    def __init__(self, appname=None, menulabel=None):
        self.appname = appname
        self.menulabel = menulabel
        self.modelconfigs = []
        self.registry = None  # This is set in Registry.add_djangoapp()

    def get_appname(self):
        if self.appname:
            return self.appname
        else:
            raise NotImplementedError('You must override get_appname() or provide the '
                                      '``appname`` parameter for __init__().')

    def get_menulabel(self):
        if self.menulabel:
            return self.menulabel
        else:
            return self.get_appname()
            # raise NotImplementedError('You must override get_menulabel() or provide the '
            #                           '``menulabel`` parameter for __init__().')

    def add_model(self, modelconfig):
        self.modelconfigs.append(modelconfig)
        modelconfig.djangoappconfig = self


class Registry(object):
    def __init__(self, id, urlpath_regex=r'^/superuser/.*$'):
        self.id = id
        self.urlpath_regex = urlpath_regex
        self.appconfigs = []

    def add_djangoapp(self, djangoappconfig):
        self.appconfigs.append(djangoappconfig)
        djangoappconfig.registry = self
        return djangoappconfig

    def make_menu_class(self):
        me = self

        class Menu(crmenu.Menu):
            def build_menu(self):
                for appconfig in me.appconfigs:
                    appmenuitem = self.add_menuitem(
                        label=appconfig.get_menulabel(),
                        # url=self.appindex_url(appconfig.get_appname()),
                        url='#',
                        active=self.request.cradmin_app.appname == appconfig.get_appname())
                    for modelconfig in appconfig.modelconfigs:
                        appmenuitem.add_childitem(
                            label=modelconfig.get_menulabel(),
                            url=self.appindex_url(modelconfig.get_unique_identifier()),
                            active=self.request.cradmin_app.appname == modelconfig.get_unique_identifier())

        return Menu

    def get_dashboardview_class(self):
        return dashboardview.View

    def make_cradmin_instance_class(self):
        me = self

        class CrAdminInstance(crinstance.BaseCrAdminInstance):
            id = me.id
            menuclass = me.make_menu_class()

            def has_access(self):
                return self.request.user.is_superuser

            @classmethod
            def get_apps(cls):
                apps = []
                for appconfig in me.appconfigs:
                    for modelconfig in appconfig.modelconfigs:
                        apps.append((modelconfig.get_unique_identifier(),
                                     modelconfig.make_crapp_class()))
                return apps

            @classmethod
            def matches_urlpath(cls, urlpath):
                return urlpath.startswith('/superuser')  #re.match(me.urlpath_regex, urlpath)

            @classmethod
            def get_instance_frontpage_view(cls):
                return has_access_to_cradmin_instance(me.get_dashboardview_class().as_view())

        return CrAdminInstance


#: The default superuserui registry.
default = Registry(id='django_cradmin_superuserui_default')
