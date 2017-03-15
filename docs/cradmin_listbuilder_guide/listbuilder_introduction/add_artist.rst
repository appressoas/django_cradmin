.. _listbuilderguide_add_artist:

==========
Add Artist
==========

We need the opportunity to add artists from our main dashboard, so we dont have to go to the Django Admin each time we
want to create a new artist. This means we will go from a view with no role to a view with a role. Eventhough this is
done in the getting started tutorial, we show how it can be done one more time.

CRadmin Instance
================
In the main CRadmin instance we add the one application which points to the *artist_app*.
::


        apps = [
            ('main', main_dashboard.App),
            ('artist', artist_app.App)
        ]

CRadmin Application
===================
In our crapps named *artist_app* we add a new file named ``artist_create_view.py``. The class in this file extends the
formview *WithinRoleCreateView* which is a modelform. We need to add the user as one of the admins and we want to take
the user to te dashboard of the *artist_app* after successfully adding a new artist instance.
::

    from django.contrib.auth.models import User

    from django_cradmin import uicontainer
    from django_cradmin import viewhelpers
    from django_cradmin.crinstance import reverse_cradmin_url
    from django_cradmin.demo.cradmin_listbuilder_guide.models import Artist


    class ArtistCreateView(viewhelpers.formview.WithinRoleCreateView):
        model = Artist
        roleid_field = 'artist'
        fields = [
            'name'
        ]

        def get_form_renderable(self):
            return uicontainer.layout.AdminuiPageSectionTight(
                children=[
                    uicontainer.form.Form(
                        form=self.get_form(),
                        children=[
                            uicontainer.fieldwrapper.FieldWrapper('name'),
                            uicontainer.button.SubmitPrimary(
                                text='Save')
                        ]
                    )
                ]
            ).bootstrap()

        def save_object(self, form, commit=True):
            self.artist = super(ArtistCreateView, self).save_object(form, commit)
            self.artist.admins.add(self.request.user)
            self.artist.full_clean()
            self.artist.save()
            return self.artist

        def get_success_url(self):
            """Take the user to the index for artist_app when success"""
            return reverse_cradmin_url(
                instanceid='artist_crinstance',
                appname='dashboard',
                roleid=self.artist.id
            )

CRadmin Application Url
=======================
In the init file of our *artist_app* we add the following crapp url

::

    crapp.Url(
            r'^create$',
            artist_create_view.ArtistCreateView.as_view(),
            name='create'
        )

Main Dashboard Template
=======================
In the template of our main dashboard we add a content block with a button which takes the user to the modelform of our
create artist view.

::

    {% block content %}
        <section class="adminui-page-section">
            <div class="container container--tight">
                <a class="button button--compact button--primary"
                   href="{% cradmin_instance_url appname='artist' viewname='create' %}">
                    Add New Artist
                </a>
            </div>
        </section>
    {% endblock content %}

Dangerous Url
=============
We have now created something which works good if the user does as he/she/hen is suposed to do. However, if you try the
url ``localhost/listbuilderguide/artist`` you will come to page with the page cover title of *Dashboard for None*.

Tests
=====
As usually we test our work for at least it's sanity.

::

    from unittest import mock

    from django.conf import settings
    from django.test import TestCase
    from model_mommy import mommy

    from django_cradmin import cradmin_testhelpers
    from django_cradmin.demo.cradmin_listbuilder_guide.crapps.artist_app import artist_create_view
    from django_cradmin.demo.cradmin_listbuilder_guide.models import Artist


    class TestArtistCreateView(TestCase, cradmin_testhelpers.TestCaseMixin):
        """"""
        viewclass = artist_create_view.ArtistCreateView

        def test_render_form_sanity(self):
            """Has the primary h1 the expected value"""
            mockresponse = self.mock_http200_getrequest_htmls()
            self.assertTrue(mockresponse.selector.one('.test-primary-h1'))
            self.assertEqual('Create artist', mockresponse.selector.one('.test-primary-h1').text_normalized)

        def test_not_required_name_field(self):
            """Should get a 200 response when not filling in artist name"""
            mockresponse = self.mock_http200_postrequest_htmls(
                requestkwargs={
                    'data': {
                        'name': ''
                    }
                }
            )
            self.assertTrue(mockresponse.selector.one('#id_name_wrapper .test-warning-message'))
            expected_warning_message = 'This field is required.'
            actual_warning_message = mockresponse.selector.one('#id_name_wrapper .test-warning-message').text_normalized
            self.assertEqual(expected_warning_message, actual_warning_message)

        def test_post_sanity(self):
            """Should get a 302 redirect after filling in required form values"""
            user = mommy.make(settings.AUTH_USER_MODEL)
            self.mock_http302_postrequest(
                requestkwargs={
                    'data': {
                        'name': 'Iron Maiden'
                    }
                }
            )

        def test_new_artist_in_database_when_successfull_post(self):
            """In the db there should be one Artist with the same name as posted"""
            artists_in_db = Artist.objects.all().count()
            self.assertEqual(0, artists_in_db)
            self.mock_http302_postrequest(
                requestkwargs={
                    'data': {
                        'name': 'Ozzy'
                    }
                }
            )
            artists_in_db = Artist.objects.all().count()
            self.assertEqual(1, artists_in_db)
            self.assertTrue(Artist.objects.filter(name='Ozzy').get())

        def test_add_admin_sanity(self):
            """When creating a new artist instance, the logged in user should be added as admin"""
            mockuser = mock.MagicMock()
            mockuser.user = mommy.make(settings.AUTH_USER_MODEL)
            self.mock_http302_postrequest(
                requestuser=mockuser.user,
                requestkwargs={
                    'data': {
                        'name': 'My Artist'
                    }
                }
            )
            # get the first of the many to many field
            artist = Artist.objects.filter(name='My Artist').get()
            admins = artist.admins.all()
            admin = admins[0]
            # is the user an admin
            self.assertEqual(mockuser.user, admin)

Next Chapter
============
TODO