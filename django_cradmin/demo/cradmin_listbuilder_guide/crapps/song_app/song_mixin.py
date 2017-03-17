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
                        uicontainer.fieldwrapper.FieldWrapper(
                            fieldname='title'),
                        uicontainer.fieldwrapper.FieldWrapper(
                            fieldname='album',
                            field_renderable=uicontainer.field.Select()
                        ),
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
