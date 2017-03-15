from django.contrib.auth.models import User

from django_cradmin import uicontainer
from django_cradmin import viewhelpers
from django_cradmin.crinstance import reverse_cradmin_url
from django_cradmin.demo.cradmin_listbuilder_guide.models import Artist
from django_cradmin.templatetags.cradmin_tags import cradmin_url


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
