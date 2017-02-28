from django_cradmin import viewhelpers
from django_cradmin.demo.cradmin_gettingstarted.models import Message


class MessageListView(viewhelpers.generic.WithinRoleTemplateView):
    template_name = 'cradmin_gettingstarted/publicui/message_list.django.html'

    def get_context_data(self, **kwargs):
        context = super(MessageListView, self).get_context_data(**kwargs)
        context['messages'] = Message.objects.all().order_by('creation_time')

        print('*'*88)
        print(context)
        print('*'*88)

        return context