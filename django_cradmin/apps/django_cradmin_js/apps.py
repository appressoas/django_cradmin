from django.apps import AppConfig
from . import static_components


class CradminJavascriptAppConfig(AppConfig):
    name = 'django_cradmin.apps.django_cradmin_js'
    verbose_name = 'Django cradmin javascript'

    def ready(self):
        from django_cradmin import javascriptregistry
        javascriptregistry.Registry.get_instance().add(static_components.CradminJavascript)
