from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import timedelta
from .models import Sale, SaleItem, Payment, SplitPayment, Discount, SalesTarget
from .serializers import (
    SaleSerializer, SaleItemSerializer, PaymentSerializer, 
    SplitPaymentSerializer, DiscountSerializer, SalesTargetSerializer
)

class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all().select_related('customer', 'outlet', 'created_by')
    serializer_class = SaleSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['sale_type', 'payment_status', 'outlet', 'customer']
    search_fields = ['invoice_number', 'customer__name']
    ordering = ['-sale_date']

    @action(detail=False, methods=['get'])
    def sales_summary(self, request):
        today = timezone.now().date()
        start_of_month = today.replace(day=1)
        
        # Today's sales
        today_sales = Sale.objects.filter(sale_date__date=today).aggregate(
            total_amount=Sum('total_amount'),
            count=Count('id')
        )
        
        # This month's sales
        month_sales = Sale.objects.filter(sale_date__date__gte=start_of_month).aggregate(
            total_amount=Sum('total_amount'),
            count=Count('id')
        )
        
        # Payment status summary
        payment_summary = Sale.objects.values('payment_status').annotate(
            total=Sum('total_amount'),
            count=Count('id')
        )
        
        return Response({
            'today': {
                'total_amount': today_sales['total_amount'] or 0,
                'count': today_sales['count']
            },
            'this_month': {
                'total_amount': month_sales['total_amount'] or 0,
                'count': month_sales['count']
            },
            'payment_status': payment_summary
        })

    @action(detail=False, methods=['get'])
    def outlet_wise_sales(self, request):
        outlet_sales = Sale.objects.values('outlet__name').annotate(
            total_amount=Sum('total_amount'),
            count=Count('id')
        ).order_by('-total_amount')
        
        return Response(outlet_sales)

    @action(detail=True, methods=['post'])
    def add_payment(self, request, pk=None):
        sale = self.get_object()
        payment_data = request.data.copy()
        payment_data['sale'] = sale.id
        
        serializer = PaymentSerializer(data=payment_data)
        if serializer.is_valid():
            payment = serializer.save()
            
            # Update sale's paid amount
            sale.paid_amount += payment.amount
            sale.save()
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SaleItemViewSet(viewsets.ModelViewSet):
    queryset = SaleItem.objects.all().select_related('sale', 'product', 'stock')
    serializer_class = SaleItemSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['sale', 'product']

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all().select_related('sale', 'created_by')
    serializer_class = PaymentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['payment_method', 'sale']
    ordering = ['-payment_date']

    @action(detail=False, methods=['get'])
    def payment_methods_summary(self, request):
        today = timezone.now().date()
        
        payment_summary = Payment.objects.filter(
            payment_date__date=today
        ).values('payment_method').annotate(
            total=Sum('amount'),
            count=Count('id')
        )
        
        return Response(payment_summary)

class SplitPaymentViewSet(viewsets.ModelViewSet):
    queryset = SplitPayment.objects.all().select_related('sale')
    serializer_class = SplitPaymentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['sale', 'payment_method']

class DiscountViewSet(viewsets.ModelViewSet):
    queryset = Discount.objects.all()
    serializer_class = DiscountSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['discount_type', 'is_active']
    search_fields = ['name']

    @action(detail=False, methods=['get'])
    def active_discounts(self, request):
        now = timezone.now()
        active_discounts = Discount.objects.filter(
            is_active=True,
            valid_from__lte=now,
            valid_until__gte=now
        )
        serializer = self.get_serializer(active_discounts, many=True)
        return Response(serializer.data)

class SalesTargetViewSet(viewsets.ModelViewSet):
    queryset = SalesTarget.objects.all().select_related('outlet', 'salesperson')
    serializer_class = SalesTargetSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['outlet', 'salesperson', 'period_type', 'is_active']
    ordering = ['-start_date']

    @action(detail=False, methods=['get'])
    def target_performance(self, request):
        active_targets = SalesTarget.objects.filter(
            is_active=True,
            start_date__lte=timezone.now().date(),
            end_date__gte=timezone.now().date()
        )
        
        performance_data = []
        for target in active_targets:
            # Calculate actual sales in the target period
            actual_sales = Sale.objects.filter(
                outlet=target.outlet,
                sale_date__date__gte=target.start_date,
                sale_date__date__lte=target.end_date
            ).aggregate(total=Sum('total_amount'))['total'] or 0
            
            target.achieved_amount = actual_sales
            target.save()
            
            performance_data.append({
                'target': SalesTargetSerializer(target).data,
                'achievement_percentage': target.achievement_percentage
            })
        
        return Response(performance_data)