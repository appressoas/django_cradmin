from django.template import defaultfilters
from django_cradmin.apps.cradmin_generic_token_with_metadata.models import GenericTokenWithMetadata
from django_cradmin.viewhelpers import delete


class DeleteInvitesView(delete.DeleteView):
    """
    View used to delete existing invites.
    """
    def get_queryset_for_role(self, site):
        return GenericTokenWithMetadata.objects.filter_usable_by_content_object_in_app(
            content_object=site, app='webdemo_inviteadmins_private')

    def get_object_preview(self):
        generictoken = self.get_object()
        return u'{} - {}'.format(
            generictoken.metadata['email'],
            defaultfilters.date(generictoken.created_datetime, 'DATETIME_FORMAT')
        )
