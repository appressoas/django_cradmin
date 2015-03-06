from django.conf import settings
from django.core.mail import send_mail
from django.core.urlresolvers import reverse
from django.template.loader import render_to_string

from django_cradmin.apps.cradmin_generic_token_with_metadata.models import GenericTokenWithMetadata, \
    get_expiration_datetime_for_app


class InviteUrl(object):
    """
    Sends an email with a link that the user clicks to accept an invite.

    Example::

        from django_cradmin.apps.cradmin_invite.utils import InviteUrl

        class InviteUrl(InviteUrl):
            appname = 'my_app'

            def get_confirm_invite_url(self):
                return reverse('my-app-confirm-invite')

        def myview(request):
            InviteUrl(request=request, private=True).send_email(
                'test@example.com', 'test2@example.com')
            # ... or ...
            share_url = InviteUrl(request=request, private=False).get_share_url()
            # ... or ...
            InviteUrl(request=request, private=False).send_email(
                'test@example.com', 'test2@example.com', 'test3@example.com')
    """

    #: The email subject template.
    email_subject_template = 'cradmin_invite/email/subject.django.txt'

    #: The email message template.
    email_message_template = 'cradmin_invite/email/message.django.txt'

    def __init__(self, request, metadata, private):
        """
        Parameters:
            request: A Django HttpRequest object.
            private: If this is ``True`` we send unique single-use invite URLs.
            next_url: An optional URL to redirect to after the user has activated their account.
        """
        self.request = request
        self.metadata = metadata
        self.private = private

    def get_email_subject_template(self):
        return self.email_subject_template

    def get_email_message_template(self):
        return self.email_message_template

    def get_appname(self):
        """
        Get the appname for
        :obj:`django_cradmin.apps.cradmin_generic_token_with_metadata.models.GenericTokenWithMetadata.app`.

        You must override this in subclasses.
        """
        raise NotImplementedError()

    def get_confirm_invite_url(self, token):
        """
        Get the confirm invite view URL.

        Must be implemented in subclasses.

        Parameters:
            token: A :class:`~django_cradmin.apps.cradmin_generic_token_with_metadata.models.GenericTokenWithMetadata`
                object.
        """
        raise NotImplementedError()

    def __get_absolute_confirm_invite_url(self, token):
        return self.request.build_absolute_uri(self.get_confirm_invite_url(token))

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
            'DJANGO_CRADMIN_SITENAME': settings.DJANGO_CRADMIN_SITENAME,
            'confirm_invite_url': self.__get_absolute_confirm_invite_url(token)
        }

    def get_from_email(self):
        """
        Get the email sender address.

        Defaults to the ``DJANGO_CRADMIN_INVITE_FROM_EMAIL`` setting
        falling back on the ``DEFAULT_FROM_EMAIL`` setting.
        """
        return getattr(settings, 'DJANGO_CRADMIN_INVITE_FROM_EMAIL', settings.DEFAULT_FROM_EMAIL)

    def get_expiration_datetime(self):
        """
        Get the value to use for the ``expiration_datetime`` attribute of
        :class:`~django_cradmin.apps.cradmin_generic_token_with_metadata.models.GenericTokenWithMetadata`.
        """
        return get_expiration_datetime_for_app(self.get_appname())

    def _generate_token(self):
        return GenericTokenWithMetadata.objects.generate(
            app=self.get_appname(),
            expiration_datetime=self.get_expiration_datetime(),
            metadata=self.metadata
        )

    def generate_token(self):
        if self.private:
            # If private generate unique tokens
            return self._generate_token()
        else:
            # If public, re-use the same token
            if hasattr(self, '_token'):
                return self._token
            else:
                self._token = self._generate_token()
                return self._token

    def send_email(self, *emails):
        """
        Generate a token and send an email containing an absolute invite
        URL for that token.

        If this InviteUrl is private, we generate a new token each
        email recipient, and if it is public, we re-use the same
        token.
        """
        # TODO: Re-use email connection
        for email in emails:
            token = self.generate_token()
            send_mail(
                subject=self.render_email_subject(token),
                message=self.render_email_message(token),
                from_email=self.get_from_email(),
                recipient_list=[email]
            )

    def get_share_url(self):
        """
        Generate a token and return an absolute invite URL for that token.

        If this InviteUrl is private, we generate a new token each
        time this is called, and if it is public, we re-use the same
        token.
        """
        token = self.generate_token()
        return self.__get_absolute_confirm_invite_url(token)

    # def get_stored_tokens(self):
    #     return GenericTokenWithMetadata.objects.filter_not_expired().filter(app=self.get_appname())
