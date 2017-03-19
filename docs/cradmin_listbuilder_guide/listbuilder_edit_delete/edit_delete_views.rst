.. _edit_delete_views:

=====================
CRadmin's Edit Delete
=====================
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


Mixins File For Song Application
--------------------------------
In the mixins file we have created two classes, *SongCreateUpdateFormMixin* and *SongRolequeryMixin*. The form mixin
class will be used by CRadmin viewhelper classes which extends the Django modelform functionality, so we need to set
which model we want to use. We also set the field for role id to the role we are using, which is Album. The last thin
our form mixin class contains is the method ``get_form_renderable`` which is the name CRadmin uses when it renders a
form. Inside this method we just return the CRadmin ``uicontainer``.

In the mixins class for role queryset we add the CRadmin method ``get_queryset_for_role`` and have it return Song
objects. To have the songs belonging to an album returned, we filter on album equal to the current CRadmin role.
::

    from django_cradmin import uicontainer
    from django_cradmin import viewhelpers
    from django_cradmin.demo.cradmin_listbuilder_guide.models import Song


    class SongCreateUpdateFormMixin(object):
        """"""
        model = Song
        roleid_field = 'album'
        fields = [
            'title',
            'written_by',
            'time'
        ]

        def get_form_renderable(self):
            return uicontainer.layout.AdminuiPageSectionTight(
                children=[
                    uicontainer.form.Form(
                        form=self.get_form(),
                        children=[
                            uicontainer.fieldwrapper.FieldWrapper(
                                fieldname='title'
                            ),
                            uicontainer.fieldwrapper.FieldWrapper(
                                fieldname='written_by'
                            ),
                            uicontainer.fieldwrapper.FieldWrapper(
                                fieldname='time'
                            ),
                            uicontainer.button.SubmitPrimary(
                                text='Save'
                            )
                        ]
                    )
                ]
            ).bootstrap()


    class SongRolequeryMixin(object):
        def get_queryset_for_role(self):
            return Song.objects.filter(album=self.request.cradmin_role)

Create View
-----------
As you remember from the Getting Started tutorial, we may or may not use a role to allow access to a html page. In the
mixins file we sat the role to be an instance of the Album object, thus we use the CRadmin viewhelpers class
``WithinRoleCreateView`` as a super. Furthere we implement the form from our mixins file.
::

    from django_cradmin import viewhelpers
    from django_cradmin.demo.cradmin_listbuilder_guide.crapps.song_app import mixins


    class SongCreateView(mixins.SongCreateUpdateFormMixin, viewhelpers.formview.WithinRoleCreateView):
        """"""

Edit View
---------
Since we here are updating an existing instance of the Song object which belongs to a class we want to add a security
layer to ensure that only people with the correct role may edit the object instance. This is done by implementing the
method ``get_queryset_for_role`` from the class SongRolequeryMixin in our crapps mixins file. The next class we
implement is the form class from the mixins file, before finally extending the CRadmin viewhelper class
``WithinRoleUpdateView``.

::

    from django_cradmin.demo.cradmin_listbuilder_guide.crapps.song_app.mixins import SongRolequeryMixin, \
    SongCreateUpdateFormMixin
    from django_cradmin.viewhelpers.formview import WithinRoleUpdateView


    class SongEditView(SongRolequeryMixin, SongCreateUpdateFormMixin, WithinRoleUpdateView):
        """"""

Delete View
-----------
Just as for the edit view we implement the role queryset to ensure only people with the correct role may delete a song.
Further we extend the CRadmin viewhelper class ``WithinRoleDeleteView``.

::

    from django_cradmin.demo.cradmin_listbuilder_guide.crapps.song_app.mixins import SongRolequeryMixin
    from django_cradmin.viewhelpers.formview import WithinRoleDeleteView


    class SongDeleteView(SongRolequeryMixin, WithinRoleDeleteView):
        """"""

List View
---------
The next step to make a html page with functionality for create, edit and delete object insances is to build item
values and to build the list view. Our class ``SongItemValue`` extends the CRadmin listbuilder item value class
:class:`django_cradmin.viewhelpers.listbuilder.itemvalue.EditDelete`. What this does is to easily render a box with
and edit and delete button for each item in our list. Another usefull element is the ``valuealias``. We override the
default value attribute to make it easier working with objects in our views or templates. As you can see below we set
the valuealias attribute to be *song*. In our method we can than use ``self.song....`` and in a template we can than
use ``me.song...``. The valuealias is inherit from the CRadmin viewhelper class
:class:`django_cradmin.viewhelpers.listbuilder.base.AbstractItemRenderer`.

The class ``SongListbuilderView`` extends three other classes. First we need the correct Song object instances for the
CRadmin role, which is found in our mixins file. Second we want to the ability to add new Songs to an album, so we
use the CRadmin class ``ViewCreateButtonMixin``. Finally we extends the CRadmin class
:class:`django_cradmin.viewhelpers.listbuilderview.View` which gives us what we need for a standard Django list view
pluss extra CRadmin functionality, like handling roles. In the ``SongListbuilderView`` class we set the model and which
class we want to use for rendering the item values for our list.
::

    from django_cradmin.demo.cradmin_listbuilder_guide.crapps.song_app.mixins import SongRolequeryMixin
    from django_cradmin.demo.cradmin_listbuilder_guide.models import Song
    from django_cradmin.viewhelpers import listbuilder
    from django_cradmin.viewhelpers import listbuilderview


    class SongItemValue(listbuilder.itemvalue.EditDelete):
        """"""
        valuealias = 'song'

        def get_description(self):
            return 'Written by {}'.format(self.song.written_by)


    class SongListbuilderView(SongRolequeryMixin, listbuilderview.ViewCreateButtonMixin, listbuilderview.View):
        """"""
        model = Song
        value_renderer_class = SongItemValue

Crapp Urls
----------
The next thing we need is to add the urls for our newly created views to the class App, so that our CRadmin instance
class can find the urls and include them. We put our appurls inside the init file of our CRadmin application
``edit_delete_app``.

CRadmin listbuilder expects that the different views uses the name index, create, edit and delete. As you remember
from out Getting Started tutorial the index view name is given by ``crapp.INDEXVIEW_NAME``. When we extended the
CRadmin class ``EditDelete`` for our item value class, we got two methods which gets the viewname within the current
:class:`django_cradmin.crapp.App` to go to either for editing or deleting. Since these methods returns either ``edit``
or ``delete`` by default it is recommended we use the same names for our views to keep the structure uniformly. If
there is a need to override this, we can use the template block ``editbutton-url`` or ``deletebutton-url``.

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
                song_edit_delete_listview.SongListbuilderView.as_view(),
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

Next Chapter
------------
TODO












