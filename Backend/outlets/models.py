from django.db import models
from django.contrib.auth.models import User

class Outlet(models.Model):
    OUTLET_TYPES = [
        ('MAIN', 'Main Manufacturing Unit'),
        ('RETAIL', 'Retail Store'),
        ('WAREHOUSE', 'Warehouse'),
        ('DISTRIBUTION', 'Distribution Center'),
    ]

    outlet_code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=200)
    outlet_type = models.CharField(max_length=20, choices=OUTLET_TYPES)
    address_line1 = models.CharField(max_length=255)
    address_line2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    phone = models.CharField(max_length=15)
    email = models.EmailField(blank=True, null=True)
    manager = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='managed_outlets')
    gstin = models.CharField(max_length=15, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.outlet_code} - {self.name}"

class StockTransfer(models.Model):
    TRANSFER_STATUS = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('IN_TRANSIT', 'In Transit'),
        ('RECEIVED', 'Received'),
        ('CANCELLED', 'Cancelled'),
    ]

    transfer_number = models.CharField(max_length=20, unique=True)
    from_outlet = models.ForeignKey(Outlet, on_delete=models.CASCADE, related_name='outgoing_transfers')
    to_outlet = models.ForeignKey(Outlet, on_delete=models.CASCADE, related_name='incoming_transfers')
    transfer_date = models.DateTimeField()
    expected_delivery = models.DateTimeField()
    status = models.CharField(max_length=20, choices=TRANSFER_STATUS, default='PENDING')
    notes = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_transfers')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.transfer_number} - {self.from_outlet.name} to {self.to_outlet.name}"

class StockTransferItem(models.Model):
    transfer = models.ForeignKey(StockTransfer, on_delete=models.CASCADE, related_name='items')
    product_name = models.CharField(max_length=200)
    batch_number = models.CharField(max_length=50)
    quantity_requested = models.DecimalField(max_digits=10, decimal_places=3)
    quantity_sent = models.DecimalField(max_digits=10, decimal_places=3, default=0)
    quantity_received = models.DecimalField(max_digits=10, decimal_places=3, default=0)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    expiry_date = models.DateField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.transfer.transfer_number} - {self.product_name}"

class CashDenomination(models.Model):
    outlet = models.ForeignKey(Outlet, on_delete=models.CASCADE, related_name='cash_denominations')
    date = models.DateField()
    note_2000 = models.IntegerField(default=0)
    note_500 = models.IntegerField(default=0)
    note_200 = models.IntegerField(default=0)
    note_100 = models.IntegerField(default=0)
    note_50 = models.IntegerField(default=0)
    note_20 = models.IntegerField(default=0)
    note_10 = models.IntegerField(default=0)
    coin_10 = models.IntegerField(default=0)
    coin_5 = models.IntegerField(default=0)
    coin_2 = models.IntegerField(default=0)
    coin_1 = models.IntegerField(default=0)
    total_cash = models.DecimalField(max_digits=12, decimal_places=2, editable=False)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['outlet', 'date']

    def save(self, *args, **kwargs):
        # Calculate total cash
        self.total_cash = (
            self.note_2000 * 2000 +
            self.note_500 * 500 +
            self.note_200 * 200 +
            self.note_100 * 100 +
            self.note_50 * 50 +
            self.note_20 * 20 +
            self.note_10 * 10 +
            self.coin_10 * 10 +
            self.coin_5 * 5 +
            self.coin_2 * 2 +
            self.coin_1 * 1
        )
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.outlet.name} - {self.date} - ₹{self.total_cash}"