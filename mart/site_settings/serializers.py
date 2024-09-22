# site_settings/serializers.py

from rest_framework import serializers
from .models import SiteSettings, SocialLink

class SocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = ['platform', 'url', 'icon']

class SiteSettingsSerializer(serializers.ModelSerializer):
    social_links = SocialLinkSerializer(many=True, read_only=True)

    class Meta:
        model = SiteSettings
        fields = ['site_name', 'logo', 'tagline', 'contact_email', 'contact_phone', 'address', 'about_us', 'terms_and_conditions', 'privacy_policy', 'social_links']