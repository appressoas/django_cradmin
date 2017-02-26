from django_cradmin.demo.cradmin_gettingstarted.models import Account
from django_cradmin.viewhelpers import formview


class AccountDeleteView(formview.WithinRoleDeleteView):
    """
    View for deleting an account.
    """
    model = Account

    def get_object(self):
        return self.request.cradmin_role

    def get_queryset_for_role(self):
        return Account.objects.filter(id=self.request.cradmin_role.pk)
