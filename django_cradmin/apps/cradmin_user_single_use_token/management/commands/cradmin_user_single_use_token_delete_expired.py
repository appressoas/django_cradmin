from django.core.management.base import NoArgsCommand
from django_cradmin.apps.cradmin_user_single_use_token.models import UserSingleUseToken


class Command(NoArgsCommand):
    help = 'Delete all expired UserSingleUseToken objects from the database.'

    def handle_noargs(self, **options):
        UserSingleUseToken.objects.delete_expired()
