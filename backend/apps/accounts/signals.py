from django.contrib.auth.models import Group, Permission
from django.db.models.signals import post_migrate
from django.dispatch import receiver


@receiver(post_migrate, dispatch_uid="create_roles_signal")
def create_roles(sender, **kwargs):

    seller_group, _ = Group.objects.get_or_create(name="SELLER")
    admin_group, _ = Group.objects.get_or_create(name="ADMIN")

    seller_permissions = Permission.objects.filter(
        codename__in=[
            "add_customer",
            "change_customer",
            "view_customer",
            "add_sale",
            "change_sale",
            "view_sale",
            "add_saleitem",
            "change_saleitem",
            "view_saleitem",
            "view_product",
        ]
    )

    seller_group.permissions.set(seller_permissions)

    admin_permissions = Permission.objects.exclude(
        content_type__app_label__in=[
            "auth",
            "admin",
            "contenttypes",
            "sessions",
        ]
    )

    admin_group.permissions.set(admin_permissions)
