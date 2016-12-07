from __future__ import unicode_literals
from django.template import defaultfilters

from django_cradmin.viewhelpers import formview
from .mixins import QuerysetForRoleMixin


class DeleteInvitesView(QuerysetForRoleMixin, formview.WithinRoleDeleteView):
    """
    View used to delete existing invites.
    """
    def get_object_preview(self):
        generictoken = self.get_object()
        return u'{} - {}'.format(
            generictoken.metadata['email'],
            defaultfilters.date(generictoken.created_datetime, 'DATETIME_FORMAT')
        )
