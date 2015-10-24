from __future__ import unicode_literals
from django.utils.translation import ugettext_lazy as _

from django_cradmin.viewhelpers import delete
from django_cradmin.demo.webdemo.views.sharable_link.mixins import QuerysetForRoleMixin


class DeletePublicInviteView(QuerysetForRoleMixin, delete.DeleteView):
    """
    View used to delete existing invites.
    """
    def get_action_label(self):
        return _('Disable')

    def get_confirm_message(self):
        return _('Are you sure you want to disable the sharable link?')

    def get_object_preview(self):
        return _('sharable link')

    def get_success_message(self, object_preview):
        return _('Disabled the sharable link')
