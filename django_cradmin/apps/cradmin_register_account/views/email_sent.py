from django.views.generic import TemplateView
from django_cradmin.apps.cradmin_register_account.views.begin import get_register_email_subject


class EmailSentView(TemplateView):
    template_name = 'cradmin_register_account/email_sent.django.html'

    def get_context_data(self, **kwargs):
        context = super(EmailSentView, self).get_context_data(**kwargs)
        context['email_subject'] = get_register_email_subject()
        return context
