.. _listbuilder_edit_views:

==========
Edit Views
==========

The next thing we need to set up is edit views for all three crapps. The method which renders our forms for the create
views should be moved to a mixins file within each crapps. In the same mixin file we also add a class which holds a
method for the role queryset. After this we update our App class in the init file and write some tests.

Differences for the crapps
==========================
The main difference is what we return in our methods which handles the role queryset. For artist the user is the role,
for album the artist is the role and for song we use *album__artist_id* as a role.

Implementation of Song Application
==================================
We will show in full example how you can write the edit view for the song application.

Mixins
------
We start with creating a file named ``song_mixin.py`` within the module ``song_app``. In this file we create one class
which renders the form used by both the create and update view, and one class with a method for the rolequery.
::

    from django_cradmin import uicontainer
    from django_cradmin.demo.cradmin_listbuilder_guide.models import Song


    class SongCreateEditMixin(object):
        """"""
        model = Song
        roleid_field = 'artist'
        fields = [
            'title',
            'album'
        ]

        def get_form_renderable(self):
            return uicontainer.layout.AdminuiPageSectionTight(
                children=[
                    uicontainer.form.Form(
                        form=self.get_form(),
                        children={
                            uicontainer.fieldwrapper.FieldWrapper('title'),
                            uicontainer.fieldwrapper.FieldWrapper('album'),
                            uicontainer.button.SubmitPrimary(
                                text='Save'
                            )
                        }
                    )
                ]
            ).bootstrap()


    class SongQuerysetForRoleMixin(object):
        """The role is artist and a song must be on an album"""

        def get_queryset_for_role(self):
            return Song.objects.filter(album__artist_id=self.request.cradmin_role.id)

Update Create View
------------------
Since we now have a mixin class which renders the form, we need to update the create view so it extends this class.
Here we do not use the queryset for role mixin.
::

    from django_cradmin import viewhelpers
    from django_cradmin.demo.cradmin_listbuilder_guide.crapps.song_app.song_mixin import SongCreateEditMixin


    class SongCreateView(SongCreateEditMixin,viewhelpers.formview.WithinRoleCreateView):
        """"""

Edit Song View
--------------
Next we create a new file within the song_app with the name ``song_delete_view``. In here we create a class which
extends both mixins classes and the CRadmin class ``WithinRoleUpdateView``.

::

    from django_cradmin import viewhelpers
    from django_cradmin.demo.cradmin_listbuilder_guide.crapps.song_app.song_mixin import SongQuerysetForRoleMixin, \
        SongCreateEditMixin


    class SongEditView(SongQuerysetForRoleMixin, SongCreateEditMixin, viewhelpers.formview.WithinRoleUpdateView):
        """"""

Crapp Urls
----------
We add the new url for the song edit view in the ``__init__.py`` file within the ``song_app``.

::

    class App(crapp.App):
    appurls = [
        crapp.Url(
            r'^$',
            song_dashboard.SingleDashboardView.as_view(),
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
        )

Tests
_____
Finally we add some sanity testing for our edit view.
::

    from django.test import TestCase
    from model_mommy import mommy

    from django_cradmin import cradmin_testhelpers
    from django_cradmin.demo.cradmin_listbuilder_guide.crapps.song_app import song_edit_view
    from django_cradmin.demo.cradmin_listbuilder_guide.models import Song


    class TestSongEditView(TestCase, cradmin_testhelpers.TestCaseMixin):
        """"""
        viewclass = song_edit_view.SongEditView

        def setUp(self):
            self.artist = mommy.make('cradmin_listbuilder_guide.Artist')
            self.album = mommy.make('cradmin_listbuilder_guide.Album', artist=self.artist, title='Powerslave')

        def test_render_sanity(self):
            """Is the primary h1 as expected"""
            song = mommy.make('cradmin_listbuilder_guide.Song', album=self.album, title='Aces High')
            mockresponse = self.mock_http200_getrequest_htmls(
                cradmin_role=self.artist,
                viewkwargs={'pk': song.id}
            )
            self.assertTrue(mockresponse.selector.one('.test-primary-h1'))
            expected_h1 = 'Edit song'
            actual_h1 = mockresponse.selector.one('.test-primary-h1').text_normalized
            self.assertEqual(expected_h1, actual_h1)

        def test_missing_required_field_title(self):
            """Should get warning message for title field"""
            song = mommy.make('cradmin_listbuilder_guide.Song', album=self.album, title='Aces High')
            mockresponse = self.mock_http200_postrequest_htmls(
                cradmin_role=self.artist,
                viewkwargs={'pk': song.id},
                requestkwargs={
                    'data': {
                        'title': '',
                        'album': self.album.id
                    }
                }
            )
            self.assertTrue(mockresponse.selector.one('#id_title_wrapper .test-warning-message'))
            expected_message = 'This field is required.'
            actual_message = mockresponse.selector.one('#id_title_wrapper .test-warning-message').text_normalized
            self.assertEqual(expected_message, actual_message)

        def test_post_sanity(self):
            """Should be redirected 302 when edit success"""
            song = mommy.make('cradmin_listbuilder_guide.Song', album=self.album, title='Aces High')
            self.mock_http302_postrequest(
                cradmin_role=self.artist,
                viewkwargs={'pk': song.id},
                requestkwargs={
                    'data': {
                        'title': 'Aces Low',
                        'album': self.album.id
                    }
                }
            )

        def test_correct_song_is_updated(self):
            """With several songs, is the correct song updated"""
            song = mommy.make('cradmin_listbuilder_guide.Song', album=self.album, title='Aces High')
            mommy.make('cradmin_listbuilder_guide.Song', album=self.album, _quantity=9)
            songs_in_db = Song.objects.all()
            self.assertEqual(10, songs_in_db.count())
            self.mock_http302_postrequest(
                cradmin_role=self.artist,
                viewkwargs={'pk': song.id},
                requestkwargs={
                    'data': {
                        'title': 'Ace of Spades',
                        'album': self.album.id
                    }
                }
            )
            songs_in_db = Song.objects.all()
            self.assertEqual(10, songs_in_db.count())
            self.assertTrue(Song.objects.filter(title='Ace of Spades').get())
            self.assertFalse(Song.objects.filter(title='Aces High'))

Next Chapter
============
TODO