from django.contrib import admin
from django.db.models import DecimalField, ExpressionWrapper, F, Sum
from django.db.models.functions import Coalesce
from .models import Customer
from apps.sales.models import Sale, SaleItem


def is_admin(user):
    print(user.groups)
    return user.groups.filter(name="ADMIN").exists()


class SaleItemInline(admin.TabularInline):
    model = SaleItem
    extra = 0
    can_delete = False
    readonly_fields = (
        "product",
        "quantity",
        "unit_price",
        "total_value_display",
    )

    def total_value_display(self, obj):
        return obj.total_value
    total_value_display.short_description = "Total"

    def has_add_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False


class SaleInline(admin.TabularInline):
    model = Sale
    extra = 0
    can_delete = False
    show_change_link = True

    readonly_fields = (
        "invoice_number",
        "date",
        "seller",
        "total_amount_display",
    )

    fields = (
        "invoice_number",
        "date",
        "seller",
        "total_amount_display",
    )

    def total_amount_display(self, obj):
        return obj.total_amount
    total_amount_display.short_description = "Total da Venda"

    def has_add_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return is_admin(request.user)


# ===============================
# CUSTOMER ADMIN
# ===============================
@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "email",
        "phone",
        "total_spent_display",
    )

    search_fields = ("name", "email", "phone")

    inlines = [SaleInline]

    def get_queryset(self, request):
        qs = super().get_queryset(request)

        total_expression = ExpressionWrapper(
            F("sales__items__quantity") * F("sales__items__unit_price"),
            output_field=DecimalField(max_digits=12, decimal_places=2),
        )

        return qs.annotate(
            total_spent=Coalesce(
                Sum(total_expression),
                0,
                output_field=DecimalField(max_digits=12, decimal_places=2),
            )
        )

    def total_spent_display(self, obj):
        return obj.total_spent
    total_spent_display.short_description = "Total Gasto"