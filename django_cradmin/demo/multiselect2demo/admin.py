from __future__ import unicode_literals
from django.contrib import admin
from django_cradmin.demo.multiselect2demo.models import Product


class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'name',
        'description',
    ]

    def get_queryset(self, request):
        return super(ProductAdmin, self).get_queryset(request)\
            .select_related('site')

admin.site.register(Product, ProductAdmin)
