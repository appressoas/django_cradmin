from django.contrib import admin

from django_cradmin.demo.cradmin_javascript_demos.models import FictionalFigure, FictionalFigureCollection


@admin.register(FictionalFigure)
class FictionalFigureAdmin(admin.ModelAdmin):
    list_display = [
        'name',
        'about',
    ]
    search_fields = [
        'name',
        'about'
    ]


@admin.register(FictionalFigureCollection)
class FictionalFigureCollectionAdmin(admin.ModelAdmin):
    list_display = [
        'name'
    ]
    search_fields = [
        'name'
    ]
