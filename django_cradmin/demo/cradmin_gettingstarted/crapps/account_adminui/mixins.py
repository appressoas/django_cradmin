from django_cradmin import uicontainer
from django_cradmin.demo.cradmin_gettingstarted.models import Account


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