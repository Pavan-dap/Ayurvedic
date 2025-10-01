from django.contrib import admin
from .models import Customer, CustomerCategory, CustomerTransaction

@admin.register(CustomerCategory)
class CustomerCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'discount_percentage', 'created_at']

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['customer_code', 'name', 'customer_type', 'phone', 'city', 'is_active']
    list_filter = ['customer_type', 'category', 'is_active', 'city', 'state']
    search_fields = ['name', 'customer_code', 'phone', 'email']
    readonly_fields = ['customer_code', 'created_at', 'updated_at']

@admin.register(CustomerTransaction)
class CustomerTransactionAdmin(admin.ModelAdmin):
    list_display = ['customer', 'transaction_type', 'amount', 'loyalty_points', 'created_at']
    list_filter = ['transaction_type', 'created_at']