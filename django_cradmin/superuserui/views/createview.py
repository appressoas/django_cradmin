from django_cradmin.superuserui.views import mixins
from django_cradmin.viewhelpers import create


class View(mixins.QuerySetForRoleMixin, create.CreateView):
    pass
