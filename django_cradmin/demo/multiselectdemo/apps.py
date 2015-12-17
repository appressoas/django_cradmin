from django.apps import AppConfig
from django_cradmin.superuserui import superuserui_registry


class MultiselectdemoConfig(AppConfig):
    name = 'django_cradmin.demo.multiselectdemo'
    verbose_name = "Multiselect demo"

    def ready(self):
        appconfig = superuserui_registry.default.add_djangoapp(
                superuserui_registry.DjangoAppConfig(app_label='multiselectdemo'))
        appconfig.add_all_models()
