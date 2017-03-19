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
values and to build the list view. The CRadmin lisbuilder itemvalue class ``EditDelete``
:class:`django_cradmin.viewhelpers.listbuilder.itemvalue.EditDelete`
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

Valuealias
""""""""""
When taking a look at the EditDelete bla bla bla
