from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from core.permissions import IsSelfOrAdmin

from .models import User
from .serializers import UserSerializer


class UserViewSet(ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsSelfOrAdmin]

    def get_queryset(self):
        user = self.request.user

        if user.groups.filter(name="ADMIN").exists():
            return User.objects.all()

        return User.objects.filter(id=user.id)
