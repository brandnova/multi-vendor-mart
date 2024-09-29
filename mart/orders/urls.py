from django.urls import path
from .views import OrderCreateView, OrderListView, OrderDetailView, OrderDeleteView, UpdateProductQuantityView, UpdateOrderStatusView

urlpatterns = [
    path('create/<slug:store_slug>/', OrderCreateView.as_view(), name='order-create'),
    path('list/', OrderListView.as_view(), name='order-list'),
    path('<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('<int:pk>/delete/', OrderDeleteView.as_view(), name='order-delete'),
    path('update-product-quantity/<int:pk>/', UpdateProductQuantityView.as_view(), name='update-product-quantity'),
    path('<int:pk>/update-status/', UpdateOrderStatusView.as_view(), name='update-order-status'),
]