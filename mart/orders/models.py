import uuid
from django.db import models
from stores.models import Store, Product

def generate_tracking_number():
    return str(uuid.uuid4().hex[:10].upper())

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('payment_confirmed', 'Payment Confirmed'),
        ('payment_not_confirmed', 'Payment Not Confirmed'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='orders')
    customer_name = models.CharField(max_length=100)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20)
    customer_address = models.TextField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    status = models.CharField(max_length=25, choices=STATUS_CHOICES, default='pending')
    payment_proof = models.FileField(upload_to='payment_proofs/', null=True, blank=True)
    tracking_number = models.CharField(max_length=10, unique=True, default=generate_tracking_number)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order {self.id} - {self.store.name} - {self.status}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"
