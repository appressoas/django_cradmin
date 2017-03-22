.. _listbuilder_title_description:

=================
Title Description
=================

This list is very much alike the Focus Box, but it add functionality for rendering the list item's title and a
description. CRadmin returns the title for us by default, however we need to set what the description should be.

.. note:: The method ``get_queryset_for_role`` is located in a mixin file to make code more reusable for this guide.
    You can write the method in the listbuilderview class and have it return
    Song.objects.filter(album=self.request.cradmin_role)

Listbuilder and Listbuilder View
--------------------------------
To make our item value render the title and description we need to extend the class
:class:`django_cradmin.viewhelpers.listbuilder.itemvalue.TitleDescription`. We can also set a valuealias to the name
of the object we're working on. As explained in the :ref:`listbuilder_all_classes` we do this so we can use the alias
instead of ``value`` when using ``self`` in the code and ``me`` in the template. Finally we decide what the description
should be.

In our listbuilder view class we decide the model and which class should render the item value.
::

    from django_cradmin.demo.cradmin_listbuilder_guide.crapps import mixins
    from django_cradmin.demo.cradmin_listbuilder_guide.models import Song
    from django_cradmin.viewhelpers import listbuilder
    from django_cradmin.viewhelpers import listbuilderview


    class TitleDescriptionItemValue(listbuilder.itemvalue.TitleDescription):
        """"""
        valuealias = 'song'

        def get_description(self):
            return 'This song is written by {}'.format(self.song.written_by)


    class TitleDescriptionListbuilderView(mixins.SongRolequeryMixin, listbuilderview.View):
        """"""
        model = Song
        value_renderer_class = TitleDescriptionItemValue

App Urls
--------
In our Cradmin application init file we add the url for our index view to the list of appurls.
::

    from django_cradmin import crapp
    from django_cradmin.demo.cradmin_listbuilder_guide.crapps.title_description_app import title_description_listview


    class App(crapp.App):
        """"""
        appurls = [
            crapp.Url(
                r'^$',
                title_description_listview.TitleDescriptionListbuilderView.as_view(),
                name=crapp.INDEXVIEW_NAME
            )
        ]


Test Title Description Listview
-------------------------------
As with the Focus Box testing, there is not really much to test here. However we want to make sure the view renders our
list as expected and that there is a message shown if an album has no songs. Finally we want to test if our description
is shown in the template.

::

    from django.test import TestCase
    from model_mommy import mommy

    from django_cradmin import cradmin_testhelpers
    from django_cradmin.demo.cradmin_listbuilder_guide.crapps.title_description_app import title_description_listview


    class TestTitleDescriptionListview(TestCase, cradmin_testhelpers.TestCaseMixin):
        """"""
        viewclass = title_description_listview.TitleDescriptionListbuilderView

        def __set_cradmin_role(self):
            return mommy.make('cradmin_listbuilder_guide.Album')

        def test_get_render_sanity(self):
            """Should have a list with length equal to objects in db"""
            album = self.__set_cradmin_role()
            mommy.make('cradmin_listbuilder_guide.Song', album=album, _quantity=8)
            mockresponse = self.mock_http200_getrequest_htmls(cradmin_role=album)
            self.assertTrue(mockresponse.selector.one('.test-cradmin-listbuilder-list'))
            song_list = mockresponse.selector.list('.test-cradmin-listbuilder-item-value-renderer')
            self.assertEqual(8, len(song_list))

        def test_empty_list(self):
            """If the object list is empty, a message should be displayed"""
            mockresponse = self.mock_http200_getrequest_htmls(cradmin_role=self.__set_cradmin_role())
            self.assertTrue(mockresponse.selector.one('.test-cradmin-no-items-message'))
            actual_message = mockresponse.selector.one('.test-cradmin-no-items-message').alltext_normalized
            self.assertEqual('No songs', actual_message)

        def test_render_title_description(self):
            """Should render the title description for each item in list"""
            album = self.__set_cradmin_role()
            mommy.make('cradmin_listbuilder_guide.Song', album=album, written_by='Donald Duck')
            mommy.make('cradmin_listbuilder_guide.Song', album=album, written_by='Dolly Duck')
            mockresponse = self.mock_http200_getrequest_htmls(cradmin_role=album)
            mockresponse.selector.prettyprint()
            self.assertTrue(mockresponse.selector.list('.test-cradmin-listbuilder-title-description__description'))
            song_list = mockresponse.selector.list('.test-cradmin-listbuilder-title-description__description')
            self.assertTrue(2, len(song_list))

Update CRadmin Instance
-----------------------
To make our new CRadmin application be include in our CRadmin instance, we add it to the list of apps. Further is the
index url of the new application added to the expandable menu. After implementation, the CRadmin instance may look
somethin like this:

::

    from django.utils.translation import ugettext_lazy

    from django_cradmin import crinstance
    from django_cradmin import crmenu
    from django_cradmin.demo.cradmin_listbuilder_guide.crapps import focus_box_app
    from django_cradmin.demo.cradmin_listbuilder_guide.crapps import title_description_app
    from django_cradmin.demo.cradmin_listbuilder_guide.models import Album


    class ListbuilderCradminInstance(crinstance.BaseCrAdminInstance):
        """"""
        id = 'listbuilder_crinstance'
        roleclass = Album
        rolefrontpage_appname = 'focus_box'
        apps = [
            ('focus_box', focus_box_app.App),
            ('title_description', title_description_app.App),
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
                )

Next Chapter
------------
TODO
