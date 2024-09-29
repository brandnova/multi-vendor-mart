from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'store', 'customer_name', 'total_amount', 'status', 'created_at')
    list_filter = ('store', 'status', 'created_at')
    search_fields = ('customer_name', 'customer_email', 'store__name')
    inlines = [OrderItemInline]

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity', 'price')
    list_filter = ('order__store', 'order__status')
    search_fields = ('order__customer_name', 'product__name')