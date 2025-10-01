from django.db import models
from django.contrib.auth.models import User
from outlets.models import Outlet

class ExpenseCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Expense(models.Model):
    expense_number = models.CharField(max_length=20, unique=True)
    outlet = models.ForeignKey(Outlet, on_delete=models.CASCADE, related_name='expenses')
    category = models.ForeignKey(ExpenseCategory, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    expense_date = models.DateField()
    description = models.TextField()
    vendor_name = models.CharField(max_length=200, blank=True, null=True)
    invoice_number = models.CharField(max_length=50, blank=True, null=True)
    payment_method = models.CharField(max_length=20, choices=[
        ('CASH', 'Cash'),
        ('BANK_TRANSFER', 'Bank Transfer'),
        ('CHEQUE', 'Cheque'),
        ('CARD', 'Card'),
    ])
    is_approved = models.BooleanField(default=False)
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_expenses')
    notes = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.expense_number} - {self.category.name} - ₹{self.amount}"

class GSTReport(models.Model):
    REPORT_TYPES = [
        ('GSTR1', 'GSTR-1'),
        ('GSTR3B', 'GSTR-3B'),
        ('GSTR9', 'GSTR-9'),
    ]

    report_type = models.CharField(max_length=10, choices=REPORT_TYPES)
    month = models.IntegerField()
    year = models.IntegerField()
    outlet = models.ForeignKey(Outlet, on_delete=models.CASCADE, related_name='gst_reports')
    
    # Sales data
    total_sales = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    b2b_sales = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    b2c_sales = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    export_sales = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    
    # Tax data
    cgst_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    sgst_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    igst_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total_tax_collected = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    # Purchase data
    total_purchases = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    input_tax_credit = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    # Net tax
    tax_payable = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    generated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    generated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['report_type', 'month', 'year', 'outlet']

    def save(self, *args, **kwargs):
        self.total_tax_collected = self.cgst_amount + self.sgst_amount + self.igst_amount
        self.tax_payable = self.total_tax_collected - self.input_tax_credit
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.report_type} - {self.month}/{self.year} - {self.outlet.name}"

class HSNReport(models.Model):
    hsn_code = models.CharField(max_length=20)
    description = models.TextField()
    unit_of_measure = models.CharField(max_length=20)
    total_quantity = models.DecimalField(max_digits=15, decimal_places=3, default=0.000)
    total_value = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    taxable_value = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    integrated_tax = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    central_tax = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    state_tax = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    cess = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    month = models.IntegerField()
    year = models.IntegerField()
    outlet = models.ForeignKey(Outlet, on_delete=models.CASCADE, related_name='hsn_reports')
    
    generated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    generated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['hsn_code', 'month', 'year', 'outlet']

    def __str__(self):
        return f"HSN {self.hsn_code} - {self.month}/{self.year} - {self.outlet.name}"

class CashFlow(models.Model):
    FLOW_TYPES = [
        ('INFLOW', 'Cash Inflow'),
        ('OUTFLOW', 'Cash Outflow'),
    ]

    outlet = models.ForeignKey(Outlet, on_delete=models.CASCADE, related_name='cash_flows')
    flow_type = models.CharField(max_length=10, choices=FLOW_TYPES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField()
    reference_type = models.CharField(max_length=50, help_text='Sale, Purchase, Expense, etc.')
    reference_number = models.CharField(max_length=50, blank=True, null=True)
    transaction_date = models.DateTimeField()
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.outlet.name} - {self.flow_type} - ₹{self.amount}"

class BankAccount(models.Model):
    ACCOUNT_TYPES = [
        ('CURRENT', 'Current Account'),
        ('SAVINGS', 'Savings Account'),
        ('CASH_CREDIT', 'Cash Credit'),
        ('OVERDRAFT', 'Overdraft'),
    ]

    outlet = models.ForeignKey(Outlet, on_delete=models.CASCADE, related_name='bank_accounts')
    account_name = models.CharField(max_length=200)
    account_number = models.CharField(max_length=50)
    bank_name = models.CharField(max_length=100)
    branch = models.CharField(max_length=100)
    ifsc_code = models.CharField(max_length=20)
    account_type = models.CharField(max_length=15, choices=ACCOUNT_TYPES)
    current_balance = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.bank_name} - {self.account_number} - {self.outlet.name}"

class BankTransaction(models.Model):
    TRANSACTION_TYPES = [
        ('CREDIT', 'Credit'),
        ('DEBIT', 'Debit'),
    ]

    bank_account = models.ForeignKey(BankAccount, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    balance_after = models.DecimalField(max_digits=15, decimal_places=2)
    description = models.TextField()
    reference_number = models.CharField(max_length=50, blank=True, null=True)
    transaction_date = models.DateTimeField()
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Update bank account balance
        if self.transaction_type == 'CREDIT':
            self.balance_after = self.bank_account.current_balance + self.amount
        else:
            self.balance_after = self.bank_account.current_balance - self.amount
        
        self.bank_account.current_balance = self.balance_after
        self.bank_account.save()
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.bank_account.account_name} - {self.transaction_type} - ₹{self.amount}"