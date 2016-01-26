from __future__ import unicode_literals
from builtins import object


class QuerysetForRoleMixin(object):
    def get_queryset_for_role(self, role):
        """
        Get a queryset with all objects of ``self.model``  that
        the current role can access.
        """
        raise NotImplementedError()

    def get_queryset(self):
        """
        DO NOT override this. Override :meth:`.get_queryset_for_role`
        instead.
        """
        queryset = self.get_queryset_for_role(self.request.cradmin_role)
        return queryset
