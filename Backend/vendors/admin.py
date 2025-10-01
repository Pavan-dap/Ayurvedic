from django.contrib import admin
from .models import Vendor, VendorProduct, VendorPerformance

@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    list_display = ['vendor_code', 'name', 'vendor_type', 'phone', 'city', 'performance_rating', 'is_active']
    list_filter = ['vendor_type', 'is_active', 'city', 'state']
    search_fields = ['name', 'vendor_code', 'contact_person', 'phone']
    readonly_fields = ['vendor_code', 'performance_rating', 'created_at', 'updated_at']

@admin.register(VendorProduct)
class VendorProductAdmin(admin.ModelAdmin):
    list_display = ['vendor', 'product_name', 'unit_price', 'unit_of_measure', 'is_active']
    list_filter = ['vendor', 'is_active', 'unit_of_measure']

@admin.register(VendorPerformance)
class VendorPerformanceAdmin(admin.ModelAdmin):
    list_display = ['vendor', 'evaluation_date', 'overall_rating', 'evaluated_by']
    list_filter = ['evaluation_date', 'overall_rating']