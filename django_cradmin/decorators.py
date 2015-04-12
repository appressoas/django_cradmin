from __future__ import unicode_literals
from functools import wraps
from django.conf import settings
from django.contrib.auth import REDIRECT_FIELD_NAME
from django.core.exceptions import ObjectDoesNotExist
from django.utils.encoding import force_str
from django.shortcuts import resolve_url

from django_cradmin.registry import cradmin_instance_registry


def cradminview(view_function, redirect_field_name=REDIRECT_FIELD_NAME, login_url=None):
    """
    Decorator for django_cradmin views.

    Protects the view, making it impossible to access unless the requesting user
    has the role defined by the named url variable ``roleid``.

    Adds the following variables to the request:

        - ``cradmin_instance``: The detected cradmin instance.
        - ``cradmin_role``: The detected cradmin role.
    """

    @wraps(view_function)
    def wrapper(request, *args, **kwargs):
        if request.user.is_authenticated():
            roleid = kwargs.pop('roleid')
            cradmin_instance = cradmin_instance_registry.get_current_instance(request)
            role = cradmin_instance.get_role_from_roleid(roleid)
            if not role:
                return cradmin_instance.invalid_roleid_response(roleid)
            try:
                role_from_rolequeryset = cradmin_instance.get_role_from_rolequeryset(role)
            except ObjectDoesNotExist:
                return cradmin_instance.missing_role_response(role)
            else:
                request.cradmin_instance = cradmin_instance
                request.cradmin_role = role_from_rolequeryset
                return view_function(request, *args, **kwargs)
        else:
            # Redirect to login just like login_required()
            from django.contrib.auth.views import redirect_to_login
            path = request.build_absolute_uri()
            resolved_login_url = force_str(
                resolve_url(login_url or settings.LOGIN_URL))
            return redirect_to_login(path, resolved_login_url, redirect_field_name)

    return wrapper
