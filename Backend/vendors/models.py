from django.db import models
from django.contrib.auth.models import User

class Vendor(models.Model):
    VENDOR_TYPES = [
        ('RAW_MATERIAL', 'Raw Material Supplier'),
        ('PACKAGING', 'Packaging Material'),
        ('SERVICE', 'Service Provider'),
        ('EQUIPMENT', 'Equipment Supplier'),
    ]

    vendor_code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=200)
    contact_person = models.CharField(max_length=100)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=15)
    alternate_phone = models.CharField(max_length=15, blank=True, null=True)
    address_line1 = models.CharField(max_length=255)
    address_line2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    country = models.CharField(max_length=100, default='India')
    vendor_type = models.CharField(max_length=20, choices=VENDOR_TYPES)
    gstin = models.CharField(max_length=15, blank=True, null=True)
    pan = models.CharField(max_length=10, blank=True, null=True)
    credit_period = models.IntegerField(default=30, help_text='Credit period in days')
    credit_limit = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    bank_name = models.CharField(max_length=100, blank=True, null=True)
    bank_account = models.CharField(max_length=50, blank=True, null=True)
    ifsc_code = models.CharField(max_length=20, blank=True, null=True)
    performance_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.vendor_code} - {self.name}"

class VendorProduct(models.Model):
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='products')
    product_name = models.CharField(max_length=200)
    product_code = models.CharField(max_length=50)
    description = models.TextField(blank=True, null=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    unit_of_measure = models.CharField(max_length=20, default='Kg')
    minimum_order_qty = models.DecimalField(max_digits=10, decimal_places=3, default=1)
    lead_time_days = models.IntegerField(default=7)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.vendor.name} - {self.product_name}"

class VendorPerformance(models.Model):
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='performance_records')
    evaluation_date = models.DateField()
    quality_rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])  # 1-5 rating
    delivery_rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    service_rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    overall_rating = models.DecimalField(max_digits=3, decimal_places=2)
    comments = models.TextField(blank=True, null=True)
    evaluated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Calculate overall rating
        self.overall_rating = (self.quality_rating + self.delivery_rating + self.service_rating) / 3
        super().save(*args, **kwargs)
        
        # Update vendor's performance rating
        avg_rating = VendorPerformance.objects.filter(vendor=self.vendor).aggregate(
            avg=models.Avg('overall_rating')
        )['avg']
        self.vendor.performance_rating = avg_rating or 0
        self.vendor.save()

    def __str__(self):
        return f"{self.vendor.name} - {self.evaluation_date} - {self.overall_rating}"