from django.utils.translation import ugettext_lazy as _

from django_cradmin.apps.cradmin_generic_token_with_metadata.models import GenericTokenWithMetadata
from django_cradmin.viewhelpers import objecttable


class EmailColumn(objecttable.MultiActionColumn):
    modelfield = 'id'

    def get_buttons(self, obj):
        return [
            objecttable.Button(
                label=_('Delete'),
                # url=self.reverse_appurl('delete', args=[obj.id]),
                url='#',
                buttonclass="danger"),
        ]

    def render_value(self, obj):
        return obj.metadata['email']

    def is_sortable(self):
        return False


class CreatedDatetimeColumn(objecttable.DatetimeColumn):
    modelfield = 'created_datetime'

    def get_default_order_is_ascending(self):
        return False


class ExpirationDatetimeColumn(objecttable.DatetimeColumn):
    modelfield = 'expiration_datetime'


class Overview(objecttable.ObjectTableView):
    model = GenericTokenWithMetadata
    columns = [
        EmailColumn,
        CreatedDatetimeColumn,
        ExpirationDatetimeColumn
    ]
    searchfields = ['metadata_json']

    def get_pagetitle(self):
        return _('Invite admins')

    def get_queryset_for_role(self, site):
        return GenericTokenWithMetadata.objects.filter_usable_by_content_object_in_app(
            content_object=site, app='webdemo_invite_siteadmin')

    def get_buttons(self):
        app = self.request.cradmin_app
        return [
            objecttable.Button(_('Send private invite'), url=app.reverse_appurl('sendprivate')),
        ]
