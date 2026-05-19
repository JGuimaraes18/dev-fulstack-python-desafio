from decimal import Decimal

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from apps.customers.models import Customer
from apps.products.models import Product
from apps.sellers.models import Seller

User = get_user_model()


class TesteSaleAPI(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(email="admin", password="123456")

        self.seller = Seller.objects.create(user=self.user)

        self.customer = Customer.objects.create(name="Cliente Teste")

        self.product = Product.objects.create(
            description="Produto Teste",
            unit_price=Decimal("100.00"),
            commission_percent=Decimal("5.00"),
        )

        refresh = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

    def test_create_sale(self):
        payload = {
            "customer": self.customer.id,
            "seller": self.seller.id,
            "items": [{"product": self.product.id, "quantity": 2}],
        }

        response = self.client.post("/api/sales/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(response.data["items"]), 1)

    def test_create_sale_without_token(self):
        self.client.credentials()

        payload = {
            "customer": self.customer.id,
            "items": [{"product": self.product.id, "quantity": 1}],
        }

        response = self.client.post("/api/sales/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_sale_without_items(self):
        payload = {"customer": self.customer.id, "seller": self.seller.id, "items": []}

        response = self.client.post("/api/sales/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_sale_with_invalid_product(self):
        payload = {
            "customer": self.customer.id,
            "seller": self.seller.id,
            "items": [{"product": 9999, "quantity": 1}],
        }

        response = self.client.post("/api/sales/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_sale_total_calculation(self):
        payload = {
            "customer": self.customer.id,
            "seller": self.seller.id,
            "items": [{"product": self.product.id, "quantity": 2}],
        }

        response = self.client.post("/api/sales/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["total_value"], Decimal("200.00"))
