from django_cradmin import uicontainer
from django_cradmin.demo.cradmin_gettingstarted.crapps.account_adminui import mixins
from django_cradmin.demo.cradmin_gettingstarted.models import Account
from django_cradmin.viewhelpers import formview


class AccountUpdateView(mixins.AccountCreateUpdateMixin, formview.WithinRoleUpdateView):
    """
    View for editing the Account
    """
    def get_queryset_for_role(self):
        return Account.objects.filter(id=self.request.cradmin_role.pk)
