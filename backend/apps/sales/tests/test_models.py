from decimal import Decimal

from django.core.exceptions import ValidationError
from django.test import TestCase

from apps.accounts.models import User
from apps.customers.models import Customer
from apps.products.models import Product
from apps.sales.models import CommissionRule, Sale, SaleItem
from apps.sellers.models import Seller


class SaleModelTest(TestCase):

    def setUp(self):
        self.customer = Customer.objects.create(
            name="Cliente Teste",
            email="cliente@test.com",
            phone="999999999",
        )

        self.seller = self._create_seller()

        self.product = Product.objects.create(
            description="Produto Teste",
            unit_price=Decimal("100.00"),
            commission_percent=Decimal("10.00"),
        )

    def _create_seller(self):
        user = User.objects.create_user(
            email="seller@test.com",
            password="123",
            first_name="Vendedor",
            last_name="Teste",
        )
        return Seller.objects.create(user=user)

    def test_invoice_number_is_generated_automatically(self):
        sale = Sale.objects.create(
            customer=self.customer,
            seller=self.seller,
        )

        self.assertIsNotNone(sale.invoice_number)
        self.assertEqual(sale.invoice_number, f"{sale.pk:06d}")

    def test_total_amount_without_items_returns_zero(self):
        sale = Sale.objects.create(
            customer=self.customer,
            seller=self.seller,
        )

        self.assertEqual(sale.total_amount, Decimal("0.00"))

    def test_total_amount_with_items(self):
        sale = Sale.objects.create(
            customer=self.customer,
            seller=self.seller,
        )

        SaleItem.objects.create(
            sale=sale,
            product=self.product,
            quantity=2,
        )

        self.assertEqual(sale.total_amount, Decimal("200.00"))

    def test_sale_str_returns_invoice_number(self):
        sale = Sale.objects.create(
            customer=self.customer,
            seller=self.seller,
        )

        self.assertEqual(str(sale), sale.invoice_number)


class SaleItemModelTest(TestCase):

    def setUp(self):
        self.customer = Customer.objects.create(
            name="Cliente Teste",
            email="cliente@test.com",
            phone="999999999",
        )

        self.seller = self._create_seller()

        self.product = Product.objects.create(
            description="Produto Teste",
            unit_price=Decimal("150.00"),
            commission_percent=Decimal("10.00"),
        )

        self.sale = Sale.objects.create(
            customer=self.customer,
            seller=self.seller,
        )

    def _create_seller(self):
        user = User.objects.create_user(
            email="seller@test.com",
            password="123",
            first_name="Vendedor",
            last_name="Teste",
        )
        return Seller.objects.create(user=user)

    def test_unit_price_is_set_automatically_on_create(self):
        item = SaleItem.objects.create(
            sale=self.sale,
            product=self.product,
            quantity=1,
        )

        self.assertEqual(item.unit_price, Decimal("150.00"))

    def test_total_value_property(self):
        item = SaleItem.objects.create(
            sale=self.sale,
            product=self.product,
            quantity=3,
        )

        self.assertEqual(item.total_value, Decimal("450.00"))

    def test_sale_item_str(self):
        item = SaleItem.objects.create(
            sale=self.sale,
            product=self.product,
            quantity=2,
        )

        self.assertEqual(str(item), f"{self.product.description} - 2")


class CommissionRuleModelTest(TestCase):

    def test_invalid_when_min_greater_than_max(self):
        rule = CommissionRule(
            weekday=0,
            min_percentage=Decimal("10.00"),
            max_percentage=Decimal("5.00"),
        )

        with self.assertRaises(ValidationError):
            rule.clean()

    def test_invalid_when_percentage_out_of_range(self):
        rule = CommissionRule(
            weekday=0,
            min_percentage=Decimal("-1.00"),
            max_percentage=Decimal("150.00"),
        )

        with self.assertRaises(ValidationError):
            rule.clean()

    def test_valid_commission_rule(self):
        rule = CommissionRule(
            weekday=1,
            min_percentage=Decimal("5.00"),
            max_percentage=Decimal("10.00"),
        )

        rule.clean()

        self.assertEqual(str(rule), "Terça")
