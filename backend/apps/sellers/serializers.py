from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from .models import Seller


class SellerSerializer(serializers.ModelSerializer):
    first_name = serializers.ReadOnlyField(source="user.first_name")
    last_name = serializers.ReadOnlyField(source="user.last_name")
    email = serializers.ReadOnlyField(source="user.email")
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Seller
        fields = [
            "id",
            "user",
            "first_name",
            "last_name",
            "full_name",
            "email",
            "phone",
        ]

    @extend_schema_field(serializers.CharField())
    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip()
