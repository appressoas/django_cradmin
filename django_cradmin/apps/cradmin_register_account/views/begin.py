from django.conf import settings
from django.core.urlresolvers import reverse
from django.utils.module_loading import import_string

from django.views.generic import FormView

from django_cradmin.apps.cradmin_activate_account.utils import ActivationEmail


class BeginRegisterAccountView(FormView):
    template_name = 'cradmin_register_account/begin.django.html'

    def get_form_class(self):
        if self.form_class:
            return self.form_class
        else:
            return import_string(settings.DJANGO_CRADMIN_REGISTER_ACCOUNT_FORM_CLASS)

    def get_context_data(self, **kwargs):
        context = super(BeginRegisterAccountView, self).get_context_data(**kwargs)
        context['DJANGO_CRADMIN_SITENAME'] = settings.DJANGO_CRADMIN_SITENAME
        return context

    def get_success_url(self):
        return reverse('cradmin-register-account-email-sent')

    def send_activation_email(self, user):
        next_url = '/'  # TODO: Handle this
        activation_email = ActivationEmail(request=self.request, user=user, next_url=next_url)
        activation_email.send()

    def form_valid(self, form):
        user = form.save()
        self.send_activation_email(user)
        return super(BeginRegisterAccountView, self).form_valid(form)
