from ..container import AbstractContainerRenderable
from . import mixins


class FieldSet(AbstractContainerRenderable, mixins.FormRenderableChildMixin):
    template_name = 'django_cradmin/uicontainer/uiforms/fieldset.django.html'

    def __init__(self, title, **kwargs):
        self.title = title
        super(FieldSet, self).__init__(**kwargs)

    def get_default_html_tag(self):
        return 'fieldset'
