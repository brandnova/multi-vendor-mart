from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.contrib.auth import get_user_model
from django.conf import settings
from django.db import transaction
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer
from .models import EmailVerificationToken, TermsAndConditionsAcceptance
from .utils import send_verification_email

class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Create the user
        user = serializer.save()

        # Save T&C acceptance
        accepted_terms = serializer.validated_data.get('accepted_terms', False)
        if accepted_terms:
            TermsAndConditionsAcceptance.objects.create(
                user=user,
                accepted_at=timezone.now()
            )

        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "message": "User created successfully. Please check your email to verify your account."
        }, status=status.HTTP_201_CREATED)

class VerifyEmailView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    @transaction.atomic
    def get(self, request, token):
        try:
            verification_token = get_object_or_404(EmailVerificationToken, token=token)
            
            if verification_token.is_expired:
                return Response({
                    "status": "error",
                    "message": "Verification token has expired. Please request a new one."
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if verification_token.max_attempts_reached:
                return Response({
                    "status": "error",
                    "message": "Maximum verification attempts reached. Please contact support."
                }, status=status.HTTP_400_BAD_REQUEST)
            
            user = verification_token.user
            if user.is_email_verified:
                return Response({
                    "status": "success",
                    "message": "Email has already been verified."
                }, status=status.HTTP_200_OK)
            
            verification_token.attempts += 1
            verification_token.save()
            
            user.is_email_verified = True
            user.save()
            verification_token.delete()
            return Response({
                "status": "success",
                "message": "Email verified successfully"
            }, status=status.HTTP_200_OK)
        
        except EmailVerificationToken.DoesNotExist:
            return Response({
                "status": "error",
                "message": "Invalid verification token. Please request a new verification email."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({
                "status": "error",
                "message": f"An unexpected error occurred: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

User = get_user_model()

class ResendVerificationEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({
                "status": "error",
                "message": "Email is required."
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({
                "status": "error",
                "message": "User with this email does not exist."
            }, status=status.HTTP_404_NOT_FOUND)

        if user.is_email_verified:
            return Response({
                "status": "error",
                "message": "Email is already verified."
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = EmailVerificationToken.objects.get(user=user)
            if not token.is_expired:
                return Response({
                    "status": "error",
                    "message": "Please wait for the current verification email to expire before requesting a new one."
                }, status=status.HTTP_400_BAD_REQUEST)
            token.delete()
        except EmailVerificationToken.DoesNotExist:
            pass

        send_verification_email(user)

        return Response({
            "status": "success",
            "message": "Verification email sent successfully."
        }, status=status.HTTP_200_OK)
    
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    
class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            response = Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
            response.delete_cookie('refresh_token')
            return response
        except Exception as e:
            # Log the exception for debugging
            print(f"Logout error: {str(e)}")
            # Still delete the cookie and return a success response
            response = Response({"detail": "Logged out."}, status=status.HTTP_200_OK)
            response.delete_cookie('refresh_token')
            return response
        
class CheckEmailVerificationView(APIView):
    permission_classes = []  # Allow any user to access this view

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            User = get_user_model()
            user = User.objects.get(email=email)
            if user.is_email_verified:
                return Response({'is_verified': True})
            
            token = EmailVerificationToken.objects.filter(user=user).first()
            if token:
                return Response({
                    'is_verified': False,
                    'token_exists': True,
                    'is_expired': token.is_expired,
                    'max_attempts_reached': token.max_attempts_reached,
                    'cooldown_time': (token.expires_at - timezone.now()).total_seconds() if not token.is_expired else 0
                })
            else:
                return Response({'is_verified': False, 'token_exists': False})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class VerificationSettingsView(APIView):
    permission_classes = []  # Allow any user to access this view

    def get(self, request):
        return Response({
            'max_resend_attempts': 3,
            'cooldown_time': 300,  # 5 minutes in seconds
        })