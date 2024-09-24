# stores/urls.py

from django.urls import path
from .views import (
    StoreCreateView,
    StoreDetailView,
    BankDetailsCreateView,
    BankDetailsListView,
    BankDetailsDetailView,
    ProductListCreateView,
    ProductDetailView,
    PublicStoreView,
)

urlpatterns = [
    path('store/', StoreCreateView.as_view(), name='store-create'),
    path('store/detail/', StoreDetailView.as_view(), name='store-detail'),
    path('bank-details/', BankDetailsCreateView.as_view(), name='bank-details-create'),
    path('bank-details/list/', BankDetailsListView.as_view(), name='bank-details-list'),
    path('bank-details/<int:pk>/', BankDetailsDetailView.as_view(), name='bank-details-detail'),
    path('products/', ProductListCreateView.as_view(), name='product-list-create'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('<slug:slug>/', PublicStoreView.as_view(), name='public-store-view'),
]