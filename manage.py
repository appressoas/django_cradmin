#!/usr/bin/env python

"""
Django management files for running the django_cradmin tests.

Does NOT work as a full project (no database, no urls, etc.)
"""

# import warnings
# from django.utils.deprecation import RemovedInDjango19Warning
# warnings.filterwarnings('ignore', message='Not importing directory .*')
# warnings.filterwarnings('ignore', category=RemovedInDjango19Warning)


import os
import sys

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE",
                          'django_cradmin.demo.project.settingsproxy')
    from django.core.management import execute_from_command_line
    execute_from_command_line(sys.argv)
