from django_cradmin import crfooter


class TemplateFooter(crfooter.AbstractFooter):
    """"""
    template_name = 'cradmin_listbuilder_guide/template_app/my_great_footer.django.html'

    def get_context_data(self, request=None):
        context = super(TemplateFooter, self).get_context_data()
        return context
