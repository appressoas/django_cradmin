from django.views.generic import DeleteView as DjangoDeleteView
from django_cradmin import crapp

class DeleteView(DjangoDeleteView):

    #: The name of the template to use.
    template_name = 'django_cradmin/viewhelpers/delete.django.html'

    #: The model class.
    model = None

    #: Get the view name for the listing page.
    #: You can set this, or implement :meth:`.get_listing_url`.
    #: Defaults to :obj:`django_cradmin.crapp.INDEXVIEW_NAME`.
    listing_viewname = crapp.INDEXVIEW_NAME

    def get_object_preview(self):
        """
        The preview of the object. Used when asking the user if he/she wants to
        delete the current object.
        """
        obj = self.get_object()
        print 'running get_object_preview, returning: {}'.format(obj.__unicode__())
        return obj.__unicode__()

    def get_cancel_url(self):
        """
        The url to go to if the delete option is canceled.

        TODO: set this to something more useful then '#'...
        """
        return '#'

    def get_success_url(self):
        """
        Get the URL to go to if object was deleted.

        Defaults to :obj:`.listing_viewname`.
        """
        return self.request.cradmin_app.reverse_appurl(self.listing_viewname)

    def get_context_data(self, **kwargs):
        context = super(DeleteView, self).get_context_data(**kwargs)
        context['model_verbose_name'] = self.model._meta.verbose_name
        context['cancel_url'] = self.get_cancel_url()
        context['success_url'] = self.get_cancel_url()
        context['object_preview'] = self.get_object_preview()
        return context
