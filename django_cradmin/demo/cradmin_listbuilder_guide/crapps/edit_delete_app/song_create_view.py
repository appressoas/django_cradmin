from django_cradmin import viewhelpers
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.edit_delete_app import mixins


class SongCreateView(mixins.SongCreateUpdateFormMixin, viewhelpers.formview.WithinRoleCreateView):
    """"""
