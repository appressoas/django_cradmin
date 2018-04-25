#################################
Django cradmin 5.2.0 releasenotes
#################################

.. warning:: 5.2.0 is not released yet.

************
What is new?
************
- Rename the ``DJANGO_CRADMIN_DEFAULT_EXPANDABLE_CLASS`` setting to ``DJANGO_CRADMIN_DEFAULT_EXPANDABLE_MENU_CLASS``.
- Improved support for expandable menu outside of a cradmin instance.
- Add support for a default footer rendererable. See :setting:`DJANGO_CRADMIN_DEFAULT_FOOTER_CLASS`.


***************************
Migrate from 5.1.0 to 5.2.0
***************************
If you set or use the ``DJANGO_CRADMIN_DEFAULT_EXPANDABLE_CLASS`` setting, refactor to
to ``DJANGO_CRADMIN_DEFAULT_EXPANDABLE_MENU_CLASS``. Something like this should help you
find ocurrences::

    $ git grep DJANGO_CRADMIN_DEFAULT_EXPANDABLE_CLASS -- '*.html' '*.py'
