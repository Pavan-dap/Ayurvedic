from django.contrib import admin
from .models import Outlet, StockTransfer, StockTransferItem, CashDenomination

@admin.register(Outlet)
class OutletAdmin(admin.ModelAdmin):
    list_display = ['outlet_code', 'name', 'outlet_type', 'city', 'manager', 'is_active']
    list_filter = ['outlet_type', 'is_active', 'city', 'state']
    search_fields = ['name', 'outlet_code', 'city']

@admin.register(StockTransfer)
class StockTransferAdmin(admin.ModelAdmin):
    list_display = ['transfer_number', 'from_outlet', 'to_outlet', 'status', 'transfer_date']
    list_filter = ['status', 'transfer_date', 'from_outlet', 'to_outlet']
    search_fields = ['transfer_number']

@admin.register(CashDenomination)
class CashDenominationAdmin(admin.ModelAdmin):
    list_display = ['outlet', 'date', 'total_cash', 'created_by']
    list_filter = ['date', 'outlet']