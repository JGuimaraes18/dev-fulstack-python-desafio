from decimal import Decimal

from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from apps.sales.models import Sale, SaleItem

from .models import CommissionRule


class SaleItemSerializer(serializers.ModelSerializer):
    product_description = serializers.ReadOnlyField(source="product.description")
    unit_price = serializers.ReadOnlyField()
    total_value = serializers.SerializerMethodField()

    class Meta:
        model = SaleItem
        fields = [
            "id",
            "product",
            "product_description",
            "quantity",
            "unit_price",
            "total_value",
        ]

    @extend_schema_field(serializers.DecimalField(max_digits=12, decimal_places=2))
    def get_total_value(self, obj):
        return Decimal(obj.quantity) * obj.unit_price


class SaleSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(many=True)
    total_value = serializers.SerializerMethodField()

    class Meta:
        model = Sale
        fields = [
            "id",
            "invoice_number",
            "date",
            "customer",
            "seller",
            "items",
            "total_value",
        ]
        read_only_fields = ["invoice_number", "date", "seller"]

    @extend_schema_field(serializers.DecimalField(max_digits=12, decimal_places=2))
    def get_total_value(self, obj):
        return sum(item.quantity * item.unit_price for item in obj.items.all())

    def create(self, validated_data):
        items_data = validated_data.pop("items")

        sale = Sale.objects.create(**validated_data)

        for item_data in items_data:
            SaleItem.objects.create(
                sale=sale,
                product=item_data["product"],
                quantity=item_data["quantity"],
                unit_price=item_data["product"].unit_price,
            )

        return sale

    def update(self, instance, validated_data):
        items_data = validated_data.pop("items", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if items_data is not None:
            instance.items.all().delete()

            for item_data in items_data:
                SaleItem.objects.create(
                    sale=instance,
                    product=item_data["product"],
                    quantity=item_data["quantity"],
                    unit_price=item_data["product"].unit_price,
                )

        return instance

    def validate(self, attrs):
        items = attrs.get("items")

        if not items:
            raise serializers.ValidationError(
                {"items": "A venda deve possuir ao menos um item."}
            )

        return attrs


class CommissionRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommissionRule
        fields = [
            "id",
            "weekday",
            "min_percentage",
            "max_percentage",
        ]


class CommissionReportSerializer(serializers.Serializer):
    seller_id = serializers.IntegerField()
    seller_name = serializers.CharField()
    total_sales = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_commission = serializers.DecimalField(max_digits=12, decimal_places=2)
