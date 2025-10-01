from rest_framework import serializers
from .models import (
    ExpenseCategory, Expense, GSTReport, HSNReport, 
    CashFlow, BankAccount, BankTransaction
)

class ExpenseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseCategory
        fields = '__all__'

class ExpenseSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    outlet_name = serializers.CharField(source='outlet.name', read_only=True)
    
    class Meta:
        model = Expense
        fields = '__all__'

    def create(self, validated_data):
        # Auto-generate expense number
        from datetime import datetime
        today = datetime.now().strftime('%Y%m%d')
        last_expense = Expense.objects.filter(
            expense_number__startswith=f'EXP{today}'
        ).order_by('id').last()
        
        if last_expense:
            try:
                seq_num = int(last_expense.expense_number[-3:]) + 1
            except:
                seq_num = 1
        else:
            seq_num = 1
            
        validated_data['expense_number'] = f'EXP{today}{seq_num:03d}'
        return super().create(validated_data)

class GSTReportSerializer(serializers.ModelSerializer):
    outlet_name = serializers.CharField(source='outlet.name', read_only=True)
    report_type_display = serializers.CharField(source='get_report_type_display', read_only=True)
    
    class Meta:
        model = GSTReport
        fields = '__all__'

class HSNReportSerializer(serializers.ModelSerializer):
    outlet_name = serializers.CharField(source='outlet.name', read_only=True)
    
    class Meta:
        model = HSNReport
        fields = '__all__'

class CashFlowSerializer(serializers.ModelSerializer):
    outlet_name = serializers.CharField(source='outlet.name', read_only=True)
    flow_type_display = serializers.CharField(source='get_flow_type_display', read_only=True)
    
    class Meta:
        model = CashFlow
        fields = '__all__'

class BankAccountSerializer(serializers.ModelSerializer):
    outlet_name = serializers.CharField(source='outlet.name', read_only=True)
    account_type_display = serializers.CharField(source='get_account_type_display', read_only=True)
    
    class Meta:
        model = BankAccount
        fields = '__all__'

class BankTransactionSerializer(serializers.ModelSerializer):
    bank_account_name = serializers.CharField(source='bank_account.account_name', read_only=True)
    transaction_type_display = serializers.CharField(source='get_transaction_type_display', read_only=True)
    
    class Meta:
        model = BankTransaction
        fields = '__all__'