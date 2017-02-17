from django_cradmin import uicontainer
from django_cradmin.demo.cradmin_gettingstarted.models import Account
from django_cradmin.viewhelpers import formview


class AccountCreateView(formview.WithinRoleCreateView):
    """"""
    model = Account
    roleid_field = 'account'
    fields = [
        'account_name'
    ]

    def get_form_renderable(self):
        return uicontainer.layout.AdminuiPageSectionTight(
            children=[
                uicontainer.form.Form(
                    form=self.get_form(),
                    children=[
                        uicontainer.fieldwrapper.FieldWrapper('account_name'),
                        uicontainer.button.SubmitPrimary(text='Save')
                    ]
                )
            ]
        ).bootstrap()

