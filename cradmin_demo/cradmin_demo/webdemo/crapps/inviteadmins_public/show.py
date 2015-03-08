from django.core.urlresolvers import reverse
from cradmin_demo.webdemo.crapps.inviteadmins_public.mixins import QuerysetForRoleMixin
from django_cradmin.viewhelpers.detail import DetailView


class ShowView(QuerysetForRoleMixin, DetailView):
    template_name = 'webdemo/inviteadmins_public/show.django.html'
    context_object_name = 'generictoken'

    def get_object(self, queryset=None):
        return self.get_queryset().first()

    def get_context_data(self, **kwargs):
        context = super(ShowView, self).get_context_data(**kwargs)
        generictoken = context['object']
        if generictoken:
            url = reverse('webdemo-inviteadmins-public-accept', kwargs={
                'token': generictoken.token
            })
            context['url'] = self.request.build_absolute_uri(url)
        return context
