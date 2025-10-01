from rest_framework import serializers
from .models import Outlet, StockTransfer, StockTransferItem, CashDenomination

class OutletSerializer(serializers.ModelSerializer):
    manager_name = serializers.CharField(source='manager.get_full_name', read_only=True)
    outlet_type_display = serializers.CharField(source='get_outlet_type_display', read_only=True)

    class Meta:
        model = Outlet
        fields = '__all__'

    def create(self, validated_data):
        # Auto-generate outlet code
        outlet_type = validated_data.get('outlet_type', 'RETAIL')
        prefix = 'MAIN' if outlet_type == 'MAIN' else 'OUT'
        
        last_outlet = Outlet.objects.filter(outlet_type=outlet_type).order_by('id').last()
        if last_outlet:
            try:
                code_num = int(last_outlet.outlet_code.split(prefix)[1]) + 1
            except:
                code_num = 1001
        else:
            code_num = 1001
            
        validated_data['outlet_code'] = f'{prefix}{code_num:04d}'
        return super().create(validated_data)

class StockTransferItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockTransferItem
        fields = '__all__'

class StockTransferSerializer(serializers.ModelSerializer):
    items = StockTransferItemSerializer(many=True, read_only=True)
    from_outlet_name = serializers.CharField(source='from_outlet.name', read_only=True)
    to_outlet_name = serializers.CharField(source='to_outlet.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = StockTransfer
        fields = '__all__'

    def create(self, validated_data):
        # Auto-generate transfer number
        from datetime import datetime
        today = datetime.now().strftime('%Y%m%d')
        last_transfer = StockTransfer.objects.filter(
            transfer_number__startswith=f'ST{today}'
        ).order_by('id').last()
        
        if last_transfer:
            try:
                seq_num = int(last_transfer.transfer_number[-3:]) + 1
            except:
                seq_num = 1
        else:
            seq_num = 1
            
        validated_data['transfer_number'] = f'ST{today}{seq_num:03d}'
        return super().create(validated_data)

class CashDenominationSerializer(serializers.ModelSerializer):
    outlet_name = serializers.CharField(source='outlet.name', read_only=True)

    class Meta:
        model = CashDenomination
        fields = '__all__'