from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import (
    ProductionFormula, FormulaIngredient, ProductionBatch,
    BatchIngredientConsumption, ProductionOrder, QualityCheck
)
from .serializers import (
    ProductionFormulaSerializer, FormulaIngredientSerializer, ProductionBatchSerializer,
    BatchIngredientConsumptionSerializer, ProductionOrderSerializer, QualityCheckSerializer
)

class ProductionFormulaViewSet(viewsets.ModelViewSet):
    queryset = ProductionFormula.objects.all().select_related('finished_product', 'created_by')
    serializer_class = ProductionFormulaSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['finished_product', 'is_active']
    search_fields = ['formula_name', 'finished_product__name']
    ordering = ['-created_at']

class FormulaIngredientViewSet(viewsets.ModelViewSet):
    queryset = FormulaIngredient.objects.all().select_related('formula', 'ingredient')
    serializer_class = FormulaIngredientSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['formula', 'ingredient', 'is_critical']

class ProductionBatchViewSet(viewsets.ModelViewSet):
    queryset = ProductionBatch.objects.all().select_related('formula', 'created_by')
    serializer_class = ProductionBatchSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'formula', 'production_date', 'quality_approved']
    search_fields = ['batch_number', 'formula__finished_product__name']
    ordering = ['-production_date']

    @action(detail=True, methods=['post'])
    def start_production(self, request, pk=None):
        batch = self.get_object()
        if batch.status == 'PLANNED':
            batch.status = 'IN_PROGRESS'
            batch.save()
            return Response({'message': 'Production started'})
        return Response({'error': 'Batch cannot be started'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def complete_production(self, request, pk=None):
        batch = self.get_object()
        if batch.status == 'IN_PROGRESS':
            actual_quantity = request.data.get('actual_quantity')
            wastage_quantity = request.data.get('wastage_quantity', 0)
            
            if actual_quantity:
                batch.actual_quantity = actual_quantity
                batch.wastage_quantity = wastage_quantity
                batch.status = 'QUALITY_CHECK'
                batch.save()
                
                return Response({'message': 'Production completed, ready for quality check'})
            return Response({'error': 'Actual quantity is required'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Invalid batch status'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def approve_quality(self, request, pk=None):
        batch = self.get_object()
        if batch.status == 'QUALITY_CHECK':
            batch.quality_approved = True
            batch.status = 'COMPLETED'
            from django.utils import timezone
            batch.completion_date = timezone.now()
            batch.save()
            
            # Here you would update inventory with the produced goods
            
            return Response({'message': 'Quality approved and batch completed'})
        return Response({'error': 'Batch is not in quality check'}, status=status.HTTP_400_BAD_REQUEST)

class BatchIngredientConsumptionViewSet(viewsets.ModelViewSet):
    queryset = BatchIngredientConsumption.objects.all().select_related('batch', 'ingredient')
    serializer_class = BatchIngredientConsumptionSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['batch', 'ingredient']

class ProductionOrderViewSet(viewsets.ModelViewSet):
    queryset = ProductionOrder.objects.all().select_related('product', 'created_by', 'approved_by')
    serializer_class = ProductionOrderSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'priority', 'product']
    search_fields = ['order_number', 'product__name']
    ordering = ['due_date', '-priority']

    @action(detail=True, methods=['post'])
    def approve_order(self, request, pk=None):
        order = self.get_object()
        if order.status == 'DRAFT':
            order.status = 'APPROVED'
            order.approved_by = request.user
            order.save()
            return Response({'message': 'Production order approved'})
        return Response({'error': 'Order cannot be approved'}, status=status.HTTP_400_BAD_REQUEST)

class QualityCheckViewSet(viewsets.ModelViewSet):
    queryset = QualityCheck.objects.all().select_related('batch', 'checked_by')
    serializer_class = QualityCheckSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['batch', 'overall_result', 'check_date']
    ordering = ['-check_date']