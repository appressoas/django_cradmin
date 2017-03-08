from django_cradmin import viewhelpers
from django_cradmin.demo.cradmin_gettingstarted.crapps.messages import mixins


class CreateMessageView(mixins.MessageCreateUpdateMixin, viewhelpers.formview.WithinRoleCreateView):
    roleid_field = 'account'

