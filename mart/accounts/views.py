from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .serializers import UserSerializer
from .models import EmailVerificationToken
from django.shortcuts import get_object_or_404

class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "message": "User created successfully. Please check your email to verify your account."
        }, status=status.HTTP_201_CREATED)

class VerifyEmailView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, token):
        verification_token = get_object_or_404(EmailVerificationToken, token=token)
        user = verification_token.user
        user.is_email_verified = True
        user.save()
        verification_token.delete()
        return Response({"message": "Email verified successfully"}, status=status.HTTP_200_OK)