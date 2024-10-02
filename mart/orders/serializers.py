from rest_framework import serializers
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    payment_proof = serializers.FileField(required=False)

    class Meta:
        model = Order
        fields = ['id', 'store', 'customer_name', 'customer_email', 'customer_phone', 'customer_address', 'total_amount', 'status', 'payment_proof', 'tracking_number', 'created_at', 'items']
        read_only_fields = ['store', 'total_amount', 'status', 'tracking_number']

    def update(self, instance, validated_data):
        payment_proof = validated_data.get('payment_proof')
        if payment_proof:
            instance.payment_proof = payment_proof
            instance.save()
        return instance

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        total_amount = sum(item_data['price'] * item_data['quantity'] for item_data in items_data)
        order.total_amount = total_amount
        order.save()

        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)

        return order