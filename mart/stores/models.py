from django.db import models
from django.conf import settings
from django.utils.text import slugify
from django.core.validators import RegexValidator

class Store(models.Model):
    owner = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, max_length=120)
    location = models.CharField(max_length=255)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20)
    banner_image = models.ImageField(upload_to='store_banners/', null=True, blank=True)
    tag_line = models.CharField(max_length=200, blank=True)
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    primary_color = models.CharField(
        max_length=7,
        default="#000000",
        validators=[RegexValidator(regex=r'^#([A-Fa-f0-9]{6})$', message='Enter a valid 6-digit hex color code')]
    )
    secondary_color = models.CharField(
        max_length=7,
        default="#e8e8e8",
        validators=[RegexValidator(regex=r'^#([A-Fa-f0-9]{6})$', message='Enter a valid 6-digit hex color code')]
    )
    accent_color = models.CharField(
        max_length=7,
        default="#FFFFFF",
        validators=[RegexValidator(regex=r'^#([A-Fa-f0-9]{6})$', message='Enter a valid 6-digit hex color code')]
    )
    
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        if self._state.adding or 'name' in kwargs.get('update_fields', []):
            base_slug = slugify(self.name)
            unique_slug = base_slug
            num = 1
            while Store.objects.filter(slug=unique_slug).exists():
                unique_slug = f"{base_slug}-{num}"
                num += 1
            self.slug = unique_slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class BankDetails(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='bank_details')
    bank_name = models.CharField(max_length=100)
    account_number = models.CharField(max_length=50)
    account_name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.store.name} - {self.bank_name}"

class Product(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    image = models.ImageField(upload_to='product_images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name