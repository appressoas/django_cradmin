from django_cradmin.superuserui.views import mixins
from django_cradmin.viewhelpers import update


class View(mixins.QuerySetForRoleMixin, update.UpdateView):
    enable_modelchoicefield_support = True
