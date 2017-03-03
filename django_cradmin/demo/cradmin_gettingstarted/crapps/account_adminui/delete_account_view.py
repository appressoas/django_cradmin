from django_cradmin.crinstance import reverse_cradmin_url
from django_cradmin.demo.cradmin_gettingstarted.models import Account
from django_cradmin.viewhelpers import formview


class AccountDeleteView(formview.WithinRoleDeleteView):
    """
    View for deleting an account.
    """
    model = Account

    def get_object(self, queryset=None):
        return self.request.cradmin_role

    def get_queryset_for_role(self):
        return Account.objects.filter(id=self.request.cradmin_role.pk)

    def get_success_url(self):
        return reverse_cradmin_url(instanceid='create_account', appname='dashboard')
