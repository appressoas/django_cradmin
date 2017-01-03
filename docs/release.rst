#######################################
How to release a new version of cradmin
#######################################

.. note:: This assumes you have permission to release cradmin to pypi.

1. Remove the ``django_cradmin/static/django_cradmin/<version>/`` directory.
   You find the version in ``django_cradmin/version.json``.
2. Update ``django_cradmin/version.json``.
3. Run::

    $ ievv buildstatic --production

4. Add the new ``django_cradmin/static/django_cradmin/<version>/`` directory to GIT.
5. Commit.
6. Tag the commit with ``<version>``.
7. Push (``git push && git push --tags``).
8. Release to pypi (``python setup.py sdist upload``).
