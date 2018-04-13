###########
Breadcrumbs
###########

***********
Renderables
***********

The ``cradmin.crbreadcrumb`` module provides generalized renderables for breadcrumbs. There
renderables can be used to render breadcrumbs anywhere on a page using
the :func:`~django_cradmin.templatetags.cradmin_tags.cradmin_render_renderable` template tag.


**********************************************************
Cascading breadcrumbs in cradmin instances, apps and views
**********************************************************
Having renderables for breadcrumbs is good, but it does not help with the challenge of
having to create the full breadcrumb path in each view, and having to refactor that
everywhere if we move views around. To solve this problem, we have added support for breadcrumbs
in:

- :class:`django_cradmin.crinstance.BaseCrAdminInstance`
- :class:`django_cradmin.crapp.App`
- :class:`django_cradmin.viewhelpers.mixins.CommonCradminViewMixin` (mixin used by all our base views)

All of these classes have a ``get_breadcrumb_item_list_renderable()``-method. The
method on crinstance.BaseCrAdminInstance creates a breadcrumb item list renderable object
(a subclass of :class:`django_cradmin.crbreadcrumb.BreadcrumbItemList`). The method
on crapp.App just call ``request.cradmin_instance.get_breadcrumb_item_list_renderable()``
to get the breadcrumb item list from the cradmin instance. And, in the same spirit, the
method on viewhelpers.mixins.CommonCradminViewMixin just call
``request.cradmin_app.get_breadcrumb_item_list_renderable()`` to get the breadcrumb item
list from the cradmin app. Docs for each of these methods here:

- :meth:`django_cradmin.crinstance.BaseCrAdminInstance.get_breadcrumb_item_list_renderable`
- :meth:`django_cradmin.crapp.App.get_breadcrumb_item_list_renderable`
- :meth:`django_cradmin.viewhelpers.mixins.CommonCradminViewMixin.get_breadcrumb_item_list_renderable`

As a convenience, crapp.App and viewhelpers.mixins.CommonCradminViewMixin also define
a add_breadcrumb_list_items()-method which can be used to just add breadcrumb items as long
as the cradmin instance/app actually provide a breadcrumb item list rendereable. You normally
want to override these methods, and they are documented here:

- :meth:`django_cradmin.crapp.App.add_breadcrumb_list_items`
- :meth:`django_cradmin.viewhelpers.mixins.CommonCradminViewMixin.add_breadcrumb_list_items`


*******
Example
*******
A typical and simple example::

    class SiteEditView(viewhelpers.formview.UpdateRoleView):
        def add_breadcrumb_list_items(self, breadcrumb_item_list):
            breadcrumb_item_list.append(label='Edit', active=True)


    class SiteOverviewView(viewhelpers.generic.WithinRoleTemplateView):
        # No add_breadcrumb_list_items() method because this is the index view for
        # the app, so the breadcrumb the app adds takes you to this view.
        pass


    class SiteDetailsApp(crapp.App):
        appurls = [
            crapp.Url(r'^$', SiteOverviewView.as_view(), name=crapp.INDEXVIEW_NAME),
            crapp.Url(r'^edit$', SiteEditView.as_view(), name='edit'),
        ]

        def add_breadcrumb_list_items(self, breadcrumb_item_list):
            breadcrumb_item_list.append(
               url=self.reverse_appindexurl(),
               label='{} details'.format(
                  self.request.cradmin_instance.get_titletext_for_role(self.request.cradmin_role))
            )


    class SiteCradminInstance(crinstance.BaseCrAdminInstance):
         rolefrontpage_appname = 'details'
         apps = [
            ('details', SiteDetailsApp)
         ]

         def add_breadcrumb_list_items(self, breadcrumb_item_list):
             if self.get_rolequeryset().count() > 1:
                # Add breadcrumb back to the roleselect view if we have more than one site
                breadcrumb_item_list.append(
                    url=self.get_instance_frontpage_url(),
                    label='Sites')


Custom breadcrumb item list renderable::

    class MyCustomBreadcrumbItemList(crbreadcrumb.WrappedBreadcrumbItemList):
        # We just override the css class in this example, but you can do much more!
        def get_bem_block(self):
            return 'my-custom-breadcrumb-item-list'


    class SiteCradminInstance(crinstance.BaseCrAdminInstance):
        # Everything else is just like in SiteCradminInstance above, but
        # we add this property
        breadcrumb_item_list_renderable_class = MyCustomBreadcrumbItemList


Custom breadcrumb item list in just a single view::

    # This works for crapp.App too if you want a custom breadcrumb style for all views in an app!

    class SiteEditView(viewhelpers.formview.UpdateRoleView):
        def add_breadcrumb_list_items(self, breadcrumb_item_list):
            breadcrumb_item_list.append(label='Edit', active=True)

        def get_breadcrumb_item_list_renderable(self):
            # We get the breadcrumb item list from super() this will include everything from
            # the cradmin instance and app, and the item we added in add_breadcrumb_list_items()
            # above.
            breadcrumb_item_list = super().get_breadcrumb_item_list_renderable()

            # Then we create an instance of MyCustomBreadcrumbItemList with a copy
            # of the items of the items from super().
            return MyCustomBreadcrumbItemList.from_breadcrumb_item_list(breadcrumb_item_list)


******************************************
Rendering breadcrumbs at a custom location
******************************************
Lets say your design requires you to render the breadcrumb centered above the title in the page-cover
on a certain page. You can achieve this fairly easily.

This can be solved in many different ways, but we will go with a fairly easy solution where we:

- Use ``BreadcrumbItemList`` instead of ``WrappedBreadcrumbItemList`` to get a plain
  ``<nav class="breadcrumb-item-list">`` without any wrapper.
- Override the ``breadcrumbs`` template block to avoid rendering the breadcrumb at the default location.
- Render the breadcrumb in the ``page-cover-content`` block.

First, we override ``get_breadcrumb_item_list_renderable`` on the view::

    class SiteEditView(viewhelpers.formview.UpdateRoleView):
        def add_breadcrumb_list_items(self, breadcrumb_item_list):
            breadcrumb_item_list.append(label='Edit', active=True)

        def get_breadcrumb_item_list_renderable(self):
            # We have an example above that explains how this works in detail.
            breadcrumb_item_list = super().get_breadcrumb_item_list_renderable()
            return crbreadcrumb.BreadcrumbItemList.from_breadcrumb_item_list(breadcrumb_item_list)

Next, we override the template:

.. code-block:: django

    {% extends "django_cradmin/viewhelpers/formview/within_role_update_view.django.html" %}
    {% load cradmin_tags %}

    {% block breadcrumbs %}
        {# Do not render breadcrumb item list at the default location #}
    {% endblock breadcrumbs %}

    {% block page-cover-content %}
        {# Render breadcrumbs here instead #}
        <div class="text-center paragraph">
            {% cradmin_render_breadcrumb_item_list %}
        </div>

        {{ block.super }}
    {% endblock page-cover-content %}


.. note:: You can change how the breadcrumbs are rendered for all views in your
    site by overring the breadcrumb item list renderable
    on your cradmin instances (typically with a common base class or mixin class),
    and override the ``django_cradmin/standalone-base.django.html`` template.


*****************
crbreadcrumbs API
*****************

.. automodule:: django_cradmin.crbreadcrumb
   :members:
