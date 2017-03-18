from django_cradmin import uicontainer
from django_cradmin.demo.cradmin_listbuilder_guide.models import Album


class AlbumCreateUpdateMixin(object):
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


class AlbumQuerysetForRoleMixin(object):
    """
    Used to ensure just available objects for the correct role is returned for create, edit and delete views
    """

    def get_queryset_for_role(self):
        return Album.objects.filter(artist=self.request.cradmin_role)
