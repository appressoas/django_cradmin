from django.apps import AppConfig
from django.utils.translation import ugettext_lazy

from django_cradmin.superuserui import superuserui_registry


class ImageArchiveConfig(AppConfig):
    name = 'django_cradmin.apps.cradmin_imagearchive'
    verbose_name = ugettext_lazy("Image archive")

    def ready(self):
        appconfig = superuserui_registry.default.add_djangoapp(
            superuserui_registry.DjangoAppConfig(app_label='cradmin_imagearchive'))
        appconfig.add_all_models()
