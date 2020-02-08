from django_cradmin.viewhelpers import generic


class TestLockdownView(generic.StandaloneBaseTemplateView):
    template_name = 'lockdown/form.html'
