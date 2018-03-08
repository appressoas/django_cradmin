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
The ``django_cradmin.apps.cradmin_imagearchive`` app has been deprecated
and moved to ``django_cradmin.deprecated_apps.cradmin_imagearchive`,
and the database model has been renamed from ``ArchiveImage`` to
``ArchiveImageDeprecated``.

The ``cradmin_imagearchive`` module should have been removed in django_cradmin 2.0.0,
but it was forgotten. If you need to use this app, you should consider:

- Installing ``cradmin_legacy``. Make sure you follow the guides in the ``cradmin_legacy``
  for adding it to an existing ``django_cradmin > 2.0`` install.
- Change from ``django_cradmin.apps.cradmin_imagearchive`` -> ``cradmin_legacy.apps.cradmin_imagearchive``
  in ``INSTALLED_APPS``.

This should just work, since the appnames are the same, and their migrations match.

If you do not want to depend on ``cradmin_legacy``, you can update your ``INSTALLED_APPS``
with ``django_cradmin.apps.cradmin_imagearchive`` -> ``django_cradmin.deprecated_apps.cradmin_imagearchive``.
When you migrate this change, the database table for ArchiveImage will be renamed so
that it ends with ``deprecated``. This avoids problems if you add ``cradmin_legacy`` in the future.


Deprecated: cradmin_temporaryfileuploadstore
============================================
The ``django_cradmin.apps.cradmin_temporaryfileuploadstore`` app has been deprecated
and moved to ``django_cradmin.deprecated_apps.cradmin_temporaryfileuploadstore`,
and the database models has been renamed from ``TemporaryFileCollection`` ->
``TemporaryFileCollectionDeprecated`` and ``TemporaryFile`` -> ``TemporaryFileDeprecated``.

The ``cradmin_temporaryfileuploadstore`` module should have been removed in django_cradmin 2.0.0,
but it was forgotten. If you need to use this app, you should consider:

- Installing ``cradmin_legacy``. Make sure you follow the guides in the ``cradmin_legacy``
  for adding it to an existing ``django_cradmin > 2.0`` install.
- Change from ``django_cradmin.apps.cradmin_temporaryfileuploadstore`` -> ``cradmin_legacy.apps.cradmin_temporaryfileuploadstore``
  in ``INSTALLED_APPS``.

This should just work, since the appnames are the same, and their migrations match.

If you do not want to depend on ``cradmin_legacy``, you can update your ``INSTALLED_APPS``
with ``django_cradmin.apps.cradmin_temporaryfileuploadstore`` -> ``django_cradmin.deprecated_apps.cradmin_temporaryfileuploadstore``.
When you migrate this change, the database tables will be renamed so that they end with ``deprecated``.
This avoids problems if you add ``cradmin_legacy`` in the future.
