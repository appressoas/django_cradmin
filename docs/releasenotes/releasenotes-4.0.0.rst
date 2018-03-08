#################################
Django cradmin 4.0.0 releasenotes
#################################


************
What is new?
************
- Cleanup of most of the leftovers from cradmin 1.x
- ``cradmin_legacy`` compatibility. The cradmin_legacy library is a
  fork of the django_cradmin 1.x branch, which can be used alongside
  django_cradmin >= 4.0.0.


***********************
Migrate from 3.x to 4.x
***********************

Deprecated: cradmin_imagearchive
================================
The `django_cradmin.apps.cradmin_imagearchive` app has been deprecated
and moved to ``django_cradmin.deprecated_apps.cradmin_imagearchive`.
The ``ArchiveImage`` model has been renamed to ``ArchiveImageDeprecated``.

..
    If you want to continue using cradmin_imagearchive, and want to keep your existing
    ArchiveImages, you need to do the following:
    - Update to ``django_cradmin>=4.0.0,<5.0.0``.
    - Update the entry in ``INSTALLED_APPS`` from ``django_cradmin.apps.cradmin_imagearchive``
      to ``django_cradmin.deprecated_apps.cradmin_imagearchive``.
    - ``python manage.py migrate``.
    - Install ``cradmin_legacy``.
    - Update the entry in ``INSTALLED_APPS`` from ``django_cradmin.deprecated_apps.cradmin_imagearchive``
      to ``cradmin_legacy.apps.cradmin_imagearchive``.


TODO: I think we can do:
- Update to ``django_cradmin>=4.0.0``.
- Update the entry in ``INSTALLED_APPS`` from ``django_cradmin.apps.cradmin_imagearchive``
  to ``cradmin_legacy.apps.cradmin_imagearchive``.
- ``python manage.py migrate``

BUT then we need to make sure the migrations have not diverged!
