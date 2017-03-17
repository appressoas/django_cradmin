from django_cradmin import uicontainer
from django_cradmin import viewhelpers
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.song_app.song_mixin import SongCreateEditMixin
from django_cradmin.demo.cradmin_listbuilder_guide.models import Song


class SongCreateView(SongCreateEditMixin,viewhelpers.formview.WithinRoleCreateView):
    """"""
