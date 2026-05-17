from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from .models import Seller
from .serializers import SellerSerializer


class SellerViewSet(ModelViewSet):
    queryset = Seller.objects.select_related("user").all()
    serializer_class = SellerSerializer
    permission_classes = [IsAuthenticated]
