from decimal import Decimal
from apps.sales.models import CommissionRule


def get_commission_rule(weekday: int):
    return (
        CommissionRule.objects
        .filter(weekday=weekday)
        .order_by("id")
        .first()
    )


def calculate_item_commission(sale_item, rule=None):
    product_percentage = Decimal(
        sale_item.product.commission_percentage or 0
    )

    if rule:
        min_p = Decimal(rule.min_percentage)
        max_p = Decimal(rule.max_percentage)

        product_percentage = max(
            min_p,
            min(product_percentage, max_p)
        )

    total_value = Decimal(sale_item.quantity) * sale_item.unit_price

    return total_value * (product_percentage / Decimal("100"))


def calculate_sale_commission(sale):
    rule = get_commission_rule(sale.date.weekday())

    total = Decimal("0.00")

    items = sale.items.select_related("product")

    for item in items:
        total += calculate_item_commission(item, rule)

    return total