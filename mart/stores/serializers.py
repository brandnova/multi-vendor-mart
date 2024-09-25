from rest_framework import serializers
from .models import Store, BankDetails, Product

class BankDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankDetails
        fields = ['id', 'bank_name', 'account_number', 'account_name']

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'quantity', 'image']

class StoreSerializer(serializers.ModelSerializer):
    bank_details = BankDetailsSerializer(many=True, read_only=True)
    products = ProductSerializer(many=True, read_only=True)

    class Meta:
        model = Store
        fields = ['id', 'name', 'slug', 'location', 'contact_email', 'contact_phone', 'is_active', 'bank_details', 'products', 'banner_image']
        read_only_fields = ['slug', 'is_active']