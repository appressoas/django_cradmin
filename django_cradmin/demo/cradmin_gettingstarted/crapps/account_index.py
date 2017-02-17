from django.db.models import Prefetch

from django_cradmin.demo.cradmin_gettingstarted.models import Account, AccountAdministrator
from django_cradmin.viewhelpers.generic import WithinRoleTemplateView


class AccountIndexView(WithinRoleTemplateView):
    template_name = 'cradmin_gettingstarted/account.index.django.html'

    def __get_accounts(self):
        return Account.objects.all()

    def get_context_data(self, **kwargs):
        context = super(AccountIndexView, self).get_context_data()
        context['accounts'] = self.__get_accounts()
        return context
