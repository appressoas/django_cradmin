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
    $ ievv recreate_devdb


**************************
Run the development server
**************************
::

    $ workon django_cradmin
    $ ievv devrun

Open http://localhost:8000 and login with::

    email: grandma@example.com
    password: test


*************
Run the tests
*************
::

    $ workon django_cradmin
    $ DJANGOENV=test python manage.py test django_cradmin
