from django_cradmin.demo.cradmin_gettingstarted.models import AccountAdministrator
from django_cradmin.viewhelpers.generic import WithinRoleTemplateView


class AccountDashboardView(WithinRoleTemplateView):
    template_name = 'cradmin_gettingstarted/crapps/account_adminui/account_dashboard.django.html'

    def __get_account_admin(self):
        return AccountAdministrator.objects.get(pk=self.request.cradmin_role.id)

    def get_context_data(self, **kwargs):
        context = super(AccountDashboardView, self).get_context_data()
        context['account_admin'] = self.__get_account_admin()
        context['account'] = self.request.cradmin_role
        return context
