from django.contrib import admin
from django.contrib.auth import get_user_model

from .models import Seller

User = get_user_model()


def seller_users():
    return User.objects.filter(groups__name="SELLER", is_active=True)


@admin.register(Seller)
class SellerAdmin(admin.ModelAdmin):
    list_display = ("get_name", "get_email", "phone")
    search_fields = ("user__first_name", "user__last_name", "user__email", "phone")

    @admin.display(description="Nome")
    def get_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

    @admin.display(description="Email")
    def get_email(self, obj):
        return obj.user.email

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "user":
            kwargs["queryset"] = seller_users()

        return super().formfield_for_foreignkey(db_field, request, **kwargs)
