from django.db import models
from django.core.exceptions import ValidationError
# from stores.models import Store
from django.conf import settings

class SingletonModel(models.Model):
    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        if not self.pk and self.__class__.objects.exists():
            raise ValidationError('There can only be one instance of this model.')
        return super().save(*args, **kwargs)

class SiteSettings(SingletonModel):
    site_name = models.CharField(max_length=100)
    logo = models.FileField(upload_to='logos/', blank=True)
    tagline = models.CharField(max_length=200, blank=True)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20)
    address = models.TextField()
    about_us = models.TextField()
    terms_and_conditions = models.TextField()
    privacy_policy = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.site_name

    class Meta:
        verbose_name = "Site Settings"
        verbose_name_plural = "Site Settings"

class SocialLink(models.Model):
    site_settings = models.ForeignKey(SiteSettings, related_name='social_links', on_delete=models.CASCADE)
    platform = models.CharField(max_length=50)
    url = models.URLField()
    icon = models.CharField(max_length=50, help_text="Enter the icon name (e.g., 'facebook', 'twitter')", null=True, blank=True)

    def __str__(self):
        return f"{self.platform} - {self.url}"
    
# class Testimonial(models.Model):
#     user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
#     store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='testimonials')
#     text = models.TextField()
#     is_approved = models.BooleanField(default=False)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return f"Testimonial by {self.user.get_full_name()} - {self.store.name}"