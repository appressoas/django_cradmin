from __future__ import unicode_literals
from django.template import Library
from django_cradmin import javascriptregistry

register = Library()


class JavascriptRegistryTemplateTagError(Exception):
    pass


def _get_components_from_context(context):
    if 'cradmin_javascriptregistry_component_ids' not in context:
        raise JavascriptRegistryTemplateTagError(
            'The cradmin_javascriptregistry_component_ids variable is not in the '
            'template context.')  # TODO mention the view class mixin
    if 'request' not in context:
        raise JavascriptRegistryTemplateTagError(
            'The request variable is not in the template context. '
            'You can get this using the "django.template.context_processors.request" context processor.')
    component_ids = context['cradmin_javascriptregistry_component_ids']
    request = context['request']
    registry = javascriptregistry.Registry.get_instance()
    components = registry.get_component_objects(request=request, component_ids=component_ids)
    return components


@register.inclusion_tag('django_cradmin/templatetags/javascriptregistry/cradmin_javascriptregistry_head.django.html',
                        takes_context=True)
def cradmin_javascriptregistry_head(context):
    """
    Renders the jsregistry code for the ``<head>`` tag.

    Raises:

    """
    return {
        'components': _get_components_from_context(context=context)
    }
