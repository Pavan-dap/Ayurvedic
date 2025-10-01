from django.contrib import admin
from .models import (
    ProductCategory, Product, Stock, StockMovement,
    PurchaseOrder, PurchaseOrderItem, GoodsReceiptNote, GoodsReceiptItem
)

@admin.register(ProductCategory)
class ProductCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'hsn_code', 'gst_rate', 'is_active']
    list_filter = ['is_active', 'gst_rate']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['product_code', 'name', 'category', 'product_type', 'unit_price', 'is_active']
    list_filter = ['product_type', 'category', 'is_active']
    search_fields = ['name', 'product_code', 'barcode']

@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    list_display = ['product', 'outlet', 'batch_number', 'quantity', 'available_quantity', 'expiry_date']
    list_filter = ['outlet', 'product__product_type', 'is_active']
    search_fields = ['product__name', 'batch_number']

@admin.register(PurchaseOrder)
class PurchaseOrderAdmin(admin.ModelAdmin):
    list_display = ['po_number', 'vendor_name', 'po_date', 'status', 'total_amount']
    list_filter = ['status', 'po_date']
    search_fields = ['po_number', 'vendor_name']

@admin.register(GoodsReceiptNote)
class GoodsReceiptNoteAdmin(admin.ModelAdmin):
    list_display = ['grn_number', 'purchase_order', 'received_date', 'status']
    list_filter = ['status', 'received_date']