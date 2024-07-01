"""
A simple Django settings module proxy that lets us configure Django
using the DJANGOENV environment variable.

Example (running tests)::

    $ DJANGOENV=test python manage.py test

Defaults to the ``develop`` enviroment, so developers can use ``python
manage.py`` without anything extra during development.
"""
import json
import os


def _load_develop_environment_from_file():
    if os.path.exists('develop-environment.json'):
        environment_dict = json.loads(open('develop-environment.json', 'r').read())
        for key, value in environment_dict.items():
            if key.upper() == key:
                os.environ[key] = value


DJANGOENV = os.environ.get('DJANGOENV', 'develop')

if DJANGOENV == 'develop':  # Used for local development
    _load_develop_environment_from_file()
    from django_cradmin.demo.project.demo.settings import *  # noqa
elif DJANGOENV == 'test':  # Used when running the Django tests
    from django_cradmin.demo.project.test.settings import *  # noqa
else:
    raise ValueError('Invalid value for the DJANGOENV environment variable: {}'.format(DJANGOENV))
