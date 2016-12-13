from django.template.loader import render_to_string
from django.utils.html import format_html
from rest_framework import serializers

from django_cradmin.demo.cradmin_javascript_demos.models import FictionalFigure


class FictionalFigureSerializer(serializers.ModelSerializer):
    title = serializers.ReadOnlyField(source='name')
    description = serializers.ReadOnlyField(source='about')
    html = serializers.SerializerMethodField()

    class Meta:
        model = FictionalFigure
        fields = ('id', 'title', 'description', 'html')

    def _get_styled_html(self, fictional_figure):
        return render_to_string(
            'cradmin_javascript_demos/data_list_widget_includes/styled_simple_html_list_element.django.html',
            context={'fictional_figure': fictional_figure},
            request=self.context['request']
        )

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
