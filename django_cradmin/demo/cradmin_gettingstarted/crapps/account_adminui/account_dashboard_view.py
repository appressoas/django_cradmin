from django_cradmin.demo.cradmin_gettingstarted.models import AccountAdministrator
from django_cradmin.viewhelpers.generic import WithinRoleTemplateView


class AccountDashboardView(WithinRoleTemplateView):
    template_name = 'cradmin_gettingstarted/account_dashboard.django.html'

    @property
    def account(self):
        return self.request.cradmin_role

    def __get_account(self):
        return self.account

    def __get_account_admin(self):
        return AccountAdministrator.objects.get(pk=self.account.id)

    def get_context_data(self, **kwargs):
        context = super(AccountDashboardView, self).get_context_data()
        context['account_admin'] = self.__get_account_admin()
        context['account'] = self.__get_account()
        return context
