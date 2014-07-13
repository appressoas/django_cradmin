from django.views.generic import DeleteView as DjangoDeleteView


class DeleteView(DjangoDeleteView):

    #: The name of the template to use.
    template_name = 'django_cradmin/viewhelpers/delete.django.html'

    def get_object_preview(self):
        """
        The preview of the object. Used when asking the user if he/she wants to
        delete the current object.
        """
        obj = self.get_object()
        return unicode(obj)

    def get_success_url(self):
        """
        Get the URL to go to if object was deleted.

        Defaults to the INDEX view of the current app.
        """
        return self.request.cradmin_app.reverse_appindexurl()

    def get_context_data(self, **kwargs):
        context = super(DeleteView, self).get_context_data(**kwargs)
        obj = context['object']
        context['model_verbose_name'] = obj._meta.verbose_name
        context['success_url'] = self.get_success_url()
        context['object_preview'] = self.get_object_preview()
        return context

    def get_queryset_for_role(self, role):
        """
        Get a queryset with all objects of :obj:`.model`  that
        the current role can access.
        """
        raise NotImplementedError()

    def get_queryset(self):
        """
        DO NOT override this. Override :meth:`.get_queryset_for_role`
        instead.
        """
        queryset = self.get_queryset_for_role(self.request.cradmin_role)
        return queryset
