from django_cradmin import uicontainer
from django_cradmin import viewhelpers
from django_cradmin.demo.cradmin_listbuilder_guide.models import Song


class SongCreateView(viewhelpers.formview.WithinRoleCreateView):
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
