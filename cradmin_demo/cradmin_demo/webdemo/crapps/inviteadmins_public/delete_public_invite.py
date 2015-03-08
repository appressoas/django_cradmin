from django_cradmin.apps.cradmin_generic_token_with_metadata.models import GenericTokenWithMetadata
from django_cradmin.viewhelpers import delete


class DeletePublicInviteView(delete.DeleteView):
    """
    View used to delete existing invites.
    """
    def get_queryset_for_role(self, site):
        return GenericTokenWithMetadata.objects.filter_usable_by_content_object_in_app(
            content_object=site, app='webdemo_inviteadmins_public')

    def get_object_preview(self):
        generictoken = self.get_object()
        if generictoken.metadata['description']:
            return generictoken.metadata['description']
        else:
            return generictoken.token
