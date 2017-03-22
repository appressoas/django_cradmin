.. _edit_delete_views:

===========
Edit Delete
===========
The goal in this part of the guide is to create a html page where we can easily add new songs or change an existing.
We will do this by creating as little code as possible, hence not creating any templates and our views will extends
some of the CRadmin Listbuilder classes mentioned in chapter :ref:`listbuilder_all_classes`. However we need to get a
form and write what the role query set should return.

Structure of Modules and Files
------------------------------
We use the standard CRadmin project structure for this application, meaning we have a *crapps* module inside our Django
Application. In the *crapps* we add a new module with an easy to read name. In this guide the CRadmin application
(crapps) is named *edit_delete_app*. Inside our new CRadmin application we add files which contents our views and a
mixins file for code which is needed by more than one view.

.. note:: In this guide the mixins file is located at root for the *crapps* folder since we use the classes across
    different crapps.


Mixins File
-----------
In the mixins file we have classes for:

* Form used by create and update
* Role queryset
* Create Song
* Edit Song
* Delete Song

Render Form and Role Queryset
"""""""""""""""""""""""""""""
The class *SongCreateUpdateFormMixin* renders the form for us by using the uicontainer functionality in CRadmin. The
class *SongRolequeryMixin* secures that onyl songs on the album which is equal to the current CRadmin role is
returned.

Create, Edit and Delete
"""""""""""""""""""""""
The class *SongCreateView* extends our form class and the CRadmin class *WithinRoleCreateView*. The class
*SongEditView* extends both our form class and our role queryset class. Further is extends the CRadmin class
*WithinFormUpdateView*. The last of our mixin classes is *SongDeleteView* which extends our role queryset class and the
CRadmin class *WithinRoleDeleteView*.

.. note:: You may not need to put the create, update and delete view classes in a mixin file. This is done to make
    code reusable when adding more demo crapps to this guide.

The mixin file may look something like this:

.. literalinclude:: /../django_cradmin/demo/cradmin_listbuilder_guide/crapps/mixins.py

Implementing Create, Edit and Delete View
-----------------------------------------
The only thing we now need to do is to implement the view classes from our mixin file.

.. literalinclude:: /../django_cradmin/demo/cradmin_listbuilder_guide/crapps/edit_delete_app/edit_views.py

Item Value and View
-------------------
The next step is to build item values and the list view. Our class ``EditDeleteSongItemValue`` extends the CRadmin
class :class:`django_cradmin.viewhelpers.listbuilder.itemvalue.EditDelete`. What this does is to easily
render a box with and edit and delete button for each item in our list. Another usefull element is the ``valuealias``.
We override the default value attribute to make it easier working with objects in our views or templates. As you can
see below we set the valuealias attribute to be *song*. In our method we can than use ``self.song....`` and in a
template we can than use ``me.song...``.

The class ``EditDeleteSongListbuilderView`` extends three other classes. First we need the correct Song object instances for the
CRadmin role, which is found in our mixins file. Second we want to the ability to add new Songs to an album, so we
use the CRadmin class ``ViewCreateButtonMixin``. Finally we extends the CRadmin class
:class:`django_cradmin.viewhelpers.listbuilderview.View` which gives us what we need for a standard Django list view
pluss extra CRadmin functionality, like handling roles. In the ``EditDeleteSongListbuilderView`` class we set the model and which
class we want to use for rendering the item values for our list.

.. literalinclude:: /../django_cradmin/demo/cradmin_listbuilder_guide/crapps/edit_delete_app/listview.py

Crapp Urls
----------
The next thing we need is to add the urls for our newly created views to the class App, so that our CRadmin instance
class can find the urls and include them. We put our appurls inside the init file of our CRadmin application
``edit_delete_app``.

CRadmin listbuilder expects that the different views uses the name index, create, edit and delete. As you remember
from out Getting Started tutorial the index view name is given by ``crapp.INDEXVIEW_NAME``. When we extended the
CRadmin class ``EditDelete`` for our item value class, we got two methods which gets the viewname within the current
:class:`django_cradmin.crapp.App`. Since these methods returns either ``edit`` or ``delete`` by default it is
recommended we use the same names for our views to keep the structure uniformly. If there is a need to override this,
we can use the template block ``editbutton-url`` or ``deletebutton-url``.

::

    from django_cradmin import crapp
    from django_cradmin.demo.cradmin_listbuilder_guide.crapps.song_app import song_create_view
    from django_cradmin.demo.cradmin_listbuilder_guide.crapps.song_app import song_delete_view
    from django_cradmin.demo.cradmin_listbuilder_guide.crapps.song_app import song_edit_delete_listview
    from django_cradmin.demo.cradmin_listbuilder_guide.crapps.song_app import song_edit_view


    class App(crapp.App):
        appurls = [
            crapp.Url(
                r'^$',
                song_edit_delete_listview.EditDeleteSongListbuilderView.as_view(),
                name=crapp.INDEXVIEW_NAME
            ),
            crapp.Url(
                r'^create$',
                song_create_view.SongCreateView.as_view(),
                name='create'
            ),
            crapp.Url(
                r'^edit/(?P<pk>\d+)$',
                song_edit_view.SongEditView.as_view(),
                name='edit'
            ),
            crapp.Url(
                r'^delete/(?P<pk>\d+)$',
                song_delete_view.SongDeleteView.as_view(),
                name='delete'
            )
        ]

Update CRadmin Instance
-----------------------
Now we need to update our CRadmin instance with the new CRadmin application. It might be a good idea to change which
crapps the user should get to first, to make it easy to add new object instances from the home page. We do this by
changin the ``rolefrontpage_appname``. Further we add the new index url to the expandable menu. The CRadmin instance
may look something like this:

::

    from django.utils.translation import ugettext_lazy

    from django_cradmin import crinstance
    from django_cradmin.demo.cradmin_listbuilder_guide.crapps import edit_delete_app
    from django_cradmin.demo.cradmin_listbuilder_guide.crapps import focus_box_app
    from django_cradmin.demo.cradmin_listbuilder_guide.crapps import title_description_app
    from django_cradmin.demo.cradmin_listbuilder_guide.models import Album


    class ListbuilderCradminInstance(crinstance.BaseCrAdminInstance):
        """"""
        id = 'listbuilder_crinstance'
        roleclass = Album
        rolefrontpage_appname = 'songs'
        apps = [
            ('focus_box', focus_box_app.App),
            ('title_description', title_description_app.App),
            ('songs', edit_delete_app.App),
        ]

        def get_titletext_for_role(self, role):
            pass

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
                )
            ]


Next Chapter
------------
TODO












