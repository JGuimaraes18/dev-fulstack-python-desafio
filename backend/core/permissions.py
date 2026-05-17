from rest_framework.permissions import BasePermission


class IsAdminUserRole(BasePermission):
    # Configuation for ADMIN group permissions
    def has_permission(self, request, view):
        return request.user.groups.filter(name="ADMIN").exists()


class IsSeller(BasePermission):
    # Configuation for SELLER group permissions
    def has_permission(self, request, view):
        return request.user.groups.filter(name="SELLER").exists()


class IsOwnerSale(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # ADMIN access to all sales
        if request.user.groups.filter(name="ADMIN").exists():
            return True

        # SELLER only access their own sales
        return obj.seller.user == request.user


class IsSelfOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # ADMIN permissions allow all actions
        if request.user.groups.filter(name="ADMIN").exists():
            return True

        # SELLER permissions limited actions
        return obj == request.user
