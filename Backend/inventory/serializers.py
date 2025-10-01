from rest_framework import serializers
from .models import (
    ProductCategory, Product, Stock, StockMovement, 
    PurchaseOrder, PurchaseOrderItem, GoodsReceiptNote, GoodsReceiptItem
)

class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    product_type_display = serializers.CharField(source='get_product_type_display', read_only=True)
    
    class Meta:
        model = Product
        fields = '__all__'

    def create(self, validated_data):
        # Auto-generate product code
        product_type = validated_data.get('product_type', 'FINISHED')
        prefix_map = {
            'RAW_MATERIAL': 'RM',
            'SEMI_FINISHED': 'SF',
            'FINISHED': 'FG',
            'PACKAGING': 'PK'
        }
        prefix = prefix_map.get(product_type, 'FG')
        
        last_product = Product.objects.filter(product_type=product_type).order_by('id').last()
        if last_product:
            try:
                code_num = int(last_product.product_code.split(prefix)[1]) + 1
            except:
                code_num = 1001
        else:
            code_num = 1001
            
        validated_data['product_code'] = f'{prefix}{code_num:04d}'
        return super().create(validated_data)

class StockSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    outlet_name = serializers.CharField(source='outlet.name', read_only=True)
    days_to_expiry = serializers.SerializerMethodField()

    class Meta:
        model = Stock
        fields = '__all__'

    def get_days_to_expiry(self, obj):
        if obj.expiry_date:
            from datetime import date
            return (obj.expiry_date - date.today()).days
        return None

class StockMovementSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='stock.product.name', read_only=True)
    movement_type_display = serializers.CharField(source='get_movement_type_display', read_only=True)

    class Meta:
        model = StockMovement
        fields = '__all__'

class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseOrderItem
        fields = '__all__'

class PurchaseOrderSerializer(serializers.ModelSerializer):
    items = PurchaseOrderItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = PurchaseOrder
        fields = '__all__'

    def create(self, validated_data):
        # Auto-generate PO number
        from datetime import datetime
        today = datetime.now().strftime('%Y%m%d')
        last_po = PurchaseOrder.objects.filter(
            po_number__startswith=f'PO{today}'
        ).order_by('id').last()
        
        if last_po:
            try:
                seq_num = int(last_po.po_number[-3:]) + 1
            except:
                seq_num = 1
        else:
            seq_num = 1
            
        validated_data['po_number'] = f'PO{today}{seq_num:03d}'
        return super().create(validated_data)

class GoodsReceiptItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='po_item.product_name', read_only=True)

    class Meta:
        model = GoodsReceiptItem
        fields = '__all__'

class GoodsReceiptNoteSerializer(serializers.ModelSerializer):
    items = GoodsReceiptItemSerializer(many=True, read_only=True)
    po_number = serializers.CharField(source='purchase_order.po_number', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = GoodsReceiptNote
        fields = '__all__'

    def create(self, validated_data):
        # Auto-generate GRN number
        from datetime import datetime
        today = datetime.now().strftime('%Y%m%d')
        last_grn = GoodsReceiptNote.objects.filter(
            grn_number__startswith=f'GRN{today}'
        ).order_by('id').last()
        
        if last_grn:
            try:
                seq_num = int(last_grn.grn_number[-3:]) + 1
            except:
                seq_num = 1
        else:
            seq_num = 1
            
        validated_data['grn_number'] = f'GRN{today}{seq_num:03d}'
        return super().create(validated_data)