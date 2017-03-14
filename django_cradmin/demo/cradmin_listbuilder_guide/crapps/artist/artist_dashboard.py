from django_cradmin import viewhelpers


class ArtistBashboard(viewhelpers.generic.WithinRoleTemplateView):
    template_name = 'cradmin_listbuilder_guide/artist_dashboard.django.html'

