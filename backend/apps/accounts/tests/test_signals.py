from django.test import TestCase
from django.contrib.auth.models import Group


class RolesSignalTest(TestCase):

    def test_groups_are_created(self):
        self.assertTrue(Group.objects.filter(name="SELLER").exists())
        self.assertTrue(Group.objects.filter(name="ADMIN").exists())