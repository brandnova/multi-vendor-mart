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
    class Meta:
        model = Store
        fields = ['id', 'name', 'slug', 'location', 'contact_email', 'contact_phone', 'is_active', 'banner_image', 'tag_line', 'primary_color', 'secondary_color', 'accent_color', 'bank_details']
        read_only_fields = ['slug', 'is_active']

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        if 'name' in validated_data:
            instance.save(update_fields=['slug'])
        return instance