from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from stores.serializers import ProductSerializer
from .models import Order
from .serializers import OrderSerializer
from stores.models import Product, Store

class IsStoreOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.store.owner == request.user

class OrderCreateView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        store = get_object_or_404(Store, slug=self.kwargs['store_slug'])
        serializer.save(store=store)

class UpdateProductQuantityView(generics.UpdateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated, IsStoreOwner]

    def get_queryset(self):
        return Product.objects.filter(store__owner=self.request.user)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        new_quantity = serializer.validated_data.get('quantity')
        if new_quantity < 0:
            return Response({"detail": "Quantity cannot be negative."}, status=status.HTTP_400_BAD_REQUEST)
        self.perform_update(serializer)
        return Response(serializer.data)

class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsStoreOwner]

    def get_queryset(self):
        store = Store.objects.get(owner=self.request.user)
        return Order.objects.filter(store=store)

class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsStoreOwner]
    queryset = Order.objects.all()

    def get_object(self):
        obj = super().get_object()
        if obj.store.owner != self.request.user:
            raise PermissionDenied("You do not have permission to view this order.")
        return obj
    
class OrderDeleteView(generics.DestroyAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsStoreOwner]
    queryset = Order.objects.all()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "Order deleted successfully"}, status=status.HTTP_204_NO_CONTENT)