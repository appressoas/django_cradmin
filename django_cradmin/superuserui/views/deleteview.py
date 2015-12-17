from django_cradmin.superuserui.views import mixins
from django_cradmin.viewhelpers import delete


class View(mixins.QuerySetForRoleMixin, delete.DeleteView):
    pass
