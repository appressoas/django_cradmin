from __future__ import unicode_literals

from django_cradmin import renderable


class ContainerRenderable(renderable.AbstractRenderableWithCss):
    valuealias = None
    template_name = 'uicontainer/base/container_renderable.django.html'

    def __init__(self, value, childcontainers=None):
        self.value = None
        self.set_value(value=value)
        self._childcontainers = []
        if childcontainers:
            for childcontainer in childcontainers:
                self.add_childcontainer(childcontainer)

    def add_childcontainer(self, childcontainer):
        self._childcontainers.append(childcontainer)

    def iter_childcontainers(self):
        return iter(self._childcontainers)

    def set_value(self, value):
        self.value = value
        if self.valuealias:
            setattr(self, self.valuealias, self.value)
