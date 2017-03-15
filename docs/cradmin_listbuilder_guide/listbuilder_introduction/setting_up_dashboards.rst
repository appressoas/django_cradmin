.. _setting_up_dashboards:

=====================
Dashboards for Crapps
=====================

We will create a *main dashboard* which will serve as a gateway to the artist or artists your user can access, so the
CRadmin instance *main_crinstance* will not require a role. The other dashboard *artist_dashboard* will give you access
to the artist by the role queryset in the CRadmin instance *artist_crinstance*. For now we just add content in the
block page cover title in the templates and run a sanity test for each view. Further we test the CRadmin instance which
have a active role queryset.

The creation is pretty much done in the same way for all three cprapps, so we only show the code for one crapp and for
the CRadmin instance which require a role. If you have uncertainties on how this is done, please read the getting
started tutorial :ref:`gettingstarted_part_one`.

CRadmin Application
===================
Our three dashboard views for artist, album and song all extends the *WithinRoleTemplateView*
:class:`django_cradmin.viewhelpers.generic.WithinRoleTemplateView`,  while the main dashboard view extends the
*StandaloneBaseTemplateView* :class:`django_cradmin.viewhelpers.generic.StandaloneBaseTemplateView`.
::

    from django_cradmin import viewhelpers


    class ArtistBashboardView(viewhelpers.generic.WithinRoleTemplateView):
        template_name = 'cradmin_listbuilder_guide/artist_dashboard.django.html'

Template
--------
The dashboard templates for artist-, album- and song view extends the base hmtl in CRadmin. The template for our main
dashboard extends the standalone-base CRadmin html file.
::

    {% extends 'django_cradmin/base.django.html' %}

    {% block page-cover-title %}
        Dashboard for {{ request.cradmin_role }}
    {% endblock page-cover-title %}

App Urls
--------
All dashboard urls have the same structure. Meanwhile the class App is placed within the *__init__.py* file for the
crapps album, artist and song, it is placed in the ``main_dashboard.py`` file for our main dashboard view.
::

    class App(crapp.App):
    appurls = [
        crapp.Url(
            r'^$',
            artist_dashboard.ArtistBashboardView.as_view(),
            name=crapp.INDEXVIEW_NAME
        )
    ]


CRadmin Instances
=================
THe CRadmin instance *main_crinstance* has to super classes, firt the NoRoleMixin and than the BaseCrAdminInstance.
Furthere is has an id of *main_crinstance*. Otherwise it just passes the method for rolequeryset and we set the apps
just like in any other CRadmin instance.

Our artist CRadmin instance looks like:
::

    from django_cradmin import crinstance
    from django_cradmin.demo.cradmin_listbuilder_guide.crapps import album_app
    from django_cradmin.demo.cradmin_listbuilder_guide.crapps import artist_app
    from django_cradmin.demo.cradmin_listbuilder_guide.crapps import song_app
    from django_cradmin.demo.cradmin_listbuilder_guide.models import Artist


    class ArtistCradminInstance(crinstance.BaseCrAdminInstance):
        id = 'artist_crinstance'
        roleclass = Artist
        rolefrontpage_appname = 'dashboard'

        apps = [
            ('dashboard', artist_app.App),
            ('albums', album_app.App),
            ('songs', song_app.App)
        ]

        def get_titletext_for_role(self, role):
            return role.name

        def get_rolequeryset(self):
            queryset = Artist.objects.all()
            if not self.request.user.is_superuser:
                queryset = queryset.filter(admins=self.request.user)
            return queryset

Project Urls
============
Remember to add the CRinstances urls to your project urls. For this tutorial we will use the following urls.
::

    url(r'^listbuilderguide/', include(main_crinstance.MainCradminInstance.urls())),
    url(r'^listbuilderguide/artist/', include(artist_crinstance.ArtistCradminInstance.urls())),

When we combine the urls from our crapps we will get ``localhost/listbuilderguide/artist/1/albums`` when we want to
look at the dashboard for albums. The main dashboard will just be ``localhost/listbuilderguide/``.

Test Our Work
=============
While creating this guide we started with the main dashboard and main CRadmin instance and did some testing before
continuing with implementation of the artist crapp. After testing the artist crapp we moved on to the album crapp. It
is a good habit to doe some coding and test it to make it works as wanted before continuing. The only reason we don't
show the process in detail here is because we covered it very well in the getting started tutorial.

Anyway, below is two sections which shows the testing for the CRadmin instance and application for artist.

Test CRadmin Instance
---------------------

::

    from unittest import mock

    from django.conf import settings
    from django.test import TestCase
    from model_mommy import mommy

    from django_cradmin import cradmin_testhelpers
    from django_cradmin.demo.cradmin_listbuilder_guide.cradmin_instances import artist_crinstance


    class TestArtistCradminInstance(TestCase):
        """"""

        def test_no_superuser_returns_empty_rolequeryset(self):
            """Expects empty role queryset when user is not superuser"""
            mommy.make('cradmin_listbuilder_guide.Artist')
            mockrequest = mock.MagicMock()
            mockrequest.user = mommy.make(settings.AUTH_USER_MODEL)
            crinstance = artist_crinstance.ArtistCradminInstance(request=mockrequest)
            self.assertEqual(0, crinstance.get_rolequeryset().count())

        def test_superuser_is_in_rolequeryset(self):
            """Expects one user in rolequeryset even when the superuser is not admin for artist_app"""
            mommy.make('cradmin_listbuilder_guide.Artist')
            mockrequest = mock.MagicMock()
            mockrequest.user.is_superuser = mommy.make(settings.AUTH_USER_MODEL)
            crinstance = artist_crinstance.ArtistCradminInstance(request=mockrequest)
            self.assertEqual(1, crinstance.get_rolequeryset().count())

        def test_one_user_is_in_rolequeryset(self):
            """Expects one user in rolequeryset even when the Artist have two admins"""
            user = mommy.make(settings.AUTH_USER_MODEL)
            user_two = mommy.make(settings.AUTH_USER_MODEL)
            mommy.make('cradmin_listbuilder_guide.Artist', admins=[user, user_two])
            mockrequest = mock.MagicMock()
            mockrequest.user = user
            crinstance = artist_crinstance.ArtistCradminInstance(request=mockrequest)
            self.assertEqual(1, crinstance.get_rolequeryset().count())

Test Artist Dashboard View
--------------------------

::

    from django.test import TestCase
    from model_mommy import mommy

    from django_cradmin import cradmin_testhelpers
    from django_cradmin.demo.cradmin_listbuilder_guide.crapps.artist_app import artist_dashboard


    class TestArtistDashboardView(TestCase, cradmin_testhelpers.TestCaseMixin):
        viewclass = artist_dashboard.ArtistBashboardView

        def test_get_render_page_sanity(self):
            artist = mommy.make('cradmin_listbuilder_guide.Artist', name='Iron Maiden')
            mockresponse = self.mock_http200_getrequest_htmls(
                cradmin_role=artist
            )
            self.assertTrue(mockresponse.selector.one('.test-primary-h1'))
            expected_h1 = 'Dashboard for {}'.format(artist.name)
            actual_h1 = mockresponse.selector.one('.test-primary-h1').text_normalized
            self.assertEqual(expected_h1, actual_h1)


Next Chapter
============
Continue to :ref:`listbuilder_project_structure`