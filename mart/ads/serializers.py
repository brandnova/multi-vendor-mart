from rest_framework import serializers
from .models import AdConfiguration, AdsFreeSubscription

class AdConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdConfiguration
        fields = ['id', 'ad_type', 'placement', 'content', 'display_image', 'adsense_code', 'is_active']

class AdsFreeSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdsFreeSubscription
        fields = ['is_active', 'expires_at']