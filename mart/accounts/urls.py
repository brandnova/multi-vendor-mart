from django.urls import path
from .views import (
    RegisterView, VerifyEmailView, UserProfileView, LogoutView, 
    ResendVerificationEmailView, CheckEmailVerificationView, VerificationSettingsView
)
from .auth import CookieTokenObtainPairView, CookieTokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('verify-email/<uuid:token>', VerifyEmailView.as_view(), name='verify-email-no-slash'),
    path('verify-email/<uuid:token>/', VerifyEmailView.as_view(), name='verify-email'),
    path('resend-verification-email/', ResendVerificationEmailView.as_view(), name='resend-verification-email'),
    path('check-activation/', CheckEmailVerificationView.as_view(), name='check-email-verification'),
    path('verification-settings/', VerificationSettingsView.as_view(), name='verification-settings'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('logout/', LogoutView.as_view(), name='logout'),
]