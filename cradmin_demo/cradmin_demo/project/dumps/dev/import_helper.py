from __future__ import unicode_literals
from builtins import object
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password


class ImportHelper(object):
    def post_import(self):
        User = get_user_model()
        User.objects.all().update(password=make_password('test'))
