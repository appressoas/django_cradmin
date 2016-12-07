from __future__ import unicode_literals
from builtins import object
from django_cradmin.apps.cradmin_generic_token_with_metadata.models import GenericTokenWithMetadata


class QuerysetForRoleMixin(object):
    def get_queryset_for_role(self):
        return GenericTokenWithMetadata.objects.filter_usable_by_content_object_in_app(
            content_object=self.request.cradmin_role, app='webdemo_inviteadmins')
