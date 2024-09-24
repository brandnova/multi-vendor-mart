from django.urls import path
from .views import RegisterView, VerifyEmailView, UserProfileView
from .auth import CookieTokenObtainPairView, CookieTokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('verify-email/<uuid:token>/', VerifyEmailView.as_view(), name='verify-email'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
]