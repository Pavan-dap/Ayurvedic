from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Customer, CustomerCategory, CustomerTransaction
from .serializers import CustomerSerializer, CustomerCategorySerializer, CustomerTransactionSerializer

class CustomerCategoryViewSet(viewsets.ModelViewSet):
    queryset = CustomerCategory.objects.all()
    serializer_class = CustomerCategorySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['name']
    search_fields = ['name']

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all().select_related('category', 'created_by')
    serializer_class = CustomerSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['customer_type', 'category', 'is_active', 'city', 'state']
    search_fields = ['name', 'customer_code', 'phone', 'email']
    ordering_fields = ['created_at', 'name']

    @action(detail=True, methods=['get'])
    def purchase_history(self, request, pk=None):
        customer = self.get_object()
        transactions = CustomerTransaction.objects.filter(
            customer=customer,
            transaction_type='SALE'
        ).order_by('-created_at')
        serializer = CustomerTransactionSerializer(transactions, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add_loyalty_points(self, request, pk=None):
        customer = self.get_object()
        points = request.data.get('points', 0)
        customer.loyalty_points += int(points)
        customer.save()
        
        CustomerTransaction.objects.create(
            customer=customer,
            transaction_type='LOYALTY_EARNED',
            amount=0,
            loyalty_points=points,
            description=f'Loyalty points added: {points}'
        )
        
        return Response({'message': f'Added {points} loyalty points'})

class CustomerTransactionViewSet(viewsets.ModelViewSet):
    queryset = CustomerTransaction.objects.all().select_related('customer')
    serializer_class = CustomerTransactionSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['customer', 'transaction_type']
    ordering = ['-created_at']