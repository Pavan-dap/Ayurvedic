from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum, Count, Avg, Q
from django.utils import timezone
from datetime import datetime, timedelta
from .models import ReportTemplate, GeneratedReport
from .serializers import ReportTemplateSerializer, GeneratedReportSerializer

class ReportTemplateViewSet(viewsets.ModelViewSet):
    queryset = ReportTemplate.objects.all().select_related('created_by')
    serializer_class = ReportTemplateSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['report_type', 'is_active']
    search_fields = ['name', 'description']
    ordering = ['report_type', 'name']

class GeneratedReportViewSet(viewsets.ModelViewSet):
    queryset = GeneratedReport.objects.all().select_related('template', 'generated_by')
    serializer_class = GeneratedReportSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['template', 'status', 'export_format']
    ordering = ['-generated_at']

    @action(detail=False, methods=['post'])
    def generate_sales_report(self, request):
        """Generate sales report with filters"""
        from sales.models import Sale
        from outlets.models import Outlet
        
        # Get parameters
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        outlet_id = request.data.get('outlet_id')
        sale_type = request.data.get('sale_type')
        
        # Build query
        sales = Sale.objects.all()
        
        if start_date:
            sales = sales.filter(sale_date__date__gte=start_date)
        if end_date:
            sales = sales.filter(sale_date__date__lte=end_date)
        if outlet_id:
            sales = sales.filter(outlet_id=outlet_id)
        if sale_type:
            sales = sales.filter(sale_type=sale_type)
        
        # Generate summary data
        summary = sales.aggregate(
            total_sales=Sum('total_amount'),
            total_orders=Count('id'),
            average_order_value=Avg('total_amount')
        )
        
        # Outlet wise breakdown
        outlet_wise = sales.values('outlet__name').annotate(
            total_amount=Sum('total_amount'),
            order_count=Count('id')
        ).order_by('-total_amount')
        
        # Payment status breakdown
        payment_status = sales.values('payment_status').annotate(
            total_amount=Sum('total_amount'),
            count=Count('id')
        )
        
        # Customer type breakdown
        customer_type = sales.values('sale_type').annotate(
            total_amount=Sum('total_amount'),
            count=Count('id')
        )
        
        report_data = {
            'summary': summary,
            'outlet_wise': list(outlet_wise),
            'payment_status': list(payment_status),
            'customer_type': list(customer_type),
            'generated_at': timezone.now(),
            'parameters': {
                'start_date': start_date,
                'end_date': end_date,
                'outlet_id': outlet_id,
                'sale_type': sale_type
            }
        }
        
        return Response(report_data)

    @action(detail=False, methods=['post'])
    def generate_inventory_report(self, request):
        """Generate inventory report"""
        from inventory.models import Stock, Product
        
        outlet_id = request.data.get('outlet_id')
        product_type = request.data.get('product_type')
        low_stock_only = request.data.get('low_stock_only', False)
        
        # Base query
        stock = Stock.objects.select_related('product', 'outlet')
        
        if outlet_id:
            stock = stock.filter(outlet_id=outlet_id)
        if product_type:
            stock = stock.filter(product__product_type=product_type)
        
        # Stock summary
        stock_summary = stock.aggregate(
            total_items=Count('id'),
            total_quantity=Sum('quantity'),
            total_value=Sum('quantity') * Sum('unit_cost')  # Simplified calculation
        )
        
        # Product wise stock
        product_stock = stock.values(
            'product__name', 'product__product_code', 'outlet__name'
        ).annotate(
            total_quantity=Sum('quantity'),
            available_quantity=Sum('available_quantity'),
            reserved_quantity=Sum('reserved_quantity')
        )
        
        # Low stock alerts if requested
        low_stock_items = []
        if low_stock_only:
            for item in stock:
                if item.available_quantity <= item.product.reorder_point:
                    low_stock_items.append({
                        'product_name': item.product.name,
                        'current_stock': item.available_quantity,
                        'reorder_point': item.product.reorder_point,
                        'outlet': item.outlet.name
                    })
        
        # Expiry alerts (items expiring in next 90 days)
        expiry_date = timezone.now().date() + timedelta(days=90)
        expiring_items = stock.filter(
            expiry_date__lte=expiry_date,
            expiry_date__gte=timezone.now().date()
        ).values(
            'product__name', 'batch_number', 'expiry_date', 'quantity', 'outlet__name'
        )
        
        report_data = {
            'summary': stock_summary,
            'product_stock': list(product_stock),
            'low_stock_items': low_stock_items,
            'expiring_items': list(expiring_items),
            'generated_at': timezone.now(),
            'parameters': {
                'outlet_id': outlet_id,
                'product_type': product_type,
                'low_stock_only': low_stock_only
            }
        }
        
        return Response(report_data)

    @action(detail=False, methods=['post'])
    def generate_production_report(self, request):
        """Generate production report"""
        from production.models import ProductionBatch, ProductionOrder
        
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        status = request.data.get('status')
        
        # Production batches
        batches = ProductionBatch.objects.all()
        
        if start_date:
            batches = batches.filter(production_date__date__gte=start_date)
        if end_date:
            batches = batches.filter(production_date__date__lte=end_date)
        if status:
            batches = batches.filter(status=status)
        
        # Production summary
        production_summary = batches.aggregate(
            total_batches=Count('id'),
            total_planned_quantity=Sum('planned_quantity'),
            total_actual_quantity=Sum('actual_quantity'),
            total_wastage=Sum('wastage_quantity'),
            total_cost=Sum('total_cost'),
            completed_batches=Count('id', filter=Q(status='COMPLETED'))
        )
        
        # Calculate efficiency
        if production_summary['total_planned_quantity']:
            efficiency = (production_summary['total_actual_quantity'] / 
                         production_summary['total_planned_quantity']) * 100
        else:
            efficiency = 0
        
        production_summary['efficiency_percentage'] = round(efficiency, 2)
        
        # Product wise production
        product_production = batches.values(
            'formula__finished_product__name'
        ).annotate(
            batch_count=Count('id'),
            total_quantity=Sum('actual_quantity'),
            total_cost=Sum('total_cost'),
            avg_cost_per_unit=Avg('cost_per_unit')
        ).order_by('-total_quantity')
        
        # Status wise breakdown
        status_breakdown = batches.values('status').annotate(
            count=Count('id'),
            total_quantity=Sum('actual_quantity')
        )
        
        report_data = {
            'summary': production_summary,
            'product_wise': list(product_production),
            'status_breakdown': list(status_breakdown),
            'generated_at': timezone.now(),
            'parameters': {
                'start_date': start_date,
                'end_date': end_date,
                'status': status
            }
        }
        
        return Response(report_data)

    @action(detail=False, methods=['post'])
    def generate_financial_report(self, request):
        """Generate financial report"""
        from sales.models import Sale
        from finance.models import Expense, CashFlow
        
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        outlet_id = request.data.get('outlet_id')
        
        # Sales revenue
        sales = Sale.objects.all()
        if start_date:
            sales = sales.filter(sale_date__date__gte=start_date)
        if end_date:
            sales = sales.filter(sale_date__date__lte=end_date)
        if outlet_id:
            sales = sales.filter(outlet_id=outlet_id)
        
        revenue_summary = sales.aggregate(
            total_revenue=Sum('total_amount'),
            total_orders=Count('id'),
            paid_amount=Sum('paid_amount'),
            due_amount=Sum('due_amount')
        )
        
        # Expenses
        expenses = Expense.objects.filter(is_approved=True)
        if start_date:
            expenses = expenses.filter(expense_date__gte=start_date)
        if end_date:
            expenses = expenses.filter(expense_date__lte=end_date)
        if outlet_id:
            expenses = expenses.filter(outlet_id=outlet_id)
        
        expense_summary = expenses.aggregate(
            total_expenses=Sum('amount'),
            total_count=Count('id')
        )
        
        # Category wise expenses
        category_expenses = expenses.values('category__name').annotate(
            total=Sum('amount'),
            count=Count('id')
        ).order_by('-total')
        
        # Calculate profit/loss
        total_revenue = revenue_summary['total_revenue'] or 0
        total_expenses = expense_summary['total_expenses'] or 0
        profit_loss = total_revenue - total_expenses
        
        # Cash flow summary
        cash_flows = CashFlow.objects.all()
        if start_date:
            cash_flows = cash_flows.filter(transaction_date__date__gte=start_date)
        if end_date:
            cash_flows = cash_flows.filter(transaction_date__date__lte=end_date)
        if outlet_id:
            cash_flows = cash_flows.filter(outlet_id=outlet_id)
        
        cash_summary = cash_flows.aggregate(
            total_inflow=Sum('amount', filter=Q(flow_type='INFLOW')),
            total_outflow=Sum('amount', filter=Q(flow_type='OUTFLOW'))
        )
        
        net_cash_flow = (cash_summary['total_inflow'] or 0) - (cash_summary['total_outflow'] or 0)
        
        report_data = {
            'revenue': revenue_summary,
            'expenses': expense_summary,
            'category_expenses': list(category_expenses),
            'profit_loss': profit_loss,
            'cash_flow': {
                'inflow': cash_summary['total_inflow'] or 0,
                'outflow': cash_summary['total_outflow'] or 0,
                'net_flow': net_cash_flow
            },
            'generated_at': timezone.now(),
            'parameters': {
                'start_date': start_date,
                'end_date': end_date,
                'outlet_id': outlet_id
            }
        }
        
        return Response(report_data)

    @action(detail=False, methods=['get'])
    def dashboard_summary(self, request):
        """Generate dashboard summary data"""
        from sales.models import Sale
        from inventory.models import Stock, Product
        from customers.models import Customer
        from vendors.models import Vendor
        from hr.models import Employee
        
        today = timezone.now().date()
        start_of_month = today.replace(day=1)
        
        # Sales summary
        today_sales = Sale.objects.filter(sale_date__date=today).aggregate(
            total=Sum('total_amount'),
            count=Count('id')
        )
        
        month_sales = Sale.objects.filter(sale_date__date__gte=start_of_month).aggregate(
            total=Sum('total_amount'),
            count=Count('id')
        )
        
        # Inventory alerts
        low_stock_count = 0
        expiring_count = Stock.objects.filter(
            expiry_date__lte=today + timedelta(days=30),
            expiry_date__gte=today
        ).count()
        
        # For low stock, we need to check each product's reorder point
        products = Product.objects.filter(is_active=True)
        for product in products:
            total_stock = Stock.objects.filter(product=product, is_active=True).aggregate(
                total=Sum('available_quantity')
            )['total'] or 0
            
            if total_stock <= product.reorder_point:
                low_stock_count += 1
        
        # Customer and vendor counts
        customer_count = Customer.objects.filter(is_active=True).count()
        vendor_count = Vendor.objects.filter(is_active=True).count()
        employee_count = Employee.objects.filter(is_active=True).count()
        
        # Recent activities (simplified)
        recent_sales = Sale.objects.order_by('-created_at')[:5].values(
            'invoice_number', 'customer__name', 'total_amount', 'created_at'
        )
        
        dashboard_data = {
            'sales': {
                'today': today_sales,
                'this_month': month_sales
            },
            'inventory': {
                'low_stock_alerts': low_stock_count,
                'expiring_soon': expiring_count
            },
            'entities': {
                'customers': customer_count,
                'vendors': vendor_count,
                'employees': employee_count
            },
            'recent_activities': {
                'sales': list(recent_sales)
            },
            'generated_at': timezone.now()
        }
        
        return Response(dashboard_data)