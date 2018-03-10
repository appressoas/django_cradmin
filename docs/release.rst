#######################################
How to release a new version of cradmin
#######################################

.. note:: This assumes you have permission to release cradmin to pypi.

1. Remove the previous built static files::

    $ git rm -r django_cradmin/apps/django_cradmin_js/static/django_cradmin_js/ django_cradmin/apps/django_cradmin_styles/static/django_cradmin_styles/

2. Update ``django_cradmin/version.json``.
3. Run::

    $ ievv buildstatic --production

4: Run::

    $ git add django_cradmin/apps/django_cradmin_js/static/django_cradmin_js/ django_cradmin/apps/django_cradmin_styles/static/django_cradmin_styles/

5. Commit.
6. Tag the commit with ``<version>``.
7. Push (``git push && git push --tags``).
8. Release to pypi (``python setup.py sdist && twine upload dist/django-cradmin-<version>.tar.gz``).
