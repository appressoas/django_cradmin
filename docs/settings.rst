########
Settings
########

DJANGO_CRADMIN_THEME_PATH
    The staticfiles path to the theme CSS. If this is not
    set, we use ``django_cradmin/dist/css/cradmin_theme_default/theme.css``.

DJANGO_CRADMIN_CSS_ICON_LIBRARY_PATH
    A dictionary mapping generalized icon names to css classes.
    It is used by the ``cradmin_icon`` template tag. If you do
    not set this, you will get font-awesome icons as defined
    in :obj:`.django_cradmin.css_icon_map.FONT_AWESOME`.

    .. seealso:: :ref:`cradmin_icon_tags` and :issue:`43`.

DJANGO_CRADMIN_HIDE_PAGEHEADER_IN_FORMVIEWS
    Can be used to hide the page header in form views by default.

DJANGO_CRADMIN_HIDE_PAGEHEADER_IN_LISTINGVIEWS
    Can be used to hide the page header in listing views by default.

DJANGO_CRADMIN_MENU_SCROLL_TOP_FIXED
    If this is ``True``, the menu template will add an angularjs directive that
    automatically scrolls the menu when the window is scrolled.
