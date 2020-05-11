#######################################
Develop django_cradmin, or run the demo
#######################################

To develop django-cradmin, or to run the demo, you will have to do the following.


******************
Clone the git repo
******************
You will find the URL on our github project page.


************************************
Install the development requirements
************************************
::

    $ pipenv install --dev


************************
Create the demo database
************************
::

    $ pipenv run ievv recreate_devdb


**************************
Run the development server
**************************
::

    $ pipenv run ievv devrun

Open http://localhost:8000 and login with::

    email: grandma@example.com
    password: test


*************
Run the tests
*************
::

    $ pipenv run pytest django_cradmin
