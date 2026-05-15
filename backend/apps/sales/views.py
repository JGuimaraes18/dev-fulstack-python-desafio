from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import Sale
from .serializers import SaleSerializer
from core.permissions import IsOwnerSale


class SaleViewSet(ModelViewSet):
    serializer_class = SaleSerializer
    permission_classes = [IsAuthenticated, IsOwnerSale]

    def _is_admin(self, user):
        return user.groups.filter(name="ADMIN").exists()

    def get_queryset(self):
        user = self.request.user

        if self._is_admin(user):
            return Sale.objects.all()

        return Sale.objects.filter(seller__user=user)

    def perform_create(self, serializer):
        user = self.request.user

        if self._is_admin(user):
            serializer.save()
        else:
            serializer.save(seller=user.seller_profile)

    def update(self, request, *args, **kwargs):
        if not self._is_admin(request.user):
            raise PermissionDenied("Vendedor não pode alterar venda.")

        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if not self._is_admin(request.user):
            raise PermissionDenied("Vendedor não pode excluir venda.")

        return super().destroy(request, *args, **kwargs)