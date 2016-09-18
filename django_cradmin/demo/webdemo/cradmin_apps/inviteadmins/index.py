from django_cradmin.apps.cradmin_generic_token_with_metadata.models import GenericTokenWithMetadata
from django_cradmin.viewhelpers import listbuilder
from django_cradmin.viewhelpers import listbuilderview

from .mixins import QuerysetForRoleMixin


# class EmailColumn(objecttable.MultiActionColumn):
#     modelfield = 'id'
#
#     def get_header(self):
#         return _('Email')
#
#     def get_buttons(self, obj):
#         return [
#             objecttable.Button(
#                 label=_('Delete'),
#                 url=self.reverse_appurl('delete', args=[obj.id]),
#                 buttonclass="btn btn-danger btn-sm"),
#         ]
#
#     def render_value(self, obj):
#         return obj.metadata['email']
#
#     def is_sortable(self):
#         return False
#
#
# class CreatedDatetimeColumn(objecttable.DatetimeColumn):
#     modelfield = 'created_datetime'
#
#     def get_default_ordering(self):
#         return None
#
#
# class ExpirationDatetimeColumn(objecttable.DatetimeColumn):
#     modelfield = 'expiration_datetime'


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

    # def get_buttons(self):
    #     app = self.request.cradmin_app
    #     return [
    #         objecttable.Button(label=_('Send private invite'),
    #                            url=app.reverse_appurl('send'),
    #                            buttonclass='btn btn-primary'),
    #     ]
