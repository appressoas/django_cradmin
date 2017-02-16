from django_cradmin.viewhelpers.generic import WithinRoleTemplateView


class AccountIndexView(WithinRoleTemplateView):
    template_name = 'cradmin_gettingstarted/account.index.django.html'
