from django.contrib import admin
from .models import Sale, SaleItem, CommissionRule


class SaleItemInline(admin.TabularInline):
    model = SaleItem
    extra = 1


@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ("invoice_number", "date", "customer", "seller")
    search_fields = ("invoice_number", "customer__name", "seller__user__email")
    list_filter = ("date", "seller")
    inlines = [SaleItemInline]


@admin.register(CommissionRule)
class CommissionRuleAdmin(admin.ModelAdmin):
    list_display = ("weekday", "min_percentage", "max_percentage")
    list_filter = ("weekday",)