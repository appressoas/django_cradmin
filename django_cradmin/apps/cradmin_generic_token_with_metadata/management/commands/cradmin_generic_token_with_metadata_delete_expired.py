from __future__ import unicode_literals
from django.core.management.base import NoArgsCommand
from django_cradmin.apps.cradmin_generic_token_with_metadata.models import GenericTokenWithMetadata


class Command(NoArgsCommand):
    help = 'Delete all expired GenericTokenWithMetadata objects from the database.'

    def handle_noargs(self, **options):
        GenericTokenWithMetadata.objects.delete_expired()
