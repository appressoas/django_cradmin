from django_cradmin import viewhelpers


class DashboardView(viewhelpers.generic.WithinRoleTemplateView):
    template_name = 'no_role_demo/dashboard.django.html'
