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

    def get_html(self, fictional_figure):
        html = format_html(
            '<strong>{name}</strong>',
            name=fictional_figure.name)
        if fictional_figure.about:
            html += format_html(
                ' &mdash; <small>{about}</small>',
                about=fictional_figure.about)
        return html
