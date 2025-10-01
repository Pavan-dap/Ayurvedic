from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Outlet, StockTransfer, StockTransferItem, CashDenomination
from .serializers import OutletSerializer, StockTransferSerializer, StockTransferItemSerializer, CashDenominationSerializer

class OutletViewSet(viewsets.ModelViewSet):
    queryset = Outlet.objects.all().select_related('manager')
    serializer_class = OutletSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['outlet_type', 'is_active', 'city', 'state']
    search_fields = ['name', 'outlet_code', 'city']
    ordering_fields = ['created_at', 'name']

    @action(detail=True, methods=['get'])
    def stock_summary(self, request, pk=None):
        outlet = self.get_object()
        # This would integrate with inventory module
        return Response({'message': 'Stock summary endpoint - integrate with inventory'})

class StockTransferViewSet(viewsets.ModelViewSet):
    queryset = StockTransfer.objects.all().select_related('from_outlet', 'to_outlet', 'created_by')
    serializer_class = StockTransferSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['from_outlet', 'to_outlet', 'status']
    search_fields = ['transfer_number']
    ordering = ['-created_at']

    @action(detail=True, methods=['post'])
    def approve_transfer(self, request, pk=None):
        transfer = self.get_object()
        if transfer.status == 'PENDING':
            transfer.status = 'APPROVED'
            transfer.approved_by = request.user
            transfer.save()
            return Response({'message': 'Transfer approved successfully'})
        return Response({'error': 'Transfer cannot be approved'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def mark_in_transit(self, request, pk=None):
        transfer = self.get_object()
        if transfer.status == 'APPROVED':
            transfer.status = 'IN_TRANSIT'
            transfer.save()
            return Response({'message': 'Transfer marked as in transit'})
        return Response({'error': 'Transfer must be approved first'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def receive_transfer(self, request, pk=None):
        transfer = self.get_object()
        if transfer.status == 'IN_TRANSIT':
            transfer.status = 'RECEIVED'
            transfer.save()
            # Here you would update inventory levels
            return Response({'message': 'Transfer received successfully'})
        return Response({'error': 'Transfer must be in transit'}, status=status.HTTP_400_BAD_REQUEST)

class StockTransferItemViewSet(viewsets.ModelViewSet):
    queryset = StockTransferItem.objects.all().select_related('transfer')
    serializer_class = StockTransferItemSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['transfer']

class CashDenominationViewSet(viewsets.ModelViewSet):
    queryset = CashDenomination.objects.all().select_related('outlet', 'created_by')
    serializer_class = CashDenominationSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['outlet', 'date']
    ordering = ['-date']

    @action(detail=False, methods=['get'])
    def daily_summary(self, request):
        from django.utils import timezone
        today = timezone.now().date()
        
        denominations = CashDenomination.objects.filter(date=today).select_related('outlet')
        serializer = self.get_serializer(denominations, many=True)
        
        total_cash = sum([d.total_cash for d in denominations])
        
        return Response({
            'date': today,
            'outlets': serializer.data,
            'total_cash': total_cash
        })