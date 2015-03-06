from django.core.exceptions import PermissionDenied

from django.shortcuts import render
from django.views.generic import TemplateView

from django_cradmin.apps.cradmin_generic_token_with_metadata.models import GenericTokenWithMetadata, \
    GenericTokenExpiredError


class AbstractAcceptInviteView(TemplateView):
    template_name = 'cradmin_invite/accept/accept.django.html'
    token_error_template_name = 'cradmin_invite/accept/token_error.django.html'

    #: The template used to render the title of the invite.
    #: The template context is the one returned by the get_context_data()
    #: method of this view.
    title_template = 'cradmin_invite/accept/title.django.html'

    #: The template used to render the description of the invite.
    #: The template context is the one returned by the get_context_data()
    #: method of this view.
    description_template = 'cradmin_invite/accept/description.django.html'

    def get_appname(self):
        raise NotImplementedError()

    def dispatch(self, request, *args, **kwargs):
        try:
            token = GenericTokenWithMetadata.objects.get_and_validate(
                token=self.kwargs['token'], app=self.get_appname())
        except GenericTokenWithMetadata.DoesNotExist:
            return self.token_error_response(token_does_not_exist=True)
        except GenericTokenExpiredError:
            return self.token_error_response(token_expired=True)
        else:
            self.token = token
            return super(AbstractAcceptInviteView, self).dispatch(request, *args, **kwargs)

    def token_error_response(self, token_does_not_exist=False, token_expired=False):
        return render(self.request, self.token_error_template_name, {
            'token_does_not_exist': token_does_not_exist,
            'token_expired': token_expired
        })

    def get_context_data(self, **kwargs):
        context = super(AbstractAcceptInviteView, self).get_context_data(**kwargs)
        context['title_template'] = self.title_template
        context['description_template'] = self.description_template
        return context

    def post(self, request):
        if self.request.user.is_authenticated():
            return self.invite_accepted(self.token)
        else:
            raise PermissionDenied()

    def invite_accepted(self, token):
        """
        Called on POST when the invite has been accepted
        by the user.

        At this point, ``self.request.user`` is the user accepting the invite.
        """
        raise NotImplementedError()
