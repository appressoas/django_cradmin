from django.shortcuts import redirect

from . import generic


class UiMock(generic.StandaloneBaseTemplateView):
    template_directory = None

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not self.template_directory:
            raise ValueError('The UiMock class requires a template_directory as argument to as_view().')
        if not self.template_directory.endswith('/'):
            raise ValueError('The template_directory kwarg for UiMock must end with /')

    def dispatch(self, request, mockname=None, **kwargs):
        self.session_postdata = None
        self.mockname = mockname
        if 'cradmin_uimock_postdata' in self.request.session:
            self.session_postdata = self.request.session['cradmin_uimock_postdata']
            if 'csrfmiddlewaretoken' in self.session_postdata:
                del self.session_postdata['csrfmiddlewaretoken']
            del self.request.session['cradmin_uimock_postdata']

        return super().dispatch(request, mockname, **kwargs)

    def get_template_names(self):
        template_name = 'index.django.html'
        if self.mockname:
            template_name = '{}.django.html'.format(self.mockname)
        template_name = '{}{}'.format(self.template_directory, template_name)
        return [
            template_name
        ]

    def post(self, request, *args, **kwargs):
        self.request.session['cradmin_uimock_postdata'] = self.request.POST.dict()
        return redirect(self.request.get_full_path())

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['session_postdata'] = self.session_postdata
        return context
