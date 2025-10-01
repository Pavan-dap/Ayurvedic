from django.db import models
from django.contrib.auth.models import User
from customers.models import Customer
from outlets.models import Outlet
from inventory.models import Product, Stock

class Sale(models.Model):
    SALE_TYPES = [
        ('B2B', 'Business to Business'),
        ('B2C', 'Business to Consumer'),
        ('WHOLESALE', 'Wholesale'),
        ('RETAIL', 'Retail'),
    ]

    PAYMENT_STATUS = [
        ('PENDING', 'Pending'),
        ('PARTIAL', 'Partially Paid'),
        ('PAID', 'Fully Paid'),
        ('OVERDUE', 'Overdue'),
    ]

    invoice_number = models.CharField(max_length=20, unique=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='sales')
    outlet = models.ForeignKey(Outlet, on_delete=models.CASCADE, related_name='sales')
    sale_date = models.DateTimeField()
    sale_type = models.CharField(max_length=10, choices=SALE_TYPES)
    
    # Amounts
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    # Payment
    payment_status = models.CharField(max_length=10, choices=PAYMENT_STATUS, default='PENDING')
    paid_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    due_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    # Additional info
    notes = models.TextField(blank=True, null=True)
    terms_conditions = models.TextField(blank=True, null=True)
    
    # System fields
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.due_amount = self.total_amount - self.paid_amount
        if self.paid_amount >= self.total_amount:
            self.payment_status = 'PAID'
        elif self.paid_amount > 0:
            self.payment_status = 'PARTIAL'
        else:
            self.payment_status = 'PENDING'
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.invoice_number} - {self.customer.name}"

class SaleItem(models.Model):
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, blank=True, null=True)
    batch_number = models.CharField(max_length=50, blank=True, null=True)
    quantity = models.DecimalField(max_digits=10, decimal_places=3)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    tax_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    line_total = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    def save(self, *args, **kwargs):
        # Calculate line total
        gross_amount = self.quantity * self.unit_price
        discount = (gross_amount * self.discount_percentage / 100) if self.discount_percentage else self.discount_amount
        taxable_amount = gross_amount - discount
        tax = taxable_amount * self.tax_percentage / 100
        self.line_total = taxable_amount + tax
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.sale.invoice_number} - {self.product.name}"

class Payment(models.Model):
    PAYMENT_METHODS = [
        ('CASH', 'Cash'),
        ('UPI', 'UPI'),
        ('CARD', 'Card'),
        ('BANK_TRANSFER', 'Bank Transfer'),
        ('CHEQUE', 'Cheque'),
    ]

    payment_number = models.CharField(max_length=20, unique=True)
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='payments')
    payment_date = models.DateTimeField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_method = models.CharField(max_length=15, choices=PAYMENT_METHODS)
    reference_number = models.CharField(max_length=50, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.payment_number} - ₹{self.amount}"

class SplitPayment(models.Model):
    """For handling split payments (part cash, part UPI, etc.)"""
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='split_payments')
    payment_method = models.CharField(max_length=15, choices=Payment.PAYMENT_METHODS)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    reference_number = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sale.invoice_number} - {self.payment_method} - ₹{self.amount}"

class Discount(models.Model):
    DISCOUNT_TYPES = [
        ('PERCENTAGE', 'Percentage'),
        ('FIXED', 'Fixed Amount'),
    ]

    name = models.CharField(max_length=100, unique=True)
    discount_type = models.CharField(max_length=10, choices=DISCOUNT_TYPES)
    value = models.DecimalField(max_digits=10, decimal_places=2)
    minimum_purchase = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    maximum_discount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    valid_from = models.DateTimeField()
    valid_until = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.value}{'%' if self.discount_type == 'PERCENTAGE' else '₹'}"

class SalesTarget(models.Model):
    TARGET_PERIODS = [
        ('DAILY', 'Daily'),
        ('WEEKLY', 'Weekly'),
        ('MONTHLY', 'Monthly'),
        ('QUARTERLY', 'Quarterly'),
        ('YEARLY', 'Yearly'),
    ]

    outlet = models.ForeignKey(Outlet, on_delete=models.CASCADE, related_name='sales_targets')
    salesperson = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    period_type = models.CharField(max_length=10, choices=TARGET_PERIODS)
    start_date = models.DateField()
    end_date = models.DateField()
    target_amount = models.DecimalField(max_digits=12, decimal_places=2)
    achieved_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    achievement_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.target_amount > 0:
            self.achievement_percentage = (self.achieved_amount / self.target_amount) * 100
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.outlet.name} - {self.period_type} - ₹{self.target_amount}"