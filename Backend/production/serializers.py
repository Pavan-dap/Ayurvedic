from rest_framework import serializers
from .models import (
    ProductionFormula, FormulaIngredient, ProductionBatch, 
    BatchIngredientConsumption, ProductionOrder, QualityCheck
)

class FormulaIngredientSerializer(serializers.ModelSerializer):
    ingredient_name = serializers.CharField(source='ingredient.name', read_only=True)
    
    class Meta:
        model = FormulaIngredient
        fields = '__all__'

class ProductionFormulaSerializer(serializers.ModelSerializer):
    ingredients = FormulaIngredientSerializer(many=True, read_only=True)
    finished_product_name = serializers.CharField(source='finished_product.name', read_only=True)
    
    class Meta:
        model = ProductionFormula
        fields = '__all__'

class BatchIngredientConsumptionSerializer(serializers.ModelSerializer):
    ingredient_name = serializers.CharField(source='ingredient.name', read_only=True)
    
    class Meta:
        model = BatchIngredientConsumption
        fields = '__all__'

class ProductionBatchSerializer(serializers.ModelSerializer):
    ingredient_consumption = BatchIngredientConsumptionSerializer(many=True, read_only=True)
    formula_name = serializers.CharField(source='formula.formula_name', read_only=True)
    product_name = serializers.CharField(source='formula.finished_product.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = ProductionBatch
        fields = '__all__'

    def create(self, validated_data):
        # Auto-generate batch number
        from datetime import datetime
        today = datetime.now().strftime('%Y%m%d')
        last_batch = ProductionBatch.objects.filter(
            batch_number__startswith=f'PB{today}'
        ).order_by('id').last()
        
        if last_batch:
            try:
                seq_num = int(last_batch.batch_number[-3:]) + 1
            except:
                seq_num = 1
        else:
            seq_num = 1
            
        validated_data['batch_number'] = f'PB{today}{seq_num:03d}'
        return super().create(validated_data)

class ProductionOrderSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    
    class Meta:
        model = ProductionOrder
        fields = '__all__'

    def create(self, validated_data):
        # Auto-generate order number
        from datetime import datetime
        today = datetime.now().strftime('%Y%m%d')
        last_order = ProductionOrder.objects.filter(
            order_number__startswith=f'PO{today}'
        ).order_by('id').last()
        
        if last_order:
            try:
                seq_num = int(last_order.order_number[-3:]) + 1
            except:
                seq_num = 1
        else:
            seq_num = 1
            
        validated_data['order_number'] = f'PO{today}{seq_num:03d}'
        return super().create(validated_data)

class QualityCheckSerializer(serializers.ModelSerializer):
    batch_number = serializers.CharField(source='batch.batch_number', read_only=True)
    product_name = serializers.CharField(source='batch.formula.finished_product.name', read_only=True)
    
    class Meta:
        model = QualityCheck
        fields = '__all__'