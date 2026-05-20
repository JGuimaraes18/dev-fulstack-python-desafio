from django.conf import settings
from django.contrib.auth.models import Group, Permission
from django.db.models.signals import post_migrate, post_save
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

@receiver(post_save, sender=settings.AUTH_USER_MODEL, dispatch_uid="add_superuser_to_admin_group_signal")
def add_superuser_to_admin_group(sender, instance, created, **kwargs):
    # Executa apenas se o usuário acabou de ser criado e se ele for superuser
    if created and instance.is_superuser:
        try:
            # O grupo ADMIN já foi criado no post_migrate acima, então damos apenas um .get()
            admin_group = Group.objects.get(name="ADMIN")
            instance.groups.add(admin_group)
            print(f"Sucesso: Superusuário {instance.email} vinculado ao grupo ADMIN.")
        except Group.DoesNotExist:
            print("Aviso: O grupo ADMIN não foi encontrado para vincular o superusuário.")
        except Exception as e:
            print(f"Erro ao vincular superusuário ao grupo: {e}")