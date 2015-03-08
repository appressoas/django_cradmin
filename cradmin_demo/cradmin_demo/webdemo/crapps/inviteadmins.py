from django import forms
from crispy_forms import layout
from django.conf import settings
from django.contrib import messages
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.utils.translation import ugettext_lazy as _
from cradmin_demo.webdemo.models import Site

from django_cradmin import crapp
from django_cradmin.apps.cradmin_invite.baseviews.accept import AbstractAcceptInviteView
from django_cradmin.apps.cradmin_invite.invite_url import InviteUrl
from django_cradmin.crispylayouts import PrimarySubmit
from django_cradmin.formfields.email_list import EmailListField
from django_cradmin.viewhelpers.formbase import FormView


class InviteEmailsForm(forms.Form):
    emails = EmailListField()


class AcceptSiteAdminInviteView(AbstractAcceptInviteView):
    description_template_name = 'myapp/invite_description.django.html'

    def get_appname(self):
        return 'myapp'

    def invite_accepted(self, token):
        site = get_object_or_404(Site, id=token.metadata['site_id'])
        site.admins.add(self.request.user)
        messages.success(self.request, 'You are now admin on %(site)s' % {'site': site})
        return HttpResponseRedirect(settings.LOGIN_URL)


class SiteAdminInviteUrl(InviteUrl):
    def get_appname(self):
        return 'webdemo_invite_siteadmin'

    def get_confirm_invite_url(self, generictoken):
        return reverse('webdemo-inviteadmins-accept', kwargs={
            'token': generictoken.token
        })


class SendPrivateInvites(FormView):
    form_class = InviteEmailsForm
    template_name = 'webdemo/inviteadmins.django.html'

    def get_field_layout(self):
        return [
            layout.Div(
                layout.Field('emails', placeholder='joe@example.com\njane@example.com'),
                css_class='cradmin-globalfields'
            )
        ]

    def get_buttons(self):
        return [
            PrimarySubmit('submit', _('Send invites')),
        ]

    def form_valid(self, form):
        emails = form.cleaned_data['emails']
        site = self.request.cradmin_role
        inviteurl = SiteAdminInviteUrl(request=self.request, private=True, metadata={
            'site_id': site.id
        })
        inviteurl.send_email(*emails)
        return HttpResponseRedirect(self.request.path)


class App(crapp.App):
    appurls = [
        crapp.Url(r'^$', SendPrivateInvites.as_view(), name=crapp.INDEXVIEW_NAME)
    ]
