from crispy_forms import layout
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.core.urlresolvers import reverse
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string

from django.utils.translation import ugettext_lazy as _
from django import forms
from django.views.generic import FormView
from crispy_forms.helper import FormHelper
from django_cradmin.apps.cradmin_generic_token_with_metadata.models import GenericTokenWithMetadata, \
    get_expiration_datetime_for_app

from django_cradmin.crispylayouts import PrimarySubmitLg


def get_password_reset_email_subject():
    return render_to_string('cradmin_resetpassword/email/subject.django.txt', {
        'DJANGO_CRADMIN_SITENAME': settings.DJANGO_CRADMIN_SITENAME
    }).strip()


class EmailForm(forms.Form):
    email = forms.EmailField()

    def clean_email(self):
        email = self.cleaned_data['email']
        user_model = get_user_model()
        if not user_model.objects.filter(email=email).exists():
            raise forms.ValidationError("No account with this email address found")
        return email


class BeginPasswordResetView(FormView):
    template_name = 'cradmin_resetpassword/begin.django.html'
    form_class = EmailForm

    def get_formhelper(self):
        helper = FormHelper()
        helper.form_action = '#'
        helper.form_id = 'django_cradmin_resetpassword_begin_form'
        helper.form_show_labels = False
        helper.layout = layout.Layout(
            layout.Field('email', css_class='input-lg', placeholder=_('Email')),
            PrimarySubmitLg('submit', _('Search'))
        )
        return helper

    def get_context_data(self, **kwargs):
        context = super(BeginPasswordResetView, self).get_context_data(**kwargs)
        context['formhelper'] = self.get_formhelper()
        return context

    def get_success_url(self):
        return reverse('cradmin-resetpassword-email-sent')

    def __get_email_message(self, user, reset_url):
        return render_to_string('cradmin_resetpassword/email/message.django.txt', {
            'DJANGO_CRADMIN_SITENAME': settings.DJANGO_CRADMIN_SITENAME,
            'user': user,
            'reset_url': reset_url
        }).strip()

    def __send_email(self, user, reset_url):
        send_mail(
            subject=get_password_reset_email_subject(),
            message=self.__get_email_message(user=user, reset_url=reset_url),
            from_email=getattr(settings, 'DJANGO_CRADMIN_RESETPASSWORD_FROM_EMAIL', settings.DEFAULT_FROM_EMAIL),
            recipient_list=[user.email])

    def _generate_token(self, user):
        return GenericTokenWithMetadata.objects.generate(
            app='cradmin_resetpassword',
            user=user,
            expiration_datetime=get_expiration_datetime_for_app('cradmin_resetpassword')
        ).token

    def __generate_reset_url(self, user):
        reset_url = reverse('cradmin-resetpassword-reset', kwargs={
            'token': self._generate_token(user)
        })
        return self.request.build_absolute_uri(reset_url)

    def form_valid(self, form):
        email = form.cleaned_data['email']
        user_model = get_user_model()
        user = get_object_or_404(user_model, email=email)
        reset_url = self.__generate_reset_url(user=user)
        self.__send_email(user=user, reset_url=reset_url)
        return super(BeginPasswordResetView, self).form_valid(form)
