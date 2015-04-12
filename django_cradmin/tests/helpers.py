from __future__ import unicode_literals
from django.contrib.auth import get_user_model


def create_user(username=None, password='test', **kwargs):
    """
    Create a user with the given ``username``.
    """
    user = get_user_model().objects.create(username=username, **kwargs)
    user.set_password(password)
    user.save()
    return user
