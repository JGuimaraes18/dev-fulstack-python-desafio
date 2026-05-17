from django.test import TestCase
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from rest_framework.test import APIClient

User = get_user_model()


class UserViewSetTest(TestCase):

    def setUp(self):
        self.client = APIClient()

        self.admin_group, _ = Group.objects.get_or_create(name="ADMIN")

        self.admin = User.objects.create_user(
            email="admin@email.com",
            password="123"
        )
        self.admin.groups.add(self.admin_group)

        self.user1 = User.objects.create_user(
            email="user1@email.com",
            password="123"
        )

        self.user2 = User.objects.create_user(
            email="user2@email.com",
            password="123"
        )

    def test_admin_can_list_all_users(self):
        self.client.force_authenticate(user=self.admin)

        response = self.client.get("/api/users/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)

    def test_regular_user_can_only_see_self(self):
        self.client.force_authenticate(user=self.user1)

        response = self.client.get("/api/users/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["email"], "user1@email.com")