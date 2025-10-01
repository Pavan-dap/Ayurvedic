from django.db import models
from django.contrib.auth.models import User

class CustomerCategory(models.Model):
    name = models.CharField(max_length=50, unique=True)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Customer(models.Model):
    CUSTOMER_TYPES = [
        ('B2B', 'Business to Business'),
        ('B2C', 'Business to Consumer'),
        ('WHOLESALE', 'Wholesale'),
        ('RETAIL', 'Retail'),
    ]

    customer_code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=200)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=15)
    alternate_phone = models.CharField(max_length=15, blank=True, null=True)
    address_line1 = models.CharField(max_length=255)
    address_line2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    country = models.CharField(max_length=100, default='India')
    customer_type = models.CharField(max_length=10, choices=CUSTOMER_TYPES, default='RETAIL')
    category = models.ForeignKey(CustomerCategory, on_delete=models.SET_NULL, null=True, blank=True)
    gstin = models.CharField(max_length=15, blank=True, null=True)
    credit_limit = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    loyalty_points = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.customer_code} - {self.name}"

class CustomerTransaction(models.Model):
    TRANSACTION_TYPES = [
        ('SALE', 'Sale'),
        ('PAYMENT', 'Payment Received'),
        ('REFUND', 'Refund'),
        ('LOYALTY_EARNED', 'Loyalty Points Earned'),
        ('LOYALTY_REDEEMED', 'Loyalty Points Redeemed'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    loyalty_points = models.IntegerField(default=0)
    reference_number = models.CharField(max_length=50, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer.name} - {self.transaction_type} - ₹{self.amount}"