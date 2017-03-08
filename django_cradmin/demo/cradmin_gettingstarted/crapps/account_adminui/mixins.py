from django_cradmin import uicontainer
from django_cradmin.demo.cradmin_gettingstarted.models import Account, Message


class AccountCreateUpdateMixin(object):
    """
    Mixin class which renders the form used update and create view in the Account Admin ui.
    """
    model = Account
    roleid_field = 'account'
    fields = [
        'name'
    ]

    def get_form_renderable(self):
        return uicontainer.layout.AdminuiPageSectionTight(
            children=[
                uicontainer.form.Form(
                    form=self.get_form(),
                    children=[
                        uicontainer.fieldwrapper.FieldWrapper('name'),
                        uicontainer.button.SubmitPrimary(
                            text='Save')
                    ]
                )
            ]
        ).bootstrap()


class MessageCreateUpdateMixin(object):
    """
    Mixin class for create and edit view for messages in account admin UI
    """
    model = Message
    roleid_field = 'account'
    fields = [
        'title',
        'body'
    ]

    def get_form_renderable(self):
        return uicontainer.layout.AdminuiPageSectionTight(
            children=[
                uicontainer.form.Form(
                    form=self.get_form(),
                    children=[
                        uicontainer.fieldwrapper.FieldWrapper('title'),
                        uicontainer.fieldwrapper.FieldWrapper('body'),
                        uicontainer.button.SubmitPrimary(
                            text='Save')
                    ]
                )
            ]
        ).bootstrap()