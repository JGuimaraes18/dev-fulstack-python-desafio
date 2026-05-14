from django.db import models

class Seller(models.Model):
    user = models.OneToOneField(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="seller_profile"
    )
    phone = models.CharField(max_length=20)

    def __str__(self):
        return self.user.get_full_name()