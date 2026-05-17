from rest_framework import serializers

from .models import Seller


class SellerSerializer(serializers.ModelSerializer):
    user_email = serializers.ReadOnlyField(source="user.email")

    class Meta:
        model = Seller
        fields = ["id", "user", "user_email", "phone"]
