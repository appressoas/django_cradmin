from django_cradmin import uicontainer
from django_cradmin import viewhelpers
from django_cradmin.demo.cradmin_listbuilder_guide.models import Album


class AlbumCreateView(viewhelpers.formview.WithinRoleCreateView):
    model = Album
    roleid_field = 'artist'
    fields = [
        'title'
    ]

    def get_form_renderable(self):
        """return the form which to render"""
        return uicontainer.layout.AdminuiPageSectionTight(
            children=[
                uicontainer.form.Form(
                    form=self.get_form(),
                    children=[
                        uicontainer.fieldwrapper.FieldWrapper('title'),
                        uicontainer.button.SubmitPrimary(
                            text='Save'
                        )
                    ]
                )
            ]
        ).bootstrap()

    def save_object(self, form, commit=True):
        new_album = super(AlbumCreateView, self).save_object(form, commit)
        new_album.artist = self.request.cradmin_role
        new_album.full_clean()
        new_album.save()
        return new_album
