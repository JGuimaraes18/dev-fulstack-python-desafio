from django.test import TestCase
from django.contrib.auth import get_user_model

from apps.sellers.models import Seller

User = get_user_model()


class SellerModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="seller@email.com",
            password="123456",
            first_name="João",
            last_name="Silva",
        )

    def test_create_seller(self):
        seller = Seller.objects.create(
            user=self.user,
            phone="11999999999",
        )

        self.assertEqual(seller.user.email, "seller@email.com")
        self.assertEqual(seller.phone, "11999999999")

    def test_str_returns_full_name(self):
        seller = Seller.objects.create(
            user=self.user,
        )

        self.assertEqual(str(seller), "João Silva")