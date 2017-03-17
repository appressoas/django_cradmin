from django.conf import settings
from django.test import TestCase
from model_mommy import mommy

from django_cradmin import cradmin_testhelpers
from django_cradmin.demo.cradmin_listbuilder_guide.crapps.artist_app import artist_delete_view
from django_cradmin.demo.cradmin_listbuilder_guide.models import Artist


class TestArtistDeleteView(TestCase, cradmin_testhelpers.TestCaseMixin):
    """"""
    viewclass = artist_delete_view.ArtistDeleteView

    def test_get_sanity(self):
        """Should get expected delete question"""
        user = mommy.make(settings.AUTH_USER_MODEL)
        user_two = mommy.make(settings.AUTH_USER_MODEL)
        artist = mommy.make('cradmin_listbuilder_guide.Artist', admins=[user, user_two], name='Anton')
        mockresponse = self.mock_http200_getrequest_htmls(
            cradmin_role=user,
            viewkwargs={'pk': artist.id}
        )
        self.assertTrue(mockresponse.selector.one('#id_deleteview_question'))
        expected_question = 'Are you sure you want to delete "{}"?'.format(artist.name)
        actual_question = mockresponse.selector.one('#id_deleteview_question').alltext_normalized
        self.assertEqual(expected_question, actual_question)

    def test_post_sanity(self):
        """Should get a 302 redirects if successfull deletion"""
        user = mommy.make(settings.AUTH_USER_MODEL)
        user_two = mommy.make(settings.AUTH_USER_MODEL)
        artist = mommy.make('cradmin_listbuilder_guide.Artist', admins=[user, user_two], name='Anton')
        self.mock_http302_postrequest(
            cradmin_role=user,
            viewkwargs={'pk': artist.id}
        )

    def test_deletes_correct_artist(self):
        """If users are admins to several artists, is the correct one delete"""
        user = mommy.make(settings.AUTH_USER_MODEL)
        user_two = mommy.make(settings.AUTH_USER_MODEL)
        artist = mommy.make('cradmin_listbuilder_guide.Artist', admins=[user, user_two], name='Anton')
        artists_in_db = Artist.objects.all()
        mommy.make('cradmin_listbuilder_guide.Artist', _quantity=3, admins=[user, user_two])
        self.assertEqual(4, artists_in_db.count())
        self.mock_http302_postrequest(
            cradmin_role=user,
            viewkwargs={'pk': artist.id}
        )
        artists_in_db = Artist.objects.all()
        self.assertEqual(3, artists_in_db.count())
        self.assertFalse(Artist.objects.filter(name='Anton'))



