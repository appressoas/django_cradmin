from django.http import HttpResponseRedirect
from django.views.generic import TemplateView

from django_cradmin.apps.cradmin_generic_token_with_metadata.models import GenericTokenWithMetadata, \
    GenericTokenExpiredError


class ActivateAccountView(TemplateView):
    template_name = 'cradmin_activate_account/activate.django.html'
    appname = 'cradmin_activate_account'
    
    def get(self, *args, **kwargs):
        self.token_does_not_exist = False
        self.token_expired = False
        try:
            token = GenericTokenWithMetadata.objects.get_and_validate(
                token=self.kwargs['token'], app=self.appname)
        except GenericTokenWithMetadata.DoesNotExist:
            self.token_does_not_exist = True
        except GenericTokenExpiredError:
            self.token_expired = True
        else:
            return self.token_is_valid(token)
        return super(ActivateAccountView, self).get(*args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(ActivateAccountView, self).get_context_data(**kwargs)
        context['token_does_not_exist'] = self.token_does_not_exist
        context['token_expired'] = self.token_expired
        return context

    def activate_user(self, user):
        """
        Activate the user.

        You can override this to provide custom user activation code,
        but you will most likely want to override the ``activate_user()``
        method of your User model if you have a custom user model.
        """
        if hasattr(user, 'activate_user'):
            user.activate_user()
        else:
            user.is_active = True
        user.save()

    def token_is_valid(self, token):
        user = token.user
        next_url = token.get_metadata()['next_url']
        self.activate_user(user)
        return HttpResponseRedirect(next_url)
