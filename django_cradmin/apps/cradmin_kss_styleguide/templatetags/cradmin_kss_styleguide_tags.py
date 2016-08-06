from collections import OrderedDict

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
    def __init__(self, sections_flat):
        self._sectiontree = []
        self._previous_level = None
        for section in sections_flat:
            self.add(section)
        for level in range(self._previous_level - 1):
            self._sectiontree.append('leveldown')

    def add(self, section):
        level = _kss_section_level(section)
        if self._previous_level is not None and self._previous_level != level:
            if level > self._previous_level:
                self._sectiontree.append('levelup')
            else:
                self._sectiontree.append('leveldown')
        self._sectiontree.append(section)
        self._previous_level = level

    def __iter__(self):
        return iter(self._sectiontree)


@register.filter()
def kss_section_level(section):
    return _kss_section_level(section)


@register.simple_tag()
def kss_section_url(styleguideconfig, section):
    level1 = section.reference.split('.')[0]
    url = reverse('cradmin_kss_styleguide_guide', kwargs={
        'unique_id': styleguideconfig.unique_id,
        'prefix': level1
    })
    return '{}#kssref-{}'.format(url, section.reference)


@register.simple_tag()
def render_kss_section_description(styleguideconfig, section):
    description = styleguideconfig.format_description(section)
    return mark_safe(description)


@register.simple_tag()
def render_kss_section_example(styleguideconfig, section):
    return mark_safe(styleguideconfig.format_example(section))


@register.simple_tag(takes_context=True)
def render_kss_section(
        context, styleguideconfig, section):
    return render_to_string(
        template_name=styleguideconfig.get_section_template_name(),
        context={
            'styleguideconfig': styleguideconfig,
            'section': section,
        },
        request=context.get('request', None)
    )


@register.simple_tag(takes_context=True)
def render_kss_toc(context, styleguideconfig, kss_styleguide, prefix=None):
    sections_flat = kss_styleguide.iter_sorted_sections(referenceprefix=prefix)
    return render_to_string(
        template_name=styleguideconfig.get_toc_template_name(),
        context={
            'styleguideconfig': styleguideconfig,
            'sections_flat': sections_flat,
            'sections_tree': KssSectionTree(sections_flat),
        },
        request=context.get('request', None)
    )


@register.simple_tag(takes_context=True)
def render_kss_sections(
        context, styleguideconfig, kss_styleguide, prefix=None):
    sections = kss_styleguide.iter_sorted_sections(referenceprefix=prefix)
    return render_to_string(
        template_name=styleguideconfig.get_sections_template_name(),
        context={
            'styleguideconfig': styleguideconfig,
            'sections': sections,
        },
        request=context.get('request', None)
    )
