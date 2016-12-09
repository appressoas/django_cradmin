from django.db import models
from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination

from django_cradmin.demo.cradmin_javascript_demos import demo_serializers
from django_cradmin.demo.cradmin_javascript_demos.models import FictionalFigure


class FictionalFigurePagination(PageNumberPagination):
    page_size = 3


class FictionalFigureViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = demo_serializers.FictionalFigureSerializer
    pagination_class = FictionalFigurePagination

    def get_queryset(self):
        # WARNING: In a real world use case, you will often want to restrict permissions,
        #          instead of giving anyone access to everything!
        queryset = FictionalFigure.objects.all()
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                models.Q(name__icontains=search) |
                models.Q(about__icontains=search)
            )
        return queryset
