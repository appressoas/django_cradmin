from django_cradmin import uicontainer
from django_cradmin.demo.cradmin_listbuilder_guide.models import Artist


class ArtistCreateEditMixin(object):
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


class ArtistQuerysetForRoleMixin(object):
    def get_queryset_for_role(self):
        return Artist.objects.filter(id=self.request.cradmin_role.id)
