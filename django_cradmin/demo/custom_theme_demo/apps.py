from django.apps import AppConfig
from django.utils.translation import ugettext_lazy


class CustomThemeDemoAppConfig(AppConfig):
    name = 'django_cradmin.demo.custom_theme_demo'
    verbose_name = "Django CRadmin custom theme demo"

    def ready(self):
        from django_cradmin.apps.cradmin_kss_styleguide import styleguide_registry

        styleguide = styleguide_registry.CradminStyleGuide(
            unique_id='django_cradmin_theme_example',
            label='Django CRadmin example theme',
            appname='custom_theme_demo',
            sourcefolder='styles/cradmin_theme_example',
            sourcefile='styleguide.scss',
        )
        styleguide_registry.Registry.get_instance().add(styleguide)
