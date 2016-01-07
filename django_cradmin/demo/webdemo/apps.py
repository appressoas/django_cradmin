from django.apps import AppConfig
from django_cradmin.superuserui import superuserui_registry


class WebdemoConfig(AppConfig):
    name = 'django_cradmin.demo.webdemo'
    verbose_name = "Webdemo"

    def ready(self):
        appconfig = superuserui_registry.default.add_djangoapp(
            superuserui_registry.DjangoAppConfig(app_label='webdemo'))
        # page_model = self.get_model('Page')
        # appconfig.add_model(superuserui_registry.ModelConfig(model_class=page_model))
        appconfig.add_all_models()
