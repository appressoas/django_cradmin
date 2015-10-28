from django.conf import settings


def get_setting(settingvariable, fallback=None):
    return getattr(settings, settingvariable, fallback)


def cradmin(request):
    return {
        'DJANGO_CRADMIN_THEME_PATH': get_setting(
            'DJANGO_CRADMIN_THEME_PATH',
            'django_cradmin/dist/css/cradmin_theme_default/theme.css'),
        'DJANGO_CRADMIN_MENU_SCROLL_TOP_FIXED': get_setting(
            'DJANGO_CRADMIN_MENU_SCROLL_TOP_FIXED', False),
        'DJANGO_CRADMIN_MOMENTJS_LOCALE': get_setting(
            'DJANGO_CRADMIN_MOMENTJS_LOCALE', None),
        'DJANGO_CRADMIN_CSS_ICON_LIBRARY_PATH': get_setting(
            'DJANGO_CRADMIN_CSS_ICON_LIBRARY_PATH',
            'django_cradmin/dist/vendor/fonts/fontawesome/css/font-awesome.min.css'),
        'DJANGO_CRADMIN_HIDE_PAGE_HEADER': get_setting(
            'DJANGO_CRADMIN_HIDE_PAGE_HEADER', False),
    }
