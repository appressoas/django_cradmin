# Django cradmin

Django custom role based admin UI.

Django cradmin is in BETA. The system is fairly stable, but:

- We do not have getting started guides.
- We should have better tests before release. Some parts have been prototyped
  a lot while we tested out different concepts, and they need a complexity
  review and better tests.


## Docs
http://django-cradmin.readthedocs.org


## License
3-clause BSD license. See the LICENSE file in the same directory as this readme file.


## How to release django_cradmin
1. Update ``django_cradmin/version.json``.
2. Add releasenote to `releasenotes/releasenotes-<major-version>.md`.
3. Remove the previous built static files:
   ```
   $ git rm -r django_cradmin/apps/django_cradmin_js/static/django_cradmin_js/ django_cradmin/apps/django_cradmin_styles/static/django_cradmin_styles/
   ```
4. Run:
   ```
   $ ievv buildstatic --production
   ```
5. Run:
   ```
   $ git add django_cradmin/apps/django_cradmin_js/static/django_cradmin_js/ django_cradmin/apps/django_cradmin_styles/static/django_cradmin_styles/
   ```
6. Commit with ``Release <version>``.
7. Tag the commit with ``<version>``.
8. Push (``git push && git push --tags``).
9. Release to pypi (``python setup.py sdist && twine upload dist/django_cradmin-<version>.tar.gz``).
