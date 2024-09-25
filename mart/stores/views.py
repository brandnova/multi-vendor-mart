from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Store, BankDetails, Product
from .serializers import StoreSerializer, BankDetailsSerializer, ProductSerializer
from django.shortcuts import get_object_or_404

class IsVerifiedVendor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_vendor and request.user.is_email_verified

class StoreCreateView(generics.CreateAPIView):
    serializer_class = StoreSerializer
    permission_classes = [IsVerifiedVendor]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user, is_active=True)

class StoreDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = StoreSerializer
    permission_classes = [IsVerifiedVendor]

    def get_object(self):
        return get_object_or_404(Store, owner=self.request.user)

class BankDetailsCreateView(generics.CreateAPIView):
    serializer_class = BankDetailsSerializer
    permission_classes = [IsVerifiedVendor]

    def perform_create(self, serializer):
        store = get_object_or_404(Store, owner=self.request.user)
        serializer.save(store=store)

class BankDetailsDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BankDetailsSerializer
    permission_classes = [IsVerifiedVendor]

    def get_queryset(self):
        store = get_object_or_404(Store, owner=self.request.user)
        return BankDetails.objects.filter(store=store)

class BankDetailsListView(generics.ListAPIView):
    serializer_class = BankDetailsSerializer
    permission_classes = [IsVerifiedVendor]

    def get_queryset(self):
        store = get_object_or_404(Store, owner=self.request.user)
        return BankDetails.objects.filter(store=store)

class ProductListCreateView(generics.ListCreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsVerifiedVendor]

    def get_queryset(self):
        store = get_object_or_404(Store, owner=self.request.user)
        return Product.objects.filter(store=store)

    def perform_create(self, serializer):
        store = get_object_or_404(Store, owner=self.request.user)
        serializer.save(store=store)

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsVerifiedVendor]

    def get_queryset(self):
        store = get_object_or_404(Store, owner=self.request.user)
        return Product.objects.filter(store=store)

class PublicStoreView(generics.RetrieveAPIView):
    serializer_class = StoreSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    queryset = Store.objects.filter(is_active=True)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        products = Product.objects.filter(store=instance)
        product_serializer = ProductSerializer(products, many=True)
        data = serializer.data
        data['products'] = product_serializer.data
        return Response(data)
