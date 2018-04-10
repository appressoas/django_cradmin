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

    $ ievv recreate_devdb

.. warning:: This will destroy your current database.


**************************
Users in the test database
**************************
After importing the test data, you will have some new users. Login to the Django admin UI (http://localhost:8000/admin/) with::

    email: grandma@example.com
    password: test

and select Users to list all users. The password of all users are ``test``.



************
Add new data
************
To add new data, you just need to do add data to the database manually.

Adding data manually (I.E.: Using the Django admin UI)
======================================================
To add data manually, you should first run the ``recreate_devdb`` management
command to make sure you start out with the current up-to-date dataset. Then you
can use the web-UI or the Django shell to add data. Finally, run::

    $ ievv dump_db_as_sql

Now you can commit the update ``django_cradmin/demo/project/demo/dumps/default.sql`` to the git
repo if you want to make the changes to the development database available to other developers
of django-cradmin.
