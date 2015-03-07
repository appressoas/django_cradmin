from django.core.exceptions import PermissionDenied
from django.core.urlresolvers import reverse

from django.shortcuts import render
from django.utils.http import urlencode
from django.views.generic import TemplateView

from django_cradmin.apps.cradmin_generic_token_with_metadata.models import GenericTokenWithMetadata, \
    GenericTokenExpiredError


class AbstractAcceptInviteView(TemplateView):
    """
    Base class for views that accept invites from
    :class:`~django_cradmin.apps.cradmin_invite.invite_url.InviteUrl`.

    You have to override:

    - :meth:`~.AbstractAcceptInviteView.get_appname`.
    - :meth:`~.AbstractAcceptInviteView.invite_accepted`.
    """

    template_name = 'cradmin_invite/accept/accept.django.html'

    #: The template used to render the title of the invite.
    #: The template context is the one returned by :meth:`~AbstractAcceptInviteView.get_context_data`.
    title_template = 'cradmin_invite/accept/title.django.html'

    #: The template used to render the description of the invite.
    #: The template context is the one returned by :meth:`~AbstractAcceptInviteView.get_context_data`.
    description_template = 'cradmin_invite/accept/description.django.html'

    #: The template used to render the view when the given token does not
    #: validate. If you just want to change the error messages, you can extend
    #: the ``cradmin_invite/accept/token_error.django.html`` template and override
    #: the ``invalid_token_message`` and ``expired_token_message`` blocks.
    token_error_template_name = 'cradmin_invite/accept/token_error.django.html'

    def get_appname(self):
        """
        Get the name of the appname. Must match the appname returned by the
        :class:`~django_cradmin.apps.cradmin_invite.invite_url.InviteUrl.get_appname`
        method of your :class:`~django_cradmin.apps.cradmin_invite.invite_url.InviteUrl`
        subclass.
        """
        raise NotImplementedError()

    def dispatch(self, request, *args, **kwargs):
        """
        Takes care of validating the token for both GET and POST
        requests.

        If the token is valid, we set ``self.generic_token`` to the
        :class:`~django_cradmin.apps.cradmin_generic_token_with_metadata.models.GenericTokenWithMetadata`.
        """
        try:
            generictoken = GenericTokenWithMetadata.objects.get_and_validate(
                token=self.kwargs['token'], app=self.get_appname())
        except GenericTokenWithMetadata.DoesNotExist:
            return self.token_error_response(token_does_not_exist=True)
        except GenericTokenExpiredError:
            return self.token_error_response(token_expired=True)
        else:
            self.generictoken = generictoken
            return super(AbstractAcceptInviteView, self).dispatch(request, *args, **kwargs)

    def token_error_response(self, token_does_not_exist=False, token_expired=False):
        return render(self.request, self.token_error_template_name, {
            'token_does_not_exist': token_does_not_exist,
            'token_expired': token_expired
        })

    def add_next_argument_to_url(self, url, next=None):
        return '{url}?{arguments}'.format(
            url=url,
            arguments=urlencode({
                'next': next or self.request.path
            })
        )

    def get_create_new_user_url(self):
        """
        Get the URL to used to create a new user.

        Should have some way of returning the user to this view after
        the user has been created.

        Defaults to the ``cradmin-register-account-begin`` view in
        ``django_cradmin.apps.cradmin_register_account``.
        """
        return self.add_next_argument_to_url(reverse('cradmin-register-account-begin'))

    def get_login_url(self):
        """
        Get the URL to used to login if not already authenticated.

        Should have some way of returning the user to this view after
        login is complete.

        Defaults to the ``cradmin-authenticate-login`` view in ``django_cradmin.apps.cradmin_authenticate``.
        """
        return self.add_next_argument_to_url(reverse('cradmin-authenticate-login'))

    def get_login_as_different_user_url(self):
        """
        Get the URL to used to login as a different user.

        Should have some way of returning the user to this view after
        login is complete.

        Defaults to the ``cradmin-authenticate-logout`` view in ``django_cradmin.apps.cradmin_authenticate``
        with the next-argument set to the ``cradmin-authenticate-login`` view in the same app, with the next
        argument of the ``cradmin-authenticate-login`` view set to the current url.
        """
        return self.add_next_argument_to_url(
            url=reverse('cradmin-authenticate-logout'),
            next=self.get_login_url())

    def get_context_data(self, **kwargs):
        context = super(AbstractAcceptInviteView, self).get_context_data(**kwargs)
        context['title_template'] = self.title_template
        context['description_template'] = self.description_template
        context['create_new_user_url'] = self.get_create_new_user_url()
        context['login_url'] = self.get_login_url()
        context['login_as_different_user_url'] = self.get_login_as_different_user_url()
        return context

    def post(self, *args, **kwargs):
        """
        If the user is authenticated, we return :meth:`~.AbstractAcceptInviteView.invite_accepted`.
        If the user is not authenticated, we raise :exc:`django.core.exceptions.PermissionDenied`.
        """
        if self.request.user.is_authenticated():
            return self.invite_accepted(self.generictoken)
        else:
            raise PermissionDenied()

    def invite_accepted(self, token):
        """
        Called on POST when the invite has been accepted
        by the user.

        At this point, ``self.request.user`` is the user accepting the invite.
        """
        raise NotImplementedError()
