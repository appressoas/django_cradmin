
from django_cradmin import viewhelpers
from django_cradmin.demo.cradmin_gettingstarted.models import AccountAdministrator


class DashboardView(viewhelpers.generic.WithinRoleTemplateView):
    template_name = 'cradmin_gettingstarted/create_account.django.html'

    def __get_account_admin(self):
        if self.request.user.is_authenticated:
            user_email = self.request.user.email
            return user_email

    def get_context_data(self, **kwargs):
        context = super(DashboardView, self).get_context_data()
        context['account_admin'] = self.__get_account_admin()
        return context
