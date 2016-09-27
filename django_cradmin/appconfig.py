from django.apps import AppConfig
from django.utils.translation import ugettext_lazy
from django_cradmin import javascriptregistry


class CradminAppConfig(AppConfig):
    name = 'django_cradmin'
    verbose_name = ugettext_lazy("Django CRadmin")

    def ready(self):
        javascriptregistry.Registry.get_instance().add(javascriptregistry.component.CradminJavascript)


class CradminWithStyleguideAppConfig(CradminAppConfig):

    def ready(self):
        from django_cradmin.apps.cradmin_kss_styleguide import styleguide_registry
        super(CradminWithStyleguideAppConfig, self).ready()

        styleguide = styleguide_registry.CradminStyleGuide(
            unique_id='basetheme',
            label='Django CRadmin basetheme',
            appname='django_cradmin',
            sourcefolder='styles/basetheme',
            sourcefile='styleguide.scss',
            # filename_patterns=[
            #     '*cradmin_theme_base/*',
            #     '*cradmin_theme_full/1__components/*',
            #     '*cradmin_theme_full/2__components/*',
            #     '*cradmin_theme_full/3__components/*',
            #     '*cradmin_theme_full/4__components/_adminui-page-header.scss',
            # ]
        )
        styleguide_registry.Registry.get_instance().add(styleguide)

        # styleguide = styleguide_registry.CradminStyleGuide(
        #     unique_id='django_cradmin_theme_example',
        #     label='Django CRadmin example theme',
        #     appname='django_cradmin',
        #     sourcefolder='styles/cradmin_theme_example',
        #     sourcefile='styleguide.scss',
        # )
        # styleguide_registry.Registry.get_instance().add(styleguide)
