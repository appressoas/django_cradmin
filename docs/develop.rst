#######################################
Develop django_cradmin, or run the demo
#######################################

To develop django-cradmin, or to run the demo, you will have to do the following.


******************
Clone the git repo
******************
You will find the URL on our github project page.


*******************
Create a virtualenv
*******************
::

    $ mkvirtualenv -p /path/to/python3 django_cradmin


************************************
Install the development requirements
************************************
::

    $ workon django_cradmin
    $ pip install -r requirements/python3.txt


************************
Create the demo database
************************
::

    $ workon django_cradmin
    $ inv recreate_devdb


**************************
Run the development server
**************************
::

    $ workon django_cradmin
    $ python manage.py runserver

Open http://localhost:8000 and login with::

    email: grandma@example.com
    password: test


*************
Run the tests
*************
::

    $ workon django_cradmin
    $ DJANGOENV=test python manage.py test django_cradmin


*******************
Release new version
*******************
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
