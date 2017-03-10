from django_cradmin.crinstance import reverse_cradmin_url
from django_cradmin.demo.cradmin_gettingstarted.models import Message
from django_cradmin.viewhelpers import listbuilder, listbuilderview


class MessageItemValue(listbuilder.itemvalue.TitleDescription):
    """Get values for items in the list"""

    template_name = 'cradmin_gettingstarted/crapps/publicui/public_message_listbuilder.django.html'
    valuealias = 'message'

    def get_description(self):
        return self.message.body


class MessageItemFrameLink(listbuilder.itemframe.Link):
    """Make each frame around the list itmes a link"""
    valuealias = 'message'

    def get_url(self):
        return reverse_cradmin_url(
            instanceid='cr_public_message',
            appname='public_message',
            viewname='detail',
            kwargs={
                'pk': self.message.id
            }
        )


class MessageListBuilderView(listbuilderview.View):
    """Builds the list for the view"""

    model = Message
    value_renderer_class = MessageItemValue
    frame_renderer_class = MessageItemFrameLink
    template_name = 'cradmin_gettingstarted/crapps/publicui/public_message_listbuilder_view.django.html'

    def get_queryset_for_role(self):
        return Message.objects.all()
