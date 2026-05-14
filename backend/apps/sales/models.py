from django.db import models
from django.core.exceptions import ValidationError

class Sale(models.Model):
    invoice_number = models.CharField(max_length=50, unique=True)
    date = models.DateTimeField()
    customer = models.ForeignKey(
        "customers.Customer",
        on_delete=models.PROTECT,
        related_name="sales",
    )
    seller = models.ForeignKey(
        "sellers.Seller",
        on_delete=models.PROTECT,
        related_name="sales",
    )

    def __str__(self):
        return self.invoice_number


class SaleItem(models.Model):
    sale = models.ForeignKey(
        "sales.Sale",
        related_name="items",
        on_delete=models.CASCADE,
    )
    product = models.ForeignKey(
        "products.Product",
        on_delete=models.PROTECT,
    )
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.product.description} - {self.quantity}"


class CommissionRule(models.Model):
    WEEKDAYS = [
        (0, "Segunda"),
        (1, "Terça"),
        (2, "Quarta"),
        (3, "Quinta"),
        (4, "Sexta"),
        (5, "Sábado"),
        (6, "Domingo"),
    ]

    weekday = models.IntegerField(choices=WEEKDAYS, unique=True)
    min_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    max_percentage = models.DecimalField(max_digits=5, decimal_places=2)

    def clean(self):
        if self.min_percentage > self.max_percentage:
            raise ValidationError("Min não pode ser maior que Max.")

        if self.min_percentage < 0 or self.max_percentage > 100:
            raise ValidationError("Percentual deve estar entre 0 e 100.")

    def __str__(self):
        return self.get_weekday_display()