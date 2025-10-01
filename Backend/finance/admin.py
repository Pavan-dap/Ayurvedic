from django.contrib import admin
from .models import (
    ExpenseCategory, Expense, GSTReport, HSNReport,
    CashFlow, BankAccount, BankTransaction
)

@admin.register(ExpenseCategory)
class ExpenseCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_active', 'created_at']
    list_filter = ['is_active']

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ['expense_number', 'category', 'outlet', 'amount', 'expense_date', 'is_approved']
    list_filter = ['category', 'outlet', 'is_approved', 'payment_method']
    search_fields = ['expense_number', 'description', 'vendor_name']

@admin.register(GSTReport)
class GSTReportAdmin(admin.ModelAdmin):
    list_display = ['report_type', 'month', 'year', 'outlet', 'total_sales', 'tax_payable']
    list_filter = ['report_type', 'year', 'outlet']

@admin.register(BankAccount)
class BankAccountAdmin(admin.ModelAdmin):
    list_display = ['account_name', 'account_number', 'bank_name', 'outlet', 'current_balance', 'is_active']
    list_filter = ['account_type', 'outlet', 'is_active']