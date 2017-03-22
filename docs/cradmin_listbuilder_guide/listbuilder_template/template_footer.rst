.. _listbuilder_template_footer:

======
Footer
======
If you want to add a template footer you have to create a class which inherits from the CRadmin class
:class:`django_cradmin.crfooter.AbstractFooter` and say which template you want to use. Next you need to tell the
CRadmin instance to use the new footer class by adding its name to the variable ``footer_renderable_class``. The
method ``get_footer_renderable`` in a CRadmin instance defaults to the value of ``footer_renderable_class``. Finally
we add some content in the foot template.

Footer Class
""""""""""""
::

    from django_cradmin import crfooter


    class TemplateFooter(crfooter.AbstractFooter):
        """"""
        template_name = 'cradmin_listbuilder_guide/template_app/my_great_footer.django.html'

        def get_context_data(self, request=None):
            context = super(TemplateFooter, self).get_context_data()
            return context

CRadmin Instance
""""""""""""""""
::

    class ListbuilderCradminInstance(crinstance.BaseCrAdminInstance):
    """"""
    id = 'listbuilder_crinstance'
    roleclass = Album
    rolefrontpage_appname = 'songs'
    header_renderable_class = TemplateHeader
    footer_renderable_class = TemplateFooter

Footer Template
"""""""""""""""
::

    {% block footer %}
    <footer class="text-center">
        This guide is brought to you by Donald Duck
    </footer>
    {% endblock footer %}

The End
-------
We hope you have found this guide usefull.