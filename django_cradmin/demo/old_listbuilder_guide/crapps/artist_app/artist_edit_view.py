from django_cradmin import viewhelpers
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.artist_app.artist_mixin import ArtistCreateEditMixin, \
    ArtistQuerysetForRoleMixin


class ArtistEditView(ArtistQuerysetForRoleMixin, ArtistCreateEditMixin, viewhelpers.formview.WithinRoleUpdateView):
    """"""

