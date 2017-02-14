from __future__ import unicode_literals
from django.conf import settings
from django.core.urlresolvers import reverse
from django.utils.module_loading import import_string

from django.views.generic import FormView

from django_cradmin import javascriptregistry
from django_cradmin.apps.cradmin_activate_account.utils import ActivationEmail


class BeginRegisterAccountView(FormView, javascriptregistry.viewmixin.StandaloneBaseViewMixin):
    template_name = 'cradmin_register_account/begin.django.html'

    def get_form_class(self):
        if self.form_class:
            return self.form_class
        else:
            return import_string(settings.DJANGO_CRADMIN_REGISTER_ACCOUNT_FORM_CLASS)

    def get_context_data(self, **kwargs):
        context = super(BeginRegisterAccountView, self).get_context_data(**kwargs)
        self.add_javascriptregistry_component_ids_to_context(context=context)
        form = context['form']
        context['form_renderable'] = form.get_form_renderable()
        context['DJANGO_CRADMIN_SITENAME'] = settings.DJANGO_CRADMIN_SITENAME
        return context

    def get_success_url(self):
        """
        Get the next url to go to after the user has been created.

        Defaults to the ``DJANGO_CRADMIN_REGISTER_ACCOUNT_REDIRECT_URL``, falling back to
        the ``LOGIN_URL`` setting.
        """
        if 'next' in self.request.GET:
            return self.request.GET['next']
        else:
            return getattr(settings, 'DJANGO_CRADMIN_REGISTER_ACCOUNT_REDIRECT_URL', settings.LOGIN_URL)

    def form_valid(self, form):
        form.save()
        return super(BeginRegisterAccountView, self).form_valid(form)
