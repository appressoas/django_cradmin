from django.apps import AppConfig
from django_cradmin.superuserui import superuserui_registry


class WebdemoConfig(AppConfig):
    name = 'django_cradmin.demo.webdemo'
    verbose_name = "Webdemo"

    def ready(self):
        page_model = self.get_model('Page')
        appconfig = superuserui_registry.default.add_djangoapp(
                superuserui_registry.DjangoAppConfig(appname='webdemo'))
        appconfig.add_model(superuserui_registry.ModelConfig(model_class=page_model))
