.. _listbuilder_template_header:

==============
CRadmin Header
==============
Now we want to change the header for our template. First we want to get the title text for the role to be a back to the
frontpage application. This is done with the method ``get_titletext_for_role`` in the CRadmin instance class. If we
update this method to return the title of the role, we would get the name of the album to show up in the header. But
this is kind of misguiding for this guide, since the frontpage application is the *Edit Delet Demo*. Offcourse you have
allready understood that we could return something else in the method ``get_titletext_for_role``. Another solution
is to override the template. To make this work we need to do the following

* Create a header renderable class
* Create and update a template
* Tell the CRadmin instance to use the new header renderable class

Header Renderable Class
-----------------------
If we use the ``DefaultHeaderRenderable`` we get a hold of the :class:`django_cradmin.crheader.AbstractHeaderRenderable`
which CRadmin says we must use in one way or another. The next thing we do is to add a new template to be used.
::

    from django_cradmin import crheader


    class TemplateHeader(crheader.DefaultHeaderRenderable):
        template_name = 'cradmin_listbuilder_guide/template_app/my_great_header.django.html'

.. note:: You can inherit directly from the ``AbstractHeaderRenderable`` and style your header even more than we do in
    this tutorial.

Header Template
---------------
The next step is to go to our header template and update block for brand content. Since we want to override the content
we don't call the super block.

.. literalinclude:: /../django_cradmin/demo/cradmin_listbuilder_guide/templates/cradmin_listbuilder_guide/template_app/my_great_header.django.html

Update Cradmin Instance
-----------------------
The last thing we need to do to make use of our new header is to tell our CRadmin instance to use the new header class,
``TemplateHeader``. This is done by setting a new value to the variable ``header_renderable_class``. The CRadmin
instance now look something like this:

::

    from django.utils.translation import ugettext_lazy

    from django_cradmin import crinstance
    from django_cradmin import crmenu
    from django_cradmin.demo.cradmin_listbuilder_guide.crapps import edit_delete_app
    from django_cradmin.demo.cradmin_listbuilder_guide.crapps import focus_box_app
    from django_cradmin.demo.cradmin_listbuilder_guide.crapps import template_app
    from django_cradmin.demo.cradmin_listbuilder_guide.crapps import title_description_app
    from django_cradmin.demo.cradmin_listbuilder_guide.crapps.template_app.header import TemplateHeader
    from django_cradmin.demo.cradmin_listbuilder_guide.models import Album


    class ListbuilderCradminInstance(crinstance.BaseCrAdminInstance):
        """"""
        id = 'listbuilder_crinstance'
        roleclass = Album
        rolefrontpage_appname = 'songs'
        header_renderable_class = TemplateHeader
        apps = [
            ('focus_box', focus_box_app.App),
            ('title_description', title_description_app.App),
            ('songs', edit_delete_app.App),
            ('template', template_app.App),
        ]

        def get_titletext_for_role(self, role):
            return role.title

        def get_rolequeryset(self):
            queryset = Album.objects.all()
            if not self.request.user.is_superuser:
                queryset = queryset.filter(albumadministrator__user=self.request.user)
            return queryset

        def get_expandable_menu_item_renderables(self):
            return [
                crmenu.ExpandableMenuItem(
                    label=ugettext_lazy('Focus Box Demo'),
                    url=self.appindex_url('focus_box'),
                    is_active=self.request.cradmin_app.appname == 'focus_box'
                ),
                crmenu.ExpandableMenuItem(
                    label=ugettext_lazy('Title Description Demo'),
                    url=self.appindex_url('title_description'),
                    is_active=self.request.cradmin_app.appname == 'title_description'
                ),
                crmenu.ExpandableMenuItem(
                    label=ugettext_lazy('Edit Delete Demo'),
                    url=self.appindex_url('songs'),
                    is_active=self.request.cradmin_app.appname == 'songs'
                ),
                crmenu.ExpandableMenuItem(
                    label=ugettext_lazy('Own Template Demo'),
                    url=self.appindex_url('template'),
                    is_active=self.request.cradmin_app.appname == 'template'
                )
            ]

