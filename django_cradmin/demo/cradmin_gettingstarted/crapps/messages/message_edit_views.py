from django_cradmin.demo.cradmin_gettingstarted.crapps.messages import mixins
from django_cradmin.viewhelpers import formview


class CreateMessageView(mixins.MessageCreateUpdateMixin, formview.WithinRoleCreateView):
    """"""


class MessageEditView(mixins.MessagesQuerysetForRoleMixin,
                      mixins.MessageCreateUpdateMixin,
                      formview.WithinRoleUpdateView):
    """"""


class MessageDeleteView(mixins.MessagesQuerysetForRoleMixin, formview.WithinRoleDeleteView):
    """"""
