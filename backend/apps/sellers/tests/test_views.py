from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from apps.sellers.models import Seller

User = get_user_model()


class SellerViewSetTest(TestCase):

    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create_user(
            email="admin@email.com",
            password="123456",
            first_name="Admin",
            last_name="User",
        )

        self.seller_user = User.objects.create_user(
            email="seller@email.com",
            password="123456",
            first_name="Carlos",
            last_name="Oliveira",
        )

        self.seller = Seller.objects.create(
            user=self.seller_user,
            phone="11999999999",
        )

        self.url = "/api/sellers/"

    def test_requires_authentication(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 401)

    def test_authenticated_user_can_list_sellers(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_authenticated_user_can_create_seller(self):
        self.client.force_authenticate(user=self.user)

        new_user = User.objects.create_user(
            email="new_seller@email.com",
            password="123456",
            first_name="Novo",
            last_name="Seller",
        )

        data = {
            "user": new_user.id,
            "phone": "11777777777",
        }

        response = self.client.post(self.url, data)

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Seller.objects.count(), 2)