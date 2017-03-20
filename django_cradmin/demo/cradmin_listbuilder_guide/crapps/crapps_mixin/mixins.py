from django_cradmin import uicontainer
from django_cradmin.demo.cradmin_listbuilder_guide.models import Song
from django_cradmin.viewhelpers.formview import WithinRoleCreateView
from django_cradmin.viewhelpers.formview import WithinRoleDeleteView
from django_cradmin.viewhelpers.formview import WithinRoleUpdateView


class SongCreateUpdateFormMixin(object):
    """Used to render form for create and edit view"""
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


class SongRolequeryMixin(object):
    """Used to make sure only users with the correct role gets access to objects"""
    def get_queryset_for_role(self):
        return Song.objects.filter(album=self.request.cradmin_role)


class SongCreateView(SongCreateUpdateFormMixin, WithinRoleCreateView):
    """"""


class SongDeleteView(SongRolequeryMixin, WithinRoleDeleteView):
    """"""


class SongEditView(SongRolequeryMixin, SongCreateUpdateFormMixin, WithinRoleUpdateView):
    """"""
