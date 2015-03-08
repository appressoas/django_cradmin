from django_cradmin.apps.cradmin_generic_token_with_metadata.models import GenericTokenWithMetadata
from django_cradmin.viewhelpers import delete
from django.utils.translation import ugettext_lazy as _


class DeletePublicInviteView(delete.DeleteView):
    """
    View used to delete existing invites.
    """
    def get_action_label(self):
        return _('Disable')

    def get_confirm_message(self):
        return _('Are you sure you want to disable the sharable link?')

    def get_queryset_for_role(self, site):
        return GenericTokenWithMetadata.objects.filter_usable_by_content_object_in_app(
            content_object=site, app='webdemo_inviteadmins_public')

    def get_object_preview(self):
        return _('sharable link')

    def get_success_message(self, object_preview):
        return _('Disabled the sharable link')
