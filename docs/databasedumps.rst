#################################
Using and creating database dumps
#################################

We use dumpscript_ from the django-extentions Django app to create our test
data. We already have data, so unless you want to add more data, you do not need
to know anything more than how to run a Django management task or a fabric task.


***********************
Importing the test data
***********************
The easiest method of importing the test database is to use the ``recreate_devdb`` Fabric task::

    $ fab recreate_devdb

.. warning:: This will destroy your current database.


A slighly more low level method is to use the management command::

    $ python manage.py runscript cradmin_demo.project.dumps.dev.data

This does exactly the same as the management command, but it does not destroy
and re-initialize the database for you first.



**************************
Users in the test database
**************************
After importing the test data, you will have some new users. Login to the Django admin UI (http://localhost:8000/admin/) with::

    user: grandma
    password: test

and select Users to list all users. The password of all users are ``test``.



************
Add new data
************
To add new data, you just need to do add data to the database manually, or programmatically.

Adding data manually (I.E.: Using the Django admin UI)
======================================================
To add data manually, you should first run thr ``recreate_devdb`` management
command to make sure you start out with the current up-to-date dataset. Then you
can use the web-UI or the Django shell to add data. Finally, run::

    $ python manage.py dumpscript trix_core > cradmin_demo/project/dumps/dev/data.py


Adding data programmatically
============================
Adding data programmatically must be done in
``cradmin_demo/project/dumps/dev/import_helper.py``. See the comment at
the top of ``cradmin_demo/project/dumps/dev/data.py`` for information
about how ``import_helper`` works.


.. _dumpscript: http://django-extensions.readthedocs.org/en/latest/dumpscript.html