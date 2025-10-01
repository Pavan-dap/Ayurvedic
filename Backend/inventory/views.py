from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from datetime import timedelta
from .models import (
    ProductCategory, Product, Stock, StockMovement,
    PurchaseOrder, PurchaseOrderItem, GoodsReceiptNote, GoodsReceiptItem
)
from .serializers import (
    ProductCategorySerializer, ProductSerializer, StockSerializer, StockMovementSerializer,
    PurchaseOrderSerializer, PurchaseOrderItemSerializer, 
    GoodsReceiptNoteSerializer, GoodsReceiptItemSerializer
)

class ProductCategoryViewSet(viewsets.ModelViewSet):
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_active']
    search_fields = ['name', 'hsn_code']

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().select_related('category', 'created_by')
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['product_type', 'category', 'is_active']
    search_fields = ['name', 'product_code', 'barcode']
    ordering_fields = ['created_at', 'name']

class StockViewSet(viewsets.ModelViewSet):
    queryset = Stock.objects.all().select_related('product', 'outlet')
    serializer_class = StockSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['product', 'outlet', 'is_active']
    search_fields = ['product__name', 'batch_number']
    ordering = ['product__name']

    @action(detail=False, methods=['get'])
    def low_stock_alerts(self, request):
        # Products with stock below reorder point
        low_stock_items = []
        products = Product.objects.filter(is_active=True)
        
        for product in products:
            total_stock = sum([
                stock.available_quantity for stock in 
                Stock.objects.filter(product=product, is_active=True)
            ])
            if total_stock <= product.reorder_point:
                low_stock_items.append({
                    'product': ProductSerializer(product).data,
                    'current_stock': total_stock,
                    'reorder_point': product.reorder_point
                })
        
        return Response(low_stock_items)

    @action(detail=False, methods=['get'])
    def expiry_alerts(self, request):
        # Items expiring within 3 months
        three_months_later = timezone.now().date() + timedelta(days=90)
        expiring_items = Stock.objects.filter(
            expiry_date__lte=three_months_later,
            expiry_date__gte=timezone.now().date(),
            is_active=True
        ).select_related('product', 'outlet')
        
        serializer = self.get_serializer(expiring_items, many=True)
        return Response(serializer.data)

class StockMovementViewSet(viewsets.ModelViewSet):
    queryset = StockMovement.objects.all().select_related('stock__product', 'created_by')
    serializer_class = StockMovementSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['movement_type', 'stock__product', 'stock__outlet']
    ordering = ['-created_at']

class PurchaseOrderViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrder.objects.all().prefetch_related('items')
    serializer_class = PurchaseOrderSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'vendor_name']
    search_fields = ['po_number', 'vendor_name']
    ordering = ['-created_at']

    @action(detail=True, methods=['post'])
    def confirm_order(self, request, pk=None):
        order = self.get_object()
        if order.status == 'DRAFT' or order.status == 'SENT':
            order.status = 'CONFIRMED'
            order.save()
            return Response({'message': 'Purchase order confirmed'})
        return Response({'error': 'Order cannot be confirmed'}, status=status.HTTP_400_BAD_REQUEST)

class PurchaseOrderItemViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrderItem.objects.all().select_related('purchase_order')
    serializer_class = PurchaseOrderItemSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['purchase_order']

class GoodsReceiptNoteViewSet(viewsets.ModelViewSet):
    queryset = GoodsReceiptNote.objects.all().select_related('purchase_order', 'received_by')
    serializer_class = GoodsReceiptNoteSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'purchase_order']
    search_fields = ['grn_number', 'invoice_number']
    ordering = ['-created_at']

    @action(detail=True, methods=['post'])
    def approve_receipt(self, request, pk=None):
        grn = self.get_object()
        if grn.status == 'PENDING':
            grn.status = 'APPROVED'
            grn.approved_by = request.user
            grn.save()
            
            # Update stock for approved items
            for item in grn.items.all():
                stock, created = Stock.objects.get_or_create(
                    product_id=item.po_item.product_name,  # This would need proper product linking
                    outlet_id=1,  # Default outlet - this should be configurable
                    batch_number=item.batch_number,
                    defaults={
                        'quantity': item.quantity_accepted,
                        'unit_cost': item.unit_cost,
                        'manufacturing_date': item.manufacturing_date,
                        'expiry_date': item.expiry_date,
                    }
                )
                
                if not created:
                    stock.quantity += item.quantity_accepted
                    stock.save()
            
            return Response({'message': 'GRN approved and stock updated'})
        return Response({'error': 'GRN cannot be approved'}, status=status.HTTP_400_BAD_REQUEST)

class GoodsReceiptItemViewSet(viewsets.ModelViewSet):
    queryset = GoodsReceiptItem.objects.all().select_related('grn', 'po_item')
    serializer_class = GoodsReceiptItemSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['grn']