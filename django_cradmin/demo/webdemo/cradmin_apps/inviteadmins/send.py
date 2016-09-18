from django import forms
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.utils.translation import ugettext_lazy as _
from django_cradmin import uicontainer
from django_cradmin.apps.cradmin_invite.invite_url import InviteUrl
from django_cradmin.formfields.email_list import EmailListField
from django_cradmin.viewhelpers import formview


class InviteEmailsForm(forms.Form):
    emails = EmailListField(
        label=_('Email addresses to send invites to'),
        extra_help_text=_('We will send a separate invite to each of the email addresses you provide.')
    )


class SiteAdminInviteUrl(InviteUrl):
    def get_appname(self):
        return 'webdemo_inviteadmins'

    def get_confirm_invite_url(self, generictoken):
        return reverse('webdemo-inviteadmins-accept', kwargs={
            'token': generictoken.token
        })


class SendInvitesView(formview.FormView):
    form_class = InviteEmailsForm
    template_name = 'webdemo/inviteadmins/send_private_invite.django.html'

    def get_uicontainer(self):
        return uicontainer.form.Form(
            form=self.get_form(),
            children=[
                uicontainer.button.SubmitPrimary(
                    text='Send invites')
            ]
        ).bootstrap()

    def form_valid(self, form):
        emails = form.cleaned_data['emails']
        site = self.request.cradmin_role
        inviteurl = SiteAdminInviteUrl(request=self.request, private=True, content_object=site)
        inviteurl.send_email(*emails)
        return HttpResponseRedirect(self.get_success_url())
