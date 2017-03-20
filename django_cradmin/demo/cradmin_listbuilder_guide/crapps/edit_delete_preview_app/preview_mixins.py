from django_cradmin import uicontainer
from django_cradmin.demo.cradmin_listbuilder_guide.models import Song


class EditDeletePreviewFormMixin(object):
    """Mixin class used for form rendering"""
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


class EditDeletePreviewRolequeryMixin(object):
    """Mixin class for role query"""
    def get_queryset_for_role(self):
        return Song.objects.filter(album=self.request.cradmin_role)