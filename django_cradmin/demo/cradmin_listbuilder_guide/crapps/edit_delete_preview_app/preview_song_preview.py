from django.shortcuts import get_object_or_404
from django.views.generic import TemplateView

from django_cradmin.demo.cradmin_listbuilder_guide.models import Song
from django_cradmin.viewhelpers.formview import PreviewMixin


class PreviewSongView(TemplateView, PreviewMixin):
    """"""
    template_name = 'cradmin_listbuilder_guide/edit_delete_preview_app/preview_song.django.html'

    def __get_song(self):
        if self.kwargs['pk'] is None:
            return PreviewSongView.get_preview_data(self.request)
        else:
            # NOTE: The queryset ensures only admins on the current site gains access.
            album = self.request.cradmin_role
            return get_object_or_404(Song.objects.filter(album=album), pk=self.kwargs['pk'])

    def get_context_data(self, **kwargs):
        context = super(PreviewSongView, self).get_context_data(**kwargs)
        self.add_preview_mixin_context_data(context=context)
        context['song'] = self.__get_song()
        return context
