#######################################
How to release a new version of cradmin
#######################################

.. note:: This assumes you have permission to release cradmin to pypi.

1. Create releasenotes in ``releasenotes/releasenotes-<major-version>.md``.
2. Remove the previous built static files::

    $ git rm -r django_cradmin/apps/django_cradmin_js/static/django_cradmin_js/ django_cradmin/apps/django_cradmin_styles/static/django_cradmin_styles/

3. Update ``django_cradmin/version.json``.
4. Run::

    $ ievv buildstatic --production

5: Run::

    $ git add django_cradmin/apps/django_cradmin_js/static/django_cradmin_js/ django_cradmin/apps/django_cradmin_styles/static/django_cradmin_styles/

6. Commit with ``Release <version>``.
7. Tag the commit with ``<version>``.
8. Push (``git push && git push --tags``).
9. Release to pypi (``python setup.py sdist && twine upload dist/django-cradmin-<version>.tar.gz``).
