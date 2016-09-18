from django import template
from django.template.loader import render_to_string
from django.urls import reverse
from django.utils.safestring import mark_safe

register = template.Library()


def _get_kss_sections(kss_styleguide, prefix=None):
    sections = kss_styleguide.sections.values()
    if prefix:
        sections = filter(lambda s: s.reference.startswith(prefix), sections)
    sections = sorted(sections, key=lambda s: s.reference)
    return sections


def _kss_section_level(section):
    return section.reference.count('.') + 1


class KssSectionTree(object):
    def __init__(self, sectiontree):
        self._sectiontree = []
        self._previous_node = sectiontree
        for node in sectiontree.sorted_all_descendants_flat():
            self.add(node)
            self._previous_node = node
        if self._previous_node != sectiontree:
            for level in range(self._previous_node.level - 1):
                self._sectiontree.append('leveldown')

    def add(self, node):
        if self._previous_node.level != node.level and self._previous_node.level != -1:
            if node.level > self._previous_node.level:
                self._sectiontree.append('levelup')
            else:
                self._sectiontree.append('leveldown')
        self._sectiontree.append(node)

    def __iter__(self):
        return iter(self._sectiontree)


@register.filter()
def kss_section_level(section):
    return _kss_section_level(section)


@register.simple_tag()
def kss_section_url(styleguideconfig, node):
    levels = 2
    if node.level == 0:
        levels = 1
    prefix = '.'.join(node.reference.split('.')[0:levels])
    url = reverse('cradmin_kss_styleguide_guide', kwargs={
        'unique_id': styleguideconfig.unique_id,
        'prefix': prefix
    })
    return '{}#kssref-{}'.format(url, node.reference)


@register.simple_tag()
def render_kss_section_description(styleguideconfig, section):
    description = styleguideconfig.format_description(section)
    return mark_safe(description)


@register.simple_tag()
def render_kss_section_example(styleguideconfig, section):
    return mark_safe(styleguideconfig.format_example(section))


@register.simple_tag(takes_context=True)
def render_kss_section(
        context, styleguideconfig, node):
    return render_to_string(
        template_name=styleguideconfig.get_section_template_name(),
        context={
            'styleguideconfig': styleguideconfig,
            'node': node,
        },
        request=context.get('request', None)
    )


@register.simple_tag(takes_context=True)
def render_kss_sections(
        context, styleguideconfig, kss_styleguide, prefix=None):
    node = kss_styleguide.as_tree()
    if prefix:
        node = node.get_node_by_reference(prefix)

    return render_to_string(
        template_name=styleguideconfig.get_sections_template_name(),
        context={
            'styleguideconfig': styleguideconfig,
            'node': node,
        },
        request=context.get('request', None)
    )


@register.simple_tag(takes_context=True)
def render_kss_toc_node(context, styleguideconfig, node):
    return render_to_string(
        template_name=styleguideconfig.get_toc_node_template_name(),
        context={
            'styleguideconfig': styleguideconfig,
            'node': node,
        },
        request=context.get('request', None)
    )


@register.simple_tag(takes_context=True)
def render_kss_toc(context, styleguideconfig, kss_styleguide):
    sectiontree = kss_styleguide.as_tree()
    return render_to_string(
        template_name=styleguideconfig.get_toc_template_name(),
        context={
            'styleguideconfig': styleguideconfig,
            'sectiontree': sectiontree,
        },
        request=context.get('request', None)
    )
