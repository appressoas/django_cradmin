from django.views.generic import TemplateView


class BeginUnauthenticated(TemplateView):
    template_name = 'cradmin_passwordreset/begin_unauthenticated.django.html'

