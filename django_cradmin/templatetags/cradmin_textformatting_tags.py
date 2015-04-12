from __future__ import unicode_literals
from builtins import str
from collections import OrderedDict
import textwrap
from django import template
from django.template.base import parse_bits

register = template.Library()


class WrapTextNode(template.Node):
    def __init__(self, nodelist, max_line_length, indentspaces=0):
        self.nodelist = nodelist
        self.max_line_length = max_line_length
        self.indentspaces = indentspaces
        # self.max_line_length = 10
        # self.indentspaces = 4
        # self.max_line_length = int(max_line_length[0])
        # self.indentspaces = int(indentspaces['indentspaces'])

    def render(self, context):
        output = self.nodelist.render(context)
        indent = ' ' * self.indentspaces
        wrapper = textwrap.TextWrapper(
            width=self.max_line_length,
            break_long_words=False,
            initial_indent=indent,
            subsequent_indent=indent)
        return wrapper.fill(output)


def parse_templatetag_arguments(parser, token, specification):
    split = token.split_contents()
    tag_name = split[0]
    bits = split[1:]

    params = list(specification.keys())

    args, kwargs = parse_bits(parser, bits,
                              params=params,
                              varargs=None, varkw=None,
                              defaults=[],
                              name='unused',
                              takes_context=False)
    for key in kwargs:
        kwargs[key] = str(kwargs[key])

    all_args_dict = {}
    for index, param in enumerate(params):
        try:
            value = args[index]
        except IndexError:
            try:
                defaultvalue = specification[param]['default']
            except KeyError:
                raise template.TemplateSyntaxError("{!r} tags '{}'-argument is required".format(
                    tag_name, param))
            else:
                value = kwargs.get(param, defaultvalue)
        typecast = specification[param]['typecast']
        try:
            all_args_dict[param] = typecast(str(value))
        except ValueError:
            raise template.TemplateSyntaxError("{!r} tags '{}'-argument must be an {}".format(
                tag_name, param, typecast))
    return tag_name, all_args_dict


@register.tag
def cradmin_wrap_text(parser, token):
    tag_name, kwargs = parse_templatetag_arguments(
        parser, token,
        specification=OrderedDict([
            ('max_line_length', {'typecast': int}),
            ('indentspaces', {'default': 0, 'typecast': int}),
        ]))

    max_line_length = kwargs['max_line_length']
    indentspaces = kwargs['indentspaces']
    nodelist = parser.parse(('end_cradmin_wrap_text',))
    parser.delete_first_token()
    return WrapTextNode(nodelist, max_line_length, indentspaces=indentspaces)
