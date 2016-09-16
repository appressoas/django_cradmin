from ..container import AbstractContainerRenderable
from . import mixins


class FieldSetRenderable(AbstractContainerRenderable, mixins.FormRenderableChildMixin):
    template_name = 'django_cradmin/uicontainer/uiforms/fieldset.django.html'

    def __init__(self, title, **kwargs):
        self.title = title
        super(FieldSetRenderable, self).__init__(**kwargs)

    def get_wrapper_htmltag(self):
        return 'fieldset'
