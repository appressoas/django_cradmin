from django.apps import AppConfig
from django.contrib.auth import get_user_model



class UsermanagerdemoConfig(AppConfig):
    name = 'django_cradmin.demo.usermanagerdemo'
    verbose_name = "Usermanager demo"

    def ready(self):
        from django_cradmin.superuserui import superuserui_registry
        appconfig = superuserui_registry.default.add_djangoapp(
            superuserui_registry.DjangoAppConfig(app_label='usermanagerdemo'))
        user_model = get_user_model()
        appconfig.add_model(superuserui_registry.ModelConfig(model_class=user_model))
