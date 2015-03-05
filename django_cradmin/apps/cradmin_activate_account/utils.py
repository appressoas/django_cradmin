from django.conf import settings
from django.core.mail import send_mail
from django.core.urlresolvers import reverse
from django.template.loader import render_to_string

from django_cradmin.apps.cradmin_generic_token_with_metadata.models import GenericTokenWithMetadata, \
    get_expiration_datetime_for_app


class ActivationEmail(object):
    """
    Handles account activation. Sends an email with a link that
    the user clicks to activate their account.

    Example::

        from django_cradmin.apps.cradmin_activate_account.utils import ActivationEmail

        def myview(request):
            someuser = get_some_user()  # Insert your code to determine the user to activate here
            ActivationEmail(request=request, user=someuser).send()
    """

    #: The email subject template.
    email_subject_template = 'cradmin_activate_account/email/subject.django.txt'

    #: The email message template.
    email_message_template = 'cradmin_activate_account/email/message.django.txt'

    #: The name of the app. Used for
    #: :obj:`django_cradmin.apps.cradmin_generic_token_with_metadata.models.GenericTokenWithMetadata.app`.
    #: If you override this, you also have to override :meth:`~.ActivationEmail.get_activate_url`
    #: and return the URL to a view that pops a GenericTokenWithMetadata with the
    #: changed appname.
    appname = 'cradmin_activate_account'

    def __init__(self, request, user, next_url=None):
        """
        Parameters:
            request: A Django HttpRequest object.
            user: The user you want to activate. Must have an ``email`` attribute or property.
            next_url: An optional URL to redirect to after the user has activated their account.
        """
        self.user = user
        self.request = request
        self.next_url = next_url or getattr(
            settings, 'DJANGO_CRADMIN_ACTIVATE_ACCOUNT_DEFAULT_NEXT_URL', settings.LOGIN_URL)

    def get_email_subject_template(self):
        return self.email_subject_template

    def get_email_message_template(self):
        return self.email_message_template

    def get_activate_url(self, token):
        """
        Get the activate account view URL.
        """
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
        """
        Get the context data of the email templates.
        """
        return {
            'user': self.user,
            'DJANGO_CRADMIN_SITENAME': settings.DJANGO_CRADMIN_SITENAME,
            'activate_url': self.request.build_absolute_uri(self.get_activate_url(token))
        }

    def get_from_email(self):
        """
        Get the email sender address.

        Defaults to the ``DJANGO_CRADMIN_ACTIVATE_ACCOUNT_FROM_EMAIL`` setting
        falling back on the ``DEFAULT_FROM_EMAIL`` setting.
        """
        return getattr(settings, 'DJANGO_CRADMIN_ACTIVATE_ACCOUNT_FROM_EMAIL', settings.DEFAULT_FROM_EMAIL)

    def get_expiration_datetime(self):
        """
        Get the value to use for the ``expiration_datetime`` attribute of
        :class:`~django_cradmin.apps.cradmin_generic_token_with_metadata.models.GenericTokenWithMetadata`.
        """
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
