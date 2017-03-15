from django_cradmin import viewhelpers


class ArtistBashboardView(viewhelpers.generic.WithinRoleTemplateView):
    template_name = 'cradmin_listbuilder_guide/artist_dashboard.django.html'

