#################################
Django cradmin 5.0.0 releasenotes
#################################


************
What is new?
************
- Generalized breadcrumbs support in the new ``crbreadcrumb`` module. See :doc:`/crbreadcrumb`.
- Docs for all the non-deprecated classes in ``django_cradmin.viewhelpers``.
- Renamed ``adminui-expandable-menu`` BEM block to ``expandable-menu``.
- New neutral variable in the theme colormap - ``verylight``.


***********************
Migrate from 4.x to 5.x
***********************


Handle adminui-breadcrumbs BEM block removal
============================================
The ``adminui-breadcrumbs`` css BEM block (set of css classes) has been removed.

You should be able to find occurrences of the ``adminui-breadcrumbs`` css classes fairly easily with
something like::

    $ git grep adminui-breadcrumbs -- '*.html' '*.py' '*.js' '*.jsx' '*.scss'
    $ git grep breadcrumbs-mixin -- '*.html' '*.py' '*.js' '*.jsx' '*.scss'

If your project is affected by the removal of ``adminui-breadcrumbs``, you have 3 options:

- Rewrite your code to using the new ``crbreadcrumb`` module - see :doc:`/crbreadcrumb`.
  **This is the recommended solution**.
- Rewrite your code to use the ``breadcrumb-item-list`` instead of ``adminui-breadcrumbs``. This
  may not work in all cases since they are not 100% compatible.
- Copy the ``.adminui-breadcrumbs`` css class from `_adminui-breadcrumbs.scss <https://github.com/appressoas/django_cradmin/blob/4.x/django_cradmin/apps/django_cradmin_styles/staticsources/django_cradmin_styles/styles/basetheme/4__components/_adminui-breadcrumbs.scss>`_,
  and the ``breadcrumbs-mixin`` mixin class from
  `_mixins.scss <https://github.com/appressoas/django_cradmin/blob/4.x/django_cradmin/apps/django_cradmin_styles/staticsources/django_cradmin_styles/styles/basetheme/4__components/_mixins.scss>`_
  in the 4.x branch from the django cradmin repo. This is **not recommended**, but it could
  be a usable intermediate solution if you have a lot of refactoring to do.


Handle rename of ``adminui-expandable-menu`` BEM block
======================================================
You will normally not be affected by this unless you have overidden the styles
for this BEM block. Fin usages in your project with something like::

    $ git grep adminui-expandable-menu -- '*.html' '*.py' '*.js' '*.jsx' '*.scss'


Handle the new ``verylight`` neutral color
==========================================
Add the ``verylight`` color to the neutral key in the ``$colors`` map in your
SASS sources. Example::

    $colors: (
        // ...
        neutral: (
            // ...
            verylight: tint($__color-neutral-base, 75%),
            // ...
        ),
        // ...
);
