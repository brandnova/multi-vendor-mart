from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Order
from .serializers import OrderSerializer
from stores.models import Store

class IsStoreOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.store.owner == request.user

class OrderCreateView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        store = Store.objects.get(slug=self.kwargs['store_slug'])
        serializer.save(store=store)

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