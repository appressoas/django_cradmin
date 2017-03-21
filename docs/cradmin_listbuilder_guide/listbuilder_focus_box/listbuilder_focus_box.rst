.. _listbuilder_focus_box:

=========
Focus Box
=========

The Focus Box class in CRadmin listbuilder is often the place you start when you want to create you own listbuilder
classes. All it does is to render a listwrapper which contains a blocklist. Within the blocklist lies a blocklist item
with a value.

To render this we need to create two classes, one for creating the item values and one for building the view. In this
example we use the template given to us by CRadmin.

.. note:: The method ``get_queryset_for_role`` is located in a mixin file to make code more reusable for this guide.
    You can write the method in the listbuilderview class and have it return
    Song.objects.filter(album=self.request.cradmin_role)

Listbuilder and Listbuilder View
--------------------------------
We create a class which extends the :class:`django_cradmin.viewhelpers.listbuilder.itemvalue.FocusBox` for getting
the values for each list item. Further we create a view class which extends the
:class:`django_cradmin.viewhelpers.listbuilderview.View`.
::

    from django_cradmin.demo.cradmin_listbuilder_guide.crapps import mixins
    from django_cradmin.demo.cradmin_listbuilder_guide.models import Song
    from django_cradmin.viewhelpers import listbuilder
    from django_cradmin.viewhelpers import listbuilderview


    class FocusBoxSongItemValue(listbuilder.itemvalue.FocusBox):
        """"""


    class FocusBoxSongListbuilderView(mixins.SongRolequeryMixin, listbuilderview.View):
        """"""
        model = Song
        value_renderer_class = FocusBoxSongItemValue

Test Focus Box ListView
-----------------------
In this example all we want to test is if the list is rendered as expected.

::

    from django.test import TestCase
    from model_mommy import mommy

    from django_cradmin import cradmin_testhelpers
    from django_cradmin.demo.cradmin_listbuilder_guide.crapps.focus_box_app import focus_box_listview


    class TestFocusBoxListView(TestCase, cradmin_testhelpers.TestCaseMixin):
        """"""
        viewclass = focus_box_listview.FocusBoxSongListbuilderView

        def __set_cradmin_role(self):
            return mommy.make('cradmin_listbuilder_guide.Album')

        def test_render_list_sanity(self):
            """Should return a list of objects equal to objects in database"""
            album = self.__set_cradmin_role()
            mommy.make('cradmin_listbuilder_guide.Song', album=album, _quantity=20)
            mockresponse = self.mock_http200_getrequest_htmls(cradmin_role=album)
            self.assertTrue(mockresponse.selector.one('.test-cradmin-listbuilder-list'))
            song_list = mockresponse.selector.list('.test-cradmin-listbuilder-item-value-renderer')
            self.assertEqual(20, len(song_list))

        def test_empty_list(self):
            """Should be an empty list when an album don't have any songs"""
            mockresponse = self.mock_http200_getrequest_htmls(cradmin_role=self.__set_cradmin_role())
            self.assertTrue(mockresponse.selector.one('.test-cradmin-no-items-message'))
            self.assertEqual('No songs', mockresponse.selector.one('.test-cradmin-no-items-message').alltext_normalized)

App Url
-------
In our CRadmin application init file, we set the url for our new list view.
::

    from django_cradmin import crapp
    from django_cradmin.demo.cradmin_listbuilder_guide.crapps.focus_box_app import focus_box_listview


    class App(crapp.App):
        appurls = [
            crapp.Url(
                r'^$',
                focus_box_listview.FocusBoxSongListbuilderView.as_view(),
                name=crapp.INDEXVIEW_NAME
            )
        ]

Update CRadmin Instance
-----------------------
We need to add the Focus Box application to our CRadmin instance to make it show. As explained in the Getting Started
tutorial we set the name of which application we want to have as our homepage and we add the focua box application to
the list of apps. In this guide we also add each app to the expandable menu so it's easy for the user to jump between
the different applications.

::

    from django.utils.translation import ugettext_lazy

    from django_cradmin import crinstance
    from django_cradmin import crmenu
    from django_cradmin.demo.cradmin_listbuilder_guide.crapps import focus_box_app
    from django_cradmin.demo.cradmin_listbuilder_guide.models import Album


    class ListbuilderCradminInstance(crinstance.BaseCrAdminInstance):
        """"""
        id = 'listbuilder_crinstance'
        roleclass = Album
        rolefrontpage_appname = 'focus_box'
        apps = [
            ('focus_box', focus_box_app.App)
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
                )
If you now go to Django Admin and add an album with an administrator and create some songs to that album, you should see
a list of songs.
Next Chapter
------------
TODO