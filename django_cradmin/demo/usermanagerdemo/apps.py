from django.apps import AppConfig
from django.contrib.auth import get_user_model

from django_cradmin.superuserui import superuserui_registry


class UsermanagerdemoConfig(AppConfig):
    name = 'django_cradmin.demo.usermanagerdemo'
    verbose_name = "Usermanager demo"

    def ready(self):
        appconfig = superuserui_registry.default.add_djangoapp(
            superuserui_registry.DjangoAppConfig(app_label='usermanagerdemo'))
        user_model = get_user_model()
        appconfig.add_model(superuserui_registry.ModelConfig(model_class=user_model))
