from django_cradmin import crheader


class TemplateHeader(crheader.DefaultHeaderRenderable):
    template_name = 'cradmin_listbuilder_guide/template_app/my_great_header.django.html'
