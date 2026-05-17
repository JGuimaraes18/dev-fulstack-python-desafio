from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group

from .models import User

admin.site.unregister(Group)


class GroupAdmin(admin.ModelAdmin):
    def _is_superuser(self, request):
        return request.user.is_superuser

    def has_module_permission(self, request):
        return self._is_superuser(request)

    def has_view_permission(self, request, obj=None):
        return self._is_superuser(request)

    def has_add_permission(self, request):
        return self._is_superuser(request)

    def has_change_permission(self, request, obj=None):
        return self._is_superuser(request)

    def has_delete_permission(self, request, obj=None):
        return self._is_superuser(request)


admin.site.register(Group, GroupAdmin)


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User

    list_display = ("email", "first_name", "last_name", "is_staff", "is_active")
    list_filter = ("is_staff", "is_active")
    search_fields = ("email", "first_name", "last_name")
    ordering = ("email",)

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Informações pessoais", {"fields": ("first_name", "last_name")}),
        ("Permissões", {"fields": ("is_active", "is_staff", "is_superuser", "groups")}),
        ("Datas", {"fields": ("last_login",)}),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "first_name",
                    "last_name",
                    "password1",
                    "password2",
                    "is_staff",
                    "is_active",
                    "groups",
                ),
            },
        ),
    )

    def get_fieldsets(self, request, obj=None):
        if request.user.is_superuser:
            return super().get_fieldsets(request, obj)

        return (
            (None, {"fields": ("email", "password")}),
            ("Informações pessoais", {"fields": ("first_name", "last_name")}),
            ("Permissões", {"fields": ("is_active", "is_staff", "groups")}),
            ("Datas", {"fields": ("last_login",)}),
        )
