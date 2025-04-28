from django.contrib import admin
from signs.models import UnitedSign


@admin.register(UnitedSign)
class UnitedSignAdmin(admin.ModelAdmin):
    list_display = (
        'gibdd_unical_id',
        'commerce_internal_id',
        'name',
        'latitude',
        'longitude',
        'gibdd_description',
        'commerce_description',
        'source',
        'status',
    )
    list_per_page = 20
