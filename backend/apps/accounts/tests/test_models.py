from django.test import TestCase
from django.contrib.auth import get_user_model

User = get_user_model()


class UserManagerTest(TestCase):

    def test_create_user_success(self):
        user = User.objects.create_user(
            email="test@email.com",
            password="123456"
        )

        self.assertEqual(user.email, "test@email.com")
        self.assertTrue(user.check_password("123456"))
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_create_user_without_email_raises_error(self):
        with self.assertRaises(ValueError):
            User.objects.create_user(email=None, password="123")

    def test_create_superuser(self):
        admin = User.objects.create_superuser(
            email="admin@email.com",
            password="admin123"
        )

        self.assertTrue(admin.is_staff)
        self.assertTrue(admin.is_superuser)
        self.assertTrue(admin.is_active)


class UserModelTest(TestCase):

    def test_str_returns_email(self):
        user = User.objects.create_user(
            email="str@email.com",
            password="123"
        )

        self.assertEqual(str(user), "str@email.com")