from django.test import TestCase
from apps.customers.serializers import CustomerSerializer
from apps.customers.models import Customer


class CustomerSerializerTest(TestCase):

    def test_serializer_valid_data(self):
        data = {
            "name": "Cliente Teste",
            "email": "cliente@email.com",
            "phone": "11999999999"
        }

        serializer = CustomerSerializer(data=data)
        self.assertTrue(serializer.is_valid())

        customer = serializer.save()

        self.assertEqual(customer.name, data["name"])
        self.assertEqual(customer.email, data["email"])
        self.assertEqual(customer.phone, data["phone"])

    def test_serializer_invalid_email(self):
        data = {
            "name": "Cliente Teste",
            "email": "email-invalido",
            "phone": "11999999999"
        }

        serializer = CustomerSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("email", serializer.errors)