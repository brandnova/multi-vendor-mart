from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from django.conf import settings
from .models import EmailVerificationToken

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    accepted_terms = serializers.BooleanField(required=True)

    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'username', 'email', 'password', 'is_vendor', 'accepted_terms')
        read_only_fields = ('id', 'is_vendor')

    def validate_accepted_terms(self, value):
        if not value:
            raise serializers.ValidationError("You must accept the Terms and Conditions to register.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        self.send_verification_email(user)
        return user

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr == 'password':
                instance.set_password(value)
            else:
                setattr(instance, attr, value)
        instance.save()
        return instance

    def send_verification_email(self, user):
        token = EmailVerificationToken.objects.create(user=user)
        verification_url = f"{settings.FRONTEND_URL}/verify-email/{token.token}"
        send_mail(
            'Verify your email',
            f'Please click the link to verify your email: {verification_url}',
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        if not self.user.is_email_verified:
            raise serializers.ValidationError("Email is not verified.")
        data['is_vendor'] = self.user.is_vendor
        return data