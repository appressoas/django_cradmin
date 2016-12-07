from django_cradmin.apps.cradmin_generic_token_with_metadata.models import GenericTokenWithMetadata
from django_cradmin.viewhelpers import listbuilder
from django_cradmin.viewhelpers import listbuilderview

from .mixins import QuerysetForRoleMixin


class InviteItemValue(listbuilder.itemvalue.TitleDescription):
    template_name = 'webdemo/inviteadmins/generic_token_with_metadata_itemvalue.django.html'
    valuealias = 'token'

    def get_description(self):
        return True


class Overview(QuerysetForRoleMixin,
               listbuilderview.ViewCreateButtonMixin,
               listbuilderview.View):
    model = GenericTokenWithMetadata
    value_renderer_class = InviteItemValue

    def get_buttons_include_template(self):
        return "webdemo/inviteadmins/send_button.django.html"

    def get_no_items_message(self):
        return 'No pending invites. Click the button above to invite new administrators for the site.'

    def get_pagetitle(self):
        return 'Invite admins'
