from django.test import TestCase
from django.contrib.auth import get_user_model

from apps.sellers.serializers import SellerSerializer
from apps.sellers.models import Seller

User = get_user_model()


class SellerSerializerTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="seller@email.com",
            password="123456",
            first_name="Maria",
            last_name="Souza",
        )

    def test_serializer_create(self):
        data = {
            "user": self.user.id,
            "phone": "11888888888",
        }

        serializer = SellerSerializer(data=data)
        self.assertTrue(serializer.is_valid())

        seller = serializer.save()

        self.assertEqual(seller.user, self.user)
        self.assertEqual(seller.phone, "11888888888")

    def test_user_email_is_read_only(self):
        seller = Seller.objects.create(
            user=self.user,
            phone="11999999999",
        )

        serializer = SellerSerializer(instance=seller)

        self.assertEqual(serializer.data["user_email"], self.user.email)