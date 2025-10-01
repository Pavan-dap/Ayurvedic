from django.contrib import admin
from .models import Sale, SaleItem, Payment, SplitPayment, Discount, SalesTarget

@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ['invoice_number', 'customer', 'outlet', 'sale_date', 'total_amount', 'payment_status']
    list_filter = ['sale_type', 'payment_status', 'outlet', 'sale_date']
    search_fields = ['invoice_number', 'customer__name']

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['payment_number', 'sale', 'amount', 'payment_method', 'payment_date']
    list_filter = ['payment_method', 'payment_date']

@admin.register(Discount)
class DiscountAdmin(admin.ModelAdmin):
    list_display = ['name', 'discount_type', 'value', 'valid_from', 'valid_until', 'is_active']
    list_filter = ['discount_type', 'is_active']

@admin.register(SalesTarget)
class SalesTargetAdmin(admin.ModelAdmin):
    list_display = ['outlet', 'period_type', 'target_amount', 'achieved_amount', 'achievement_percentage']
    list_filter = ['period_type', 'outlet']