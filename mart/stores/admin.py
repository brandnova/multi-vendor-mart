from django.contrib import admin
from .models import Store, BankDetails, Product

class BankDetailsInline(admin.TabularInline):
    model = BankDetails
    extra = 1

class ProductInline(admin.TabularInline):
    model = Product
    extra = 1

@admin.register(Store)
class StoreAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('name', 'owner__email', 'owner__username')
    inlines = [BankDetailsInline, ProductInline]

@admin.register(BankDetails)
class BankDetailsAdmin(admin.ModelAdmin):
    list_display = ('store', 'bank_name', 'account_name')
    search_fields = ('store__name', 'bank_name', 'account_name')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'store', 'price', 'quantity')
    list_filter = ('store',)
    search_fields = ('name', 'store__name', 'description')