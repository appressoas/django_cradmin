from __future__ import unicode_literals
from django.views.generic import TemplateView

from django_cradmin import javascriptregistry


class EmailSentView(TemplateView, javascriptregistry.viewmixin.StandaloneBaseViewMixin):
    template_name = 'cradmin_register_account/email_sent.django.html'

    def get_context_data(self, **kwargs):
        context = super(EmailSentView, self).get_context_data(**kwargs)
        self.add_javascriptregistry_component_ids_to_context(context=context)
        return context
