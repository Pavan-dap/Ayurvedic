from django.db import models
from django.contrib.auth.models import User
from outlets.models import Outlet

class ProductCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    hsn_code = models.CharField(max_length=20, blank=True, null=True)
    gst_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    PRODUCT_TYPES = [
        ('RAW_MATERIAL', 'Raw Material'),
        ('SEMI_FINISHED', 'Semi-Finished Goods'),
        ('FINISHED', 'Finished Goods'),
        ('PACKAGING', 'Packaging Material'),
    ]

    product_code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=200)
    category = models.ForeignKey(ProductCategory, on_delete=models.CASCADE, related_name='products')
    product_type = models.CharField(max_length=20, choices=PRODUCT_TYPES)
    description = models.TextField(blank=True, null=True)
    unit_of_measure = models.CharField(max_length=20, default='Kg')
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    minimum_stock_level = models.DecimalField(max_digits=10, decimal_places=3, default=10.000)
    maximum_stock_level = models.DecimalField(max_digits=10, decimal_places=3, default=1000.000)
    reorder_point = models.DecimalField(max_digits=10, decimal_places=3, default=20.000)
    shelf_life_days = models.IntegerField(default=365)
    barcode = models.CharField(max_length=50, blank=True, null=True, unique=True)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.product_code} - {self.name}"

class Stock(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='stock_entries')
    outlet = models.ForeignKey(Outlet, on_delete=models.CASCADE, related_name='stock')
    batch_number = models.CharField(max_length=50)
    quantity = models.DecimalField(max_digits=12, decimal_places=3, default=0.000)
    reserved_quantity = models.DecimalField(max_digits=12, decimal_places=3, default=0.000)
    available_quantity = models.DecimalField(max_digits=12, decimal_places=3, default=0.000)
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2)
    manufacturing_date = models.DateField(blank=True, null=True)
    expiry_date = models.DateField(blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['product', 'outlet', 'batch_number']

    def save(self, *args, **kwargs):
        self.available_quantity = self.quantity - self.reserved_quantity
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product.name} - {self.batch_number} - {self.outlet.name}"

class StockMovement(models.Model):
    MOVEMENT_TYPES = [
        ('IN', 'Stock In'),
        ('OUT', 'Stock Out'),
        ('TRANSFER_IN', 'Transfer In'),
        ('TRANSFER_OUT', 'Transfer Out'),
        ('ADJUSTMENT', 'Stock Adjustment'),
        ('WASTAGE', 'Wastage'),
        ('RETURN', 'Return'),
    ]

    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, related_name='movements')
    movement_type = models.CharField(max_length=20, choices=MOVEMENT_TYPES)
    quantity = models.DecimalField(max_digits=12, decimal_places=3)
    reference_number = models.CharField(max_length=50, blank=True, null=True)
    reference_type = models.CharField(max_length=50, blank=True, null=True)  # PO, Sale, Transfer, etc.
    notes = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.stock.product.name} - {self.movement_type} - {self.quantity}"

class PurchaseOrder(models.Model):
    PO_STATUS = [
        ('DRAFT', 'Draft'),
        ('SENT', 'Sent to Vendor'),
        ('CONFIRMED', 'Confirmed'),
        ('PARTIALLY_RECEIVED', 'Partially Received'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]

    po_number = models.CharField(max_length=20, unique=True)
    vendor_name = models.CharField(max_length=200)
    vendor_contact = models.CharField(max_length=200, blank=True, null=True)
    po_date = models.DateField()
    expected_delivery = models.DateField()
    status = models.CharField(max_length=20, choices=PO_STATUS, default='DRAFT')
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    notes = models.TextField(blank=True, null=True)
    terms_conditions = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.po_number} - {self.vendor_name}"

class PurchaseOrderItem(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='items')
    product_name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    quantity = models.DecimalField(max_digits=10, decimal_places=3)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=12, decimal_places=2)
    received_quantity = models.DecimalField(max_digits=10, decimal_places=3, default=0.000)
    unit_of_measure = models.CharField(max_length=20, default='Kg')

    def save(self, *args, **kwargs):
        self.total_price = self.quantity * self.unit_price
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.purchase_order.po_number} - {self.product_name}"

class GoodsReceiptNote(models.Model):
    GRN_STATUS = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]

    grn_number = models.CharField(max_length=20, unique=True)
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='grns')
    received_date = models.DateTimeField()
    invoice_number = models.CharField(max_length=50, blank=True, null=True)
    invoice_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=GRN_STATUS, default='PENDING')
    notes = models.TextField(blank=True, null=True)
    received_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='received_grns')
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_grns')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.grn_number} - {self.purchase_order.po_number}"

class GoodsReceiptItem(models.Model):
    grn = models.ForeignKey(GoodsReceiptNote, on_delete=models.CASCADE, related_name='items')
    po_item = models.ForeignKey(PurchaseOrderItem, on_delete=models.CASCADE)
    batch_number = models.CharField(max_length=50)
    quantity_received = models.DecimalField(max_digits=10, decimal_places=3)
    quantity_accepted = models.DecimalField(max_digits=10, decimal_places=3)
    quantity_rejected = models.DecimalField(max_digits=10, decimal_places=3, default=0.000)
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2)
    manufacturing_date = models.DateField(blank=True, null=True)
    expiry_date = models.DateField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.grn.grn_number} - {self.po_item.product_name}"