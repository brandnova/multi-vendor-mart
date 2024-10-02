from django.shortcuts import get_object_or_404
from .utils import send_order_confirmation_email
from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView
from stores.serializers import ProductSerializer
from .models import Order
from .serializers import OrderSerializer
from stores.models import Product, Store
from rest_framework.parsers import MultiPartParser, FormParser

class IsStoreOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.store.owner == request.user

class OrderCreateView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        store = get_object_or_404(Store, slug=self.kwargs['store_slug'])
        order = serializer.save(store=store)
        send_order_confirmation_email(order)


class UploadPaymentProofView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get_order(self, tracking_number):
        return Order.objects.filter(tracking_number=tracking_number).first()

    def post(self, request, tracking_number):
        return self.handle_upload(request, tracking_number)

    def put(self, request, tracking_number):
        return self.handle_upload(request, tracking_number, update=True)

    def handle_upload(self, request, tracking_number, update=False):
        order = self.get_order(tracking_number)
        if not order:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

        if 'payment_proof' not in request.FILES:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        if order.payment_proof and not update:
            return Response({"error": "Payment proof already exists", "exists": True}, status=status.HTTP_400_BAD_REQUEST)

        serializer = OrderSerializer(order, data={'payment_proof': request.FILES['payment_proof']}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TrackOrderView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Order.objects.all()
    lookup_field = 'tracking_number'


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
    
class UpdateOrderStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsStoreOwner]

    def put(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        self.check_object_permissions(request, order)
        new_status = request.data.get('status')
        if new_status not in dict(Order.STATUS_CHOICES):
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)
        order.status = new_status
        order.save()
        serializer = OrderSerializer(order)
        return Response(serializer.data)