# ads/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AdConfigurationViewSet,
    InitiatePaymentView,
    VerifyPaymentView,
    StoreAdsFreeStatusView,
)

router = DefaultRouter()
router.register(r'ad-configurations', AdConfigurationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('initiate-payment/', InitiatePaymentView.as_view(), name='initiate-payment'),
    path('verify-payment/<uuid:session_id>/', VerifyPaymentView.as_view(), name='verify-payment'),
    path('store-ads-free-status/', StoreAdsFreeStatusView.as_view(), name='store-ads-free-status'),
]