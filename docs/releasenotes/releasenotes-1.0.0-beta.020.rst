##########################################
Django cradmin 1.0.0-beta.020 releasenotes
##########################################


************
What is new?
************
Python 3.4+ support. We also support Python 2.7.


**********
Migrations
**********
This release introduces Django 1.7+ style migrations for ``cradmin_imagearchive``
and ``cradmin_temporaryfileuploadstore``. This means that you need to run::

    $ python manage.py migrate --fake-initial

to fake the initial migrations if you already have database tables for one or both
of these apps.
