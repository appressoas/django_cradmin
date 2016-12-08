from rest_framework import serializers

from django_cradmin.demo.cradmin_javascript_demos.models import FictionalFigure


class FictionalFigureSerializer(serializers.ModelSerializer):
    title = serializers.ReadOnlyField(source='name')
    description = serializers.ReadOnlyField(source='about')

    class Meta:
        model = FictionalFigure
        fields = ('id', 'title', 'description')
