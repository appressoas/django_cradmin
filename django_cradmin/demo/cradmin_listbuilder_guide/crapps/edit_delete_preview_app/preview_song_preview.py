import json

from django.shortcuts import get_object_or_404
from django.utils.translation import ugettext_lazy

from django_cradmin.crispylayouts import PrimarySubmit, DefaultSubmit
from django_cradmin.demo.cradmin_listbuilder_guide.models import Song
from django_cradmin.viewhelpers.formview import PreviewMixin
from django_cradmin.viewhelpers.generic import WithinRoleTemplateView


class PreviewSongView(WithinRoleTemplateView, PreviewMixin):
    """"""
    template_name = 'cradmin_listbuilder_guide/edit_delete_preview_app/preview_song.django.html'

    # def from_valid(self, form):
    #     if self.preview_requested():
    #         self.store_preview_in_session(self.serialize_preview(form))
    #         return self.render_to_response(self.get_context_data(form=form, show_preview=True))
    #
    # def get_buttons(self):
    #     return [
    #         PrimarySubmit('save', ugettext_lazy('Save')),
    #
    #         # When this button is clicked, self.preview_requested() returns True (see form_valid above).
    #         DefaultSubmit(self.submit_preview_name, ugettext_lazy('Preview'))
    #     ]
    #
    # def serialize_preview(self, form):
    #     return json.dumps({
    #         'title': form.cleaned_data['title'],
    #         'description': form.cleaned_data['description'],
    #     })
    #
    # @classmethod
    # def deserialize_preview(cls, serialized):
    #     def deserialize_preview(cls, serialized):
    #         return json.loads(serialized)
    #
    def __get_song(self):
        if self.kwargs['pk'] is None:
            return PreviewSongView.get_preview_data(self.request)
        else:
            album = self.request.cradmin_role
            return get_object_or_404(Song.objects.filter(album=album), pk=self.kwargs['pk'])
    #
    # def get_preview_url(self):
    #     """"""
    #     return self.request.cradmin_app.reverse_appurl('preview')

    def get_context_data(self, **kwargs):
        context = super(PreviewSongView, self).get_context_data(**kwargs)
        self.add_preview_mixin_context_data(context=context)
        context['song'] = self.__get_song()
        return context
