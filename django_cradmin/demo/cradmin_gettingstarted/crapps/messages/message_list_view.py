from django_cradmin.demo.cradmin_gettingstarted.crapps.messages import mixins
from django_cradmin.demo.cradmin_gettingstarted.models import Message
from django_cradmin.viewhelpers import listbuilder
from django_cradmin.viewhelpers import listbuilderview


class MessageItemValue(listbuilder.itemvalue.EditDelete):
    template_name = 'cradmin_gettingstarted/crapps/messages/messageslist_itemvalue.django.html'
    valuealias = 'message'

    def get_description(self):
        return self.message.body


class MessageListBuilderView(mixins.MessagesQuerysetForRoleMixin,
                             listbuilderview.ViewCreateButtonMixin,
                             listbuilderview.View):
    model = Message
    value_renderer_class = MessageItemValue
