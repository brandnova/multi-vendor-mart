from django.db import models
from django.conf import settings
from django.utils import timezone
import uuid

# Import the Store model directly from the stores app
from stores.models import Store

class AdConfiguration(models.Model):
    AD_TYPES = (
        ('adsense', 'Google AdSense'),
        ('custom', 'Custom Ad'),
    )
    
    ad_type = models.CharField(max_length=10, choices=AD_TYPES)
    placement = models.CharField(max_length=50)
    content = models.TextField()
    display_image = models.ImageField(upload_to='ad_images/', null=True, blank=True)
    adsense_code = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.get_ad_type_display()} - {self.placement}"


class AdsFreeSubscription(models.Model):
    store = models.OneToOneField(Store, on_delete=models.CASCADE, related_name='ads_free_subscription')
    is_active = models.BooleanField(default=False)
    expires_at = models.DateTimeField(null=True, blank=True)
    payment_reference = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.store.name} - Ads-Free: {self.is_active}"

    def is_valid(self):
        if not self.is_active or not self.expires_at:
            return False
        return self.is_active and self.expires_at > timezone.now()


class PaymentSession(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE)
    session_id = models.UUIDField(default=uuid.uuid4, editable=False)
    payment_reference = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return f"Payment Session for {self.store.name}"

    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timezone.timedelta(hours=1)
        super().save(*args, **kwargs)

    def is_valid(self):
        return not self.is_completed and timezone.now() < self.expires_at
