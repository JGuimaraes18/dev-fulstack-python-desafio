from decimal import Decimal
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from apps.products.models import Product

User = get_user_model()


class ProductViewSetTest(TestCase):

    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create_user(
            email="user@email.com",
            password="123456"
        )

        self.product = Product.objects.create(
            description="Produto 1",
            unit_price=Decimal("100.00"),
            commission_percent=Decimal("5.00"),
        )

        self.url = "/api/products/" 

    def test_requires_authentication(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 401)

    def test_authenticated_user_can_list_products(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_authenticated_user_can_create_product(self):
        self.client.force_authenticate(user=self.user)

        data = {
            "description": "Produto Novo",
            "unit_price": "200.00",
            "commission_percent": "3.00",
        }

        response = self.client.post(self.url, data)

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Product.objects.count(), 2)