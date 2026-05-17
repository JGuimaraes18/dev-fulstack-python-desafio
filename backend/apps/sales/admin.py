from django.contrib import admin

from .models import CommissionRule, Sale, SaleItem


def is_admin(user):
    return user.groups.filter(name="ADMIN").exists()


class SaleItemInline(admin.TabularInline):
    model = SaleItem
    extra = 1
    exclude = ("unit_price",)


@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ("invoice_number", "date", "customer", "seller")
    search_fields = ("customer__name", "seller__user__email")
    list_filter = ("date", "seller")
    inlines = [SaleItemInline]

    def get_queryset(self, request):
        qs = super().get_queryset(request)

        if is_admin(request.user):
            return qs

        return qs.filter(seller__user=request.user)

    def get_fields(self, request, obj=None):
        base_fields = ["customer"]

        if is_admin(request.user):
            base_fields.append("seller")

        return base_fields

    def save_model(self, request, obj, form, change):
        if not change and not is_admin(request.user):
            obj.seller = request.user.seller_profile

        super().save_model(request, obj, form, change)

    def has_change_permission(self, request, obj=None):
        if is_admin(request.user):
            return True

        if obj is None:
            return True

        return False

    def has_delete_permission(self, request, obj=None):
        return is_admin(request.user)


@admin.register(CommissionRule)
class CommissionRuleAdmin(admin.ModelAdmin):
    list_display = ("weekday", "min_percentage", "max_percentage")
    list_filter = ("weekday",)
