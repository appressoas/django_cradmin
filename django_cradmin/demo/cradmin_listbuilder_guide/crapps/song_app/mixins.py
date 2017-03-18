from django_cradmin import uicontainer
from django_cradmin import viewhelpers
from django_cradmin.demo.cradmin_listbuilder_guide.models import Song


class SongCreateUpdateFormMixin(object):
    """"""
    model = Song
    roleid_field = 'album'
    fields = [
        'title',
        'written_by',
        'time'
    ]

    def get_form_renderable(self):
        return uicontainer.layout.AdminuiPageSectionTight(
            children=[
                uicontainer.form.Form(
                    form=self.get_form(),
                    children=[
                        uicontainer.fieldwrapper.FieldWrapper(
                            fieldname='title'
                        ),
                        uicontainer.fieldwrapper.FieldWrapper(
                            fieldname='written_by'
                        ),
                        uicontainer.fieldwrapper.FieldWrapper(
                            fieldname='time'
                        ),
                        uicontainer.button.SubmitPrimary(
                            text='Save'
                        )
                    ]
                )
            ]
        ).bootstrap()
