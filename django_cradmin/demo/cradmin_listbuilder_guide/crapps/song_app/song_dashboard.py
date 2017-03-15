from django_cradmin import viewhelpers


class SingleDashboardView(viewhelpers.generic.WithinRoleTemplateView):
    template_name = 'cradmin_listbuilder_guide/crapps/song_app/song_dashbaord.django.html'
