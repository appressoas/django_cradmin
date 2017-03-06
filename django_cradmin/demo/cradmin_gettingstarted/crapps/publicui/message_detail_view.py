from django_cradmin import viewhelpers
from django_cradmin.demo.cradmin_gettingstarted.models import Message


class MessageDetailView(viewhelpers.detail.DetailView):
    """"""
    template_name = 'cradmin_gettingstarted/crapps/publicui/message_detail.django.html'

    def get_queryset_for_role(self):
        """"""
        return Message.objects.all()

    def get_context_data(self, **kwargs):
        context = super(MessageDetailView, self).get_context_data(**kwargs)
        context['the_object'] = self.get_object()
        print(context)
        return context
