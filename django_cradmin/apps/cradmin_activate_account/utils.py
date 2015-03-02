from django.conf import settings
from django.core.mail import send_mail
from django.core.urlresolvers import reverse
from django.template.loader import render_to_string
from django_cradmin.apps.cradmin_generic_token_with_metadata.models import GenericTokenWithMetadata, \
    get_expiration_datetime_for_app


class ActivationEmail(object):
    email_subject_template = 'cradmin_activate_account/email/subject.django.txt'
    email_message_template = 'cradmin_activate_account/email/message.django.txt'
    appname = 'cradmin_activate_account'

    def __init__(self, request, user, next_url=None):
        self.user = user
        self.request = request
        self.next_url = next_url or getattr(
            settings, 'DJANGO_CRADMIN_ACTIVATE_ACCOUNT_DEFAULT_NEXT_URL', settings.LOGIN_URL)

    def get_email_subject_template(self):
        return self.email_subject_template

    def get_email_message_template(self):
        return self.email_message_template

    def get_activate_url(self, token):
        return reverse('cradmin-activate-account-activate', kwargs={
            'token': token.token
        })

    def render_email_subject(self, token):
        return render_to_string(
            self.get_email_subject_template(),
            self.get_email_template_context_data(token)
        ).strip()

    def render_email_message(self, token):
        return render_to_string(
            self.get_email_message_template(),
            self.get_email_template_context_data(token)
        ).strip()

    def get_email_template_context_data(self, token):
        return {
            'user': self.user,
            'DJANGO_CRADMIN_SITENAME': settings.DJANGO_CRADMIN_SITENAME,
            'activate_url': self.request.build_absolute_uri(self.get_activate_url(token))
        }

    def get_from_email(self):
        return getattr(settings, 'DJANGO_CRADMIN_ACTIVATE_ACCOUNT_FROM_EMAIL', settings.DEFAULT_FROM_EMAIL)

    def get_expiration_datetime(self):
        return get_expiration_datetime_for_app(self.appname)

    def generate_token(self):
        return GenericTokenWithMetadata.objects.generate(
            user=self.user,
            app=self.appname,
            expiration_datetime=self.get_expiration_datetime(),
            metadata={
                'next_url': self.next_url
            }
        )

    def send(self):
        token = self.generate_token()
        send_mail(
            subject=self.render_email_subject(token),
            message=self.render_email_message(token),
            from_email=self.get_from_email(),
            recipient_list=[self.user.email]
        )
