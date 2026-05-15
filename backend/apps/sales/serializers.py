from decimal import Decimal
from rest_framework import serializers
from apps.sales.models import Sale, SaleItem


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

    def get_total_value(self, obj):
        return sum(
            Decimal(item.quantity) * item.unit_price
            for item in obj.items.all()
        )

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        request = self.context["request"]
        user = request.user

        if user.groups.filter(name="ADMIN").exists():
            seller = validated_data.get("seller")
        else:
            seller = user.seller_profile

        sale = Sale.objects.create(
            seller=seller,
            **validated_data
        )

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