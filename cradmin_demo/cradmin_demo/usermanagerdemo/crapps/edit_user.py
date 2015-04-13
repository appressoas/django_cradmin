from __future__ import unicode_literals
from django.contrib.auth.models import User
from django.utils.translation import ugettext_lazy as _
from crispy_forms import layout

from django_cradmin.crispylayouts import PrimarySubmit
from django_cradmin.viewhelpers import update
from django_cradmin import crapp


class EditUserView(update.UpdateRoleView):
    """
    View used to edit the user.
    """
    model = User
    fields = [
        'username',
        'first_name',
        'last_name',
    ]

    def get_success_message(self, object):
        return _('Updated your account information.')

    def get_field_layout(self):
        return [
            layout.Div(
                'username',
                'first_name',
                'last_name',
                css_class='cradmin-globalfields'
            )
        ]

    def get_buttons(self):
        return [
            PrimarySubmit('submit-save', _('Save')),
        ]


class App(crapp.App):
    appurls = [
        crapp.Url(
            r'^$',
            EditUserView.as_view(),
            name=crapp.INDEXVIEW_NAME),
    ]
