from django.template.loader import render_to_string
from django.utils.html import format_html
from rest_framework import serializers

from django_cradmin.demo.cradmin_javascript_demos.models import FictionalFigure
from django_cradmin.renderable import AbstractRenderableWithCss


class StyledHtmlRenderable(AbstractRenderableWithCss):
    template_name = 'cradmin_javascript_demos/data_list_widget_includes/styled_simple_html_list_element.django.html'

    def __init__(self, fictional_figure):
        self.fictional_figure = fictional_figure

    def get_css_classes_list(self):
        return ['blocklist__item', 'blocklist__item--link']


class FictionalFigureSerializer(serializers.ModelSerializer):
    title = serializers.ReadOnlyField(source='name')
    description = serializers.ReadOnlyField(source='about')
    html = serializers.SerializerMethodField()

    class Meta:
        model = FictionalFigure
        fields = ('id', 'title', 'description', 'html')

    def _get_styled_html(self, fictional_figure):
        renderable = StyledHtmlRenderable(fictional_figure=fictional_figure)
        return renderable.render(request=self.context['request'])

    def _get_simple_html(self, fictional_figure):
        html = format_html(
            '<strong>{name}</strong>',
            name=fictional_figure.name)
        if fictional_figure.about:
            html += format_html(
                ' &mdash; <small>{about}</small>',
                about=fictional_figure.about)
        return html

    def get_html(self, fictional_figure):
        html_format = self.context['request'].query_params.get('html_format', 'simple')

        if html_format == 'styled':
            return self._get_styled_html(fictional_figure)

        if html_format == 'simple':
            return self._get_simple_html(fictional_figure)

        raise Exception("Invalid html_format: {!r}".format(html_format))
