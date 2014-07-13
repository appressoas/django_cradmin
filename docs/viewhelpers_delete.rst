###########################################################################################
:mod:`django_cradmin.viewhelpers.delete` --- Implements the preview+confirm+delete workflow
###########################################################################################


***********
When to use
***********
Use this when you need a view to delete a single item. Your users will get a preview of the item, and the option to confirm the delete or cancel the delete.


*****
Usage
*****
The :class:`django_cradmin.viewhelpers.delete.DeleteView` is just a subclass of :class:`django.views.generic.DeleteView`, so you use it just like the Django DeleteView.


Very basic example (no security)
================================

Lets say you have the following ``Page``-model in ``models.py``::

    from django.conf import settings

    class Page(models.Model):
        title = models.CharField(max_length=100)
        body = models.TextField()

        def __unicode__(self):
            return self.title


Then you would create a PageDeleteView and register it in an app with the following code::

    from django_cradmin.viewhelpers import delete
    from django_cradmin import crapp

    class PageDeleteView(delete.DeleteView):
        """
        View used to delete existing pages.
        """
        model = Page

    class App(crapp.App):
        appurls = [
            # .. other views
            crapp.Url(r'^delete/(?P<pk>\d+)$',
                PageDeleteView.as_view(),
                name="delete"),
        ]



Securing the basic example
==========================
The basic example lets anyone with access to the cradmin delete any page. You normally have multiple roles, and each role will have access to a subset of objects. Lets add a role class named ``Site``, and extend our ``Page``-model with a foreign-key to that site. Our new ``models.py`` looks like this::

    from django.conf import settings
    from django.db import models

    class Site(models.Model):
        name = models.CharField(max_length=100)
        admins = models.ManyToManyField(settings.AUTH_USER_MODEL)

    class Page(models.Model):
        site = models.ForeignKey(Site)
        title = models.CharField(max_length=100)
        body = models.TextField()

        def __unicode__(self):
            return self.title

We make the Site the roleclass on our ``CrAdminInstance``::

    from django_cradmin import crinstance
    class CrAdminInstance(crinstance.BaseCrAdminInstance):
        roleclass = Site
        # Other stuff documented elsewhere

We only want to allow deleting within the current Site (current role), so we replace ``model`` on the DeleteView with a ``get_queryset``-method that limits the pages to pages within the current site::

    class PageDeleteView(delete.DeleteView):
        """
        View used to delete existing pages.
        """
        def get_queryset(self):
            return Page.objects.filter(site=self.request.cradmin_role)
