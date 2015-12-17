from future.utils import python_2_unicode_compatible

from django_cradmin import crinstance
from django_cradmin import crmenu
from django_cradmin.crinstance import reverse_cradmin_url
from django_cradmin.decorators import has_access_to_cradmin_instance
from django_cradmin.superuserui.crapps import djangomodel
from django_cradmin.superuserui.crapps import djangoapp
from django_cradmin.superuserui.views import dashboardview


@python_2_unicode_compatible
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

    def get_index_url(self):
        return reverse_cradmin_url(
            instanceid=self.djangoappconfig.registry.id,
            appname=self.get_unique_identifier())

    def get_unique_identifier(self):
        return '{}_{}'.format(self.model_class._meta.app_label,
                              self.model_class._meta.model_name)

    def get_crapp_class(self):
        if self.crapp_class:
            return self.crapp_class
        else:
            return djangomodel.DjangoModelCrApp

    def make_crapp_class(self):
        me = self

        class App(self.get_crapp_class()):
            modelconfig = me

        return App

    def __str__(self):
        return self.get_menulabel()


class DjangoAppConfig(object):
    def __init__(self, appname=None, menulabel=None, crapp_class=None):
        self.appname = appname
        self.menulabel = menulabel
        self.crapp_class = crapp_class
        self._modelconfigs = []
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
        self._modelconfigs.append(modelconfig)
        modelconfig.djangoappconfig = self

    def iter_modelconfigs(self):
        return iter(self._modelconfigs)

    def get_crapp_class(self):
        if self.crapp_class:
            return self.crapp_class
        else:
            return djangoapp.DjangoAppCrApp

    def make_crapp_class(self):
        me = self

        class App(self.get_crapp_class()):
            djangoappconfig = me

        return App


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
            def add_modelconfigs(self, appconfig, appmenuitem):
                for modelconfig in appconfig.iter_modelconfigs():
                    appmenuitem.add_childitem(
                        label=modelconfig.get_menulabel(),
                        url=self.appindex_url(modelconfig.get_unique_identifier()),
                        active=self.request.cradmin_app.appname == modelconfig.get_unique_identifier())

            def add_appconfig(self, appconfig):
                childappnames = set()
                for modelconfig in appconfig.iter_modelconfigs():
                    childappnames.add(modelconfig.get_unique_identifier())
                appmenuitem = self.add_menuitem(
                    label=appconfig.get_menulabel(),
                    url=self.appindex_url(appconfig.get_appname()),
                    active=self.request.cradmin_app.appname == appconfig.get_appname(),
                    expanded=self.request.cradmin_app.appname in childappnames)
                self.add_modelconfigs(appconfig=appconfig, appmenuitem=appmenuitem)

            def build_menu(self):
                for appconfig in me.appconfigs:
                    self.add_appconfig(appconfig=appconfig)

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
                    apps.append((appconfig.get_appname(),
                                 appconfig.make_crapp_class()))
                    for modelconfig in appconfig.iter_modelconfigs():
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
