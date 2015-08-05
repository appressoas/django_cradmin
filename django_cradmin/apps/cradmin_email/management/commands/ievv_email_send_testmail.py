from django.core.management.base import NoArgsCommand
from django_cradmin.apps.cradmin_email import emailutils


class Command(NoArgsCommand):
    def handle_noargs(self, **options):
        class DemoEmail(emailutils.AbstractEmail):
            subject_template = 'cradmin_email/cradmin_email_send_testmail/subject.django.txt'
            html_message_template = 'cradmin_email/cradmin_email_send_testmail/html_message.django.html'

        DemoEmail(recipient='post@appresso.no',
                  extra_context_data={'name': 'Test Name'}).send()
