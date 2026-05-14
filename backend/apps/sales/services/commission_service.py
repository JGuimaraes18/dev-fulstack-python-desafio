from decimal import Decimal
from apps.sales.models import CommissionRule


def calculate_item_commission(sale_item, rule=None):
    product_percentage = sale_item.product.commission_percentage

    if rule:
        product_percentage = max(
            rule.min_percentage,
            min(product_percentage, rule.max_percentage)
        )

    total_value = sale_item.total_value()

    percentage = Decimal(product_percentage) / Decimal("100")
    commission = total_value * percentage

    return commission


def calculate_sale_commission(sale):
    sale_date = sale.date
    weekday = sale_date.weekday()

    rule = CommissionRule.objects.filter(weekday=weekday).first()

    total = Decimal("0.00")

    for item in sale.items.all():
        total += calculate_item_commission(item, rule)

    return total