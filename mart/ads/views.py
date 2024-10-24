# ads/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from django.shortcuts import redirect
from django.conf import settings
from django.urls import reverse
import requests
from .models import AdConfiguration, AdsFreeSubscription, PaymentSession
from .serializers import AdConfigurationSerializer
from stores.models import Store

class AdConfigurationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AdConfiguration.objects.filter(is_active=True)
    serializer_class = AdConfigurationSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request):
        store_slug = request.query_params.get('store_slug')
        if store_slug:
            try:
                store = Store.objects.get(slug=store_slug)
                if hasattr(store, 'ads_free_subscription') and store.ads_free_subscription.is_valid():
                    return Response([])
            except Store.DoesNotExist:
                pass
        return super().list(request)

class InitiatePaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        store_slug = request.data.get('store_slug')
        
        try:
            store = Store.objects.get(slug=store_slug, owner=request.user)
        except Store.DoesNotExist:
            return Response({"error": "Store not found"}, status=404)

        # Create payment session
        payment_session = PaymentSession.objects.create(store=store)
        
        # Construct callback URL with session ID
        callback_url = request.build_absolute_uri(
            reverse('verify-payment', args=[str(payment_session.session_id)])
        )

        # Get payment page URL (you can store this in settings or database)
        payment_url = settings.PAYSTACK_PAYMENT_PAGE_URL

        # Add query parameters to payment URL
        final_url = f"{payment_url}?callback_url={callback_url}&reference={payment_session.session_id}"
        
        return Response({
            "payment_url": final_url,
            "session_id": payment_session.session_id
        })

class VerifyPaymentView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, session_id):
        try:
            payment_session = PaymentSession.objects.get(
                session_id=session_id,
                is_completed=False
            )
            
            if not payment_session.is_valid():
                return redirect(f"{settings.FRONTEND_URL}/payment-failed?reason=expired")

            payment_reference = request.GET.get('reference')
            if not payment_reference:
                return redirect(f"{settings.FRONTEND_URL}/payment-failed?reason=no-reference")

            verification_status = self.verify_payment(payment_reference)

            if verification_status:
                store = payment_session.store
                subscription, created = AdsFreeSubscription.objects.get_or_create(
                    store=store,
                    defaults={
                        'is_active': True,
                        'expires_at': timezone.now() + timezone.timedelta(days=30),
                        'payment_reference': payment_reference
                    }
                )
                
                if not created:
                    # Update existing subscription
                    subscription.is_active = True
                    subscription.expires_at = timezone.now() + timezone.timedelta(days=30)
                    subscription.payment_reference = payment_reference
                    subscription.save()

                # Mark payment session as completed
                payment_session.is_completed = True
                payment_session.payment_reference = payment_reference
                payment_session.save()

                return redirect(f"{settings.FRONTEND_URL}/payment-success")
            else:
                return redirect(f"{settings.FRONTEND_URL}/payment-failed?reason=verification-failed")

        except PaymentSession.DoesNotExist:
            return redirect(f"{settings.FRONTEND_URL}/payment-failed?reason=invalid-session")

    def verify_payment(self, reference):
        url = f"https://api.paystack.co/transaction/verify/{reference}"
        headers = {
            "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
            "Content-Type": "application/json"
        }
        try:
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                response_data = response.json()
                return response_data['status'] and response_data['data']['status'] == 'success'
        except requests.RequestException:
            return False
        return False

class StoreAdsFreeStatusView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        store_slug = request.query_params.get('store_slug')
        if not store_slug:
            return Response({"error": "store_slug is required"}, status=400)

        try:
            store = Store.objects.get(slug=store_slug)
            is_ads_free = False
            if hasattr(store, 'ads_free_subscription'):
                is_ads_free = store.ads_free_subscription.is_valid()
            return Response({"is_ads_free": is_ads_free})
        except Store.DoesNotExist:
            return Response({"error": "Store not found"}, status=404)