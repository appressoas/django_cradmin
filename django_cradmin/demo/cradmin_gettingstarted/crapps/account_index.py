from django_cradmin.demo.cradmin_gettingstarted.models import Account, AccountAdministrator
from django_cradmin.viewhelpers.generic import WithinRoleTemplateView


class AccountIndexView(WithinRoleTemplateView):
    template_name = 'cradmin_gettingstarted/account_index.django.html'

    def __get_account_admin(self):
        return AccountAdministrator.objects.filter(account=self.request.cradmin_role)

    def get_context_data(self, **kwargs):
        context = super(AccountIndexView, self).get_context_data()
        context['account_admin'] = self.__get_account_admin()
        return context
