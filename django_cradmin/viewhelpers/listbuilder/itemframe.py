from django_cradmin.viewhelpers.listbuilder import base


class Link(base.ItemFrameRenderer):
    """
    Renders a frame as a link.
    """
    template_name = 'django_cradmin/viewhelpers/listbuilder/itemframe/link.django.html'

    def get_css_classes(self):
        css_classes = super(Link, self).get_css_classes()
        return css_classes + ' django-cradmin-listbuilder-itemframe-link'

    def get_url(self):
        """
        Get the URL the link should go to.

        Defaults to ``value.get_absolute_url``, which means that this
        works out of the box with any Django model object with
        the ``get_absolute_url`` method defined.
        """
        return self.value.get_absolute_url()
