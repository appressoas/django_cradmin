from django.views.generic import TemplateView
from django_cradmin.apps.cradmin_resetpassword.views.begin import get_password_reset_email_subject


class EmailSentView(TemplateView):
    template_name = 'cradmin_passwordreset/email_sent.django.html'

    def get_context_data(self, **kwargs):
        context = super(EmailSentView, self).get_context_data(**kwargs)
        context['email_subject'] = get_password_reset_email_subject()
        return context
