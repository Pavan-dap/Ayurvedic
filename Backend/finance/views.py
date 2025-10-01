from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import datetime, timedelta
from .models import (
    ExpenseCategory, Expense, GSTReport, HSNReport,
    CashFlow, BankAccount, BankTransaction
)
from .serializers import (
    ExpenseCategorySerializer, ExpenseSerializer, GSTReportSerializer,
    HSNReportSerializer, CashFlowSerializer, BankAccountSerializer, BankTransactionSerializer
)

class ExpenseCategoryViewSet(viewsets.ModelViewSet):
    queryset = ExpenseCategory.objects.all()
    serializer_class = ExpenseCategorySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_active']
    search_fields = ['name']

class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all().select_related('category', 'outlet', 'created_by')
    serializer_class = ExpenseSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'outlet', 'is_approved', 'payment_method']
    search_fields = ['expense_number', 'description', 'vendor_name']
    ordering = ['-expense_date']

    @action(detail=True, methods=['post'])
    def approve_expense(self, request, pk=None):
        expense = self.get_object()
        if not expense.is_approved:
            expense.is_approved = True
            expense.approved_by = request.user
            expense.save()
            
            # Create cash flow entry
            CashFlow.objects.create(
                outlet=expense.outlet,
                flow_type='OUTFLOW',
                amount=expense.amount,
                description=f'Expense: {expense.description}',
                reference_type='EXPENSE',
                reference_number=expense.expense_number,
                transaction_date=timezone.now(),
                created_by=request.user
            )
            
            return Response({'message': 'Expense approved successfully'})
        return Response({'error': 'Expense already approved'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def expense_summary(self, request):
        today = timezone.now().date()
        start_of_month = today.replace(day=1)
        
        # This month's expenses
        month_expenses = Expense.objects.filter(
            expense_date__gte=start_of_month,
            is_approved=True
        ).aggregate(
            total=Sum('amount'),
            count=Count('id')
        )
        
        # Category wise expenses
        category_expenses = Expense.objects.filter(
            expense_date__gte=start_of_month,
            is_approved=True
        ).values('category__name').annotate(
            total=Sum('amount'),
            count=Count('id')
        ).order_by('-total')
        
        return Response({
            'this_month': month_expenses,
            'by_category': category_expenses
        })

class GSTReportViewSet(viewsets.ModelViewSet):
    queryset = GSTReport.objects.all().select_related('outlet', 'generated_by')
    serializer_class = GSTReportSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['report_type', 'month', 'year', 'outlet']
    ordering = ['-year', '-month']

    @action(detail=False, methods=['post'])
    def generate_report(self, request):
        """Generate GST report for given month and year"""
        month = request.data.get('month')
        year = request.data.get('year')
        outlet_id = request.data.get('outlet_id')
        report_type = request.data.get('report_type', 'GSTR1')
        
        if not all([month, year, outlet_id]):
            return Response({'error': 'Month, year, and outlet are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Here you would implement the actual GST report generation logic
        # This is a simplified version
        
        report, created = GSTReport.objects.get_or_create(
            report_type=report_type,
            month=month,
            year=year,
            outlet_id=outlet_id,
            defaults={
                'generated_by': request.user
            }
        )
        
        if created:
            # Calculate GST data from sales and purchases
            # This is where you'd implement the complex GST calculations
            report.total_sales = 100000  # Placeholder
            report.b2b_sales = 80000
            report.b2c_sales = 20000
            report.cgst_amount = 9000
            report.sgst_amount = 9000
            report.save()
        
        serializer = self.get_serializer(report)
        return Response(serializer.data)

class HSNReportViewSet(viewsets.ModelViewSet):
    queryset = HSNReport.objects.all().select_related('outlet', 'generated_by')
    serializer_class = HSNReportSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['month', 'year', 'outlet', 'hsn_code']
    ordering = ['-year', '-month', 'hsn_code']

class CashFlowViewSet(viewsets.ModelViewSet):
    queryset = CashFlow.objects.all().select_related('outlet', 'created_by')
    serializer_class = CashFlowSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['outlet', 'flow_type', 'reference_type']
    ordering = ['-transaction_date']

    @action(detail=False, methods=['get'])
    def cash_flow_summary(self, request):
        today = timezone.now().date()
        start_of_month = today.replace(day=1)
        
        # This month's cash flow
        inflows = CashFlow.objects.filter(
            transaction_date__date__gte=start_of_month,
            flow_type='INFLOW'
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        outflows = CashFlow.objects.filter(
            transaction_date__date__gte=start_of_month,
            flow_type='OUTFLOW'
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        net_flow = inflows - outflows
        
        return Response({
            'period': f'{start_of_month} to {today}',
            'inflows': inflows,
            'outflows': outflows,
            'net_flow': net_flow
        })

class BankAccountViewSet(viewsets.ModelViewSet):
    queryset = BankAccount.objects.all().select_related('outlet')
    serializer_class = BankAccountSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['outlet', 'account_type', 'is_active']
    search_fields = ['account_name', 'account_number', 'bank_name']

class BankTransactionViewSet(viewsets.ModelViewSet):
    queryset = BankTransaction.objects.all().select_related('bank_account', 'created_by')
    serializer_class = BankTransactionSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['bank_account', 'transaction_type']
    ordering = ['-transaction_date']

    @action(detail=False, methods=['get'])
    def account_balances(self, request):
        """Get current balance for all bank accounts"""
        accounts = BankAccount.objects.filter(is_active=True)
        
        balance_data = []
        for account in accounts:
            balance_data.append({
                'account': BankAccountSerializer(account).data,
                'current_balance': account.current_balance
            })
        
        total_balance = sum([acc['current_balance'] for acc in balance_data])
        
        return Response({
            'accounts': balance_data,
            'total_balance': total_balance
        })