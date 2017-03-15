from django_cradmin import viewhelpers
from django_cradmin.demo.cradmin_listbuilder_guide.models import Album


class AlbumDashboardView(viewhelpers.generic.WithinRoleTemplateView):
    template_name = 'cradmin_listbuilder_guide/album_dashboard.django.html'
