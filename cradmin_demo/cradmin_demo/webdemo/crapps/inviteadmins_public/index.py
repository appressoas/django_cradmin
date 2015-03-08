from django.template import defaultfilters
from django.utils.translation import ugettext_lazy as _

from django_cradmin.apps.cradmin_generic_token_with_metadata.models import GenericTokenWithMetadata
from django_cradmin.viewhelpers import objecttable


class TokenColumn(objecttable.MultiActionColumn):
    modelfield = 'created_datetime'

    def get_buttons(self, obj):
        return [
            objecttable.Button(
                label=_('Show'),
                url=self.reverse_appurl('show', args=[obj.id]),
                buttonclass="default"),
            objecttable.Button(
                label=_('Delete'),
                url=self.reverse_appurl('delete', args=[obj.id]),
                buttonclass="danger"),
        ]

    def render_value(self, obj):
        return defaultfilters.date(obj.created_datetime, 'SHORT_DATETIME_FORMAT')

    def get_default_order_is_ascending(self):
        return False


class ExpirationDatetimeColumn(objecttable.DatetimeColumn):
    modelfield = 'expiration_datetime'


class DescriptionColumn(objecttable.PlainTextColumn):
    modelfield = 'id'

    def get_header(self):
        return _('Description')

    def is_sortable(self):
        return False

    def render_value(self, obj):
        return obj.metadata['description']


class Overview(objecttable.ObjectTableView):
    model = GenericTokenWithMetadata
    columns = [
        TokenColumn,
        ExpirationDatetimeColumn,
        DescriptionColumn,
    ]
    searchfields = ['metadata_json', 'token']

    def get_pagetitle(self):
        return _('Public share')

    def get_queryset_for_role(self, site):
        return GenericTokenWithMetadata.objects.filter_usable_by_content_object_in_app(
            content_object=site, app='webdemo_inviteadmins_public')

    def get_buttons(self):
        app = self.request.cradmin_app
        return [
            objecttable.Button(_('Create public share link'), url=app.reverse_appurl('create')),
        ]
