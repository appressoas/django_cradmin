from django import forms
from crispy_forms import layout
from django.utils.translation import ugettext_lazy as _

from django_cradmin import crapp
from django_cradmin.crispylayouts import PrimarySubmit
from django_cradmin.formfields.email_list import EmailListField
from django_cradmin.viewhelpers.formbase import FormView


class InviteEmailsForm(forms.Form):
    emails = EmailListField()


class InviteAdmins(FormView):
    form_class = InviteEmailsForm
    template_name = 'webdemo/inviteadmins.django.html'

    def get_field_layout(self):
        return [
            layout.Div(
                'emails',
                css_class='cradmin-globalfields'
            )
        ]

    def get_buttons(self):
        return [
            PrimarySubmit('submit', _('Send invite')),
        ]


class App(crapp.App):
    appurls = [
        crapp.Url(r'^$', InviteAdmins.as_view(), name=crapp.INDEXVIEW_NAME)
    ]
