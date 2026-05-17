from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from apps.customers.models import Customer

User = get_user_model()


class CustomerViewSetTest(TestCase):

    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create_user(
            email="user@email.com",
            password="123456"
        )

        self.customer = Customer.objects.create(
            name="Cliente 1",
            email="cliente1@email.com",
            phone="11999999999"
        )

        self.url = "/api/customers/"

    def test_requires_authentication(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 401)

    def test_authenticated_user_can_list_customers(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_authenticated_user_can_create_customer(self):
        self.client.force_authenticate(user=self.user)

        data = {
            "name": "Cliente Novo",
            "email": "novo@email.com",
            "phone": "11888888888"
        }

        response = self.client.post(self.url, data)

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Customer.objects.count(), 2)