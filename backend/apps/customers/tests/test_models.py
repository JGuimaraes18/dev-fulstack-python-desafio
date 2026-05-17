from django.test import TestCase
from apps.customers.models import Customer


class CustomerModelTest(TestCase):

    def test_str_returns_name(self):
        customer = Customer.objects.create(
            name="Cliente Teste",
            email="cliente@email.com",
            phone="11999999999"
        )

        self.assertEqual(str(customer), "Cliente Teste")