
from django_cradmin import viewhelpers
from django_cradmin.demo.cradmin_gettingstarted.models import AccountAdministrator


class CreateAccountDashboardView(viewhelpers.generic.StandaloneBaseTemplateView):
    template_name = 'cradmin_gettingstarted/create_account_dashboard.django.html'

    def __get_user(self):
        if self.request.user.is_authenticated:
            user_email = self.request.user.email
            return user_email

    def get_context_data(self, **kwargs):
        context = super(CreateAccountDashboardView, self).get_context_data()
        context['user'] = self.__get_user()
        return context
