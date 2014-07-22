#!/usr/bin/env python

"""
Django management files for running the django_cradmin tests.

Does NOT work as a full project (no database, no urls, etc.)
"""


import os
import sys

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "django_cradmin_testsettings")

    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)
