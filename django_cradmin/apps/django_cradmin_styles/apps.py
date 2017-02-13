from django.apps import AppConfig


class WithStyleguideAppConfig(AppConfig):
    name = 'django_cradmin.apps.django_cradmin_styles'
    verbose_name = 'Django cradmin styles'

    def ready(self):
        from django_cradmin.apps.cradmin_kss_styleguide import styleguide_registry
        super(WithStyleguideAppConfig, self).ready()

        styleguide = styleguide_registry.CradminStyleGuide(
            unique_id='basetheme',
            label='Django CRadmin basetheme',
            appname='django_cradmin_styles',
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
