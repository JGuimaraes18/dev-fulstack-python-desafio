from django.contrib import admin
from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("code", "description", "unit_price", "commission_percent")
    search_fields = ("code", "description")
    list_filter = ("commission_percent",)
    
    readonly_fields = ("code",)