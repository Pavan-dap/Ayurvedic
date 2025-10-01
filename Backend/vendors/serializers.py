from rest_framework import serializers
from .models import Vendor, VendorProduct, VendorPerformance

class VendorProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorProduct
        fields = '__all__'

class VendorPerformanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorPerformance
        fields = '__all__'

class VendorSerializer(serializers.ModelSerializer):
    products = VendorProductSerializer(many=True, read_only=True)
    performance_records = VendorPerformanceSerializer(many=True, read_only=True)
    vendor_type_display = serializers.CharField(source='get_vendor_type_display', read_only=True)

    class Meta:
        model = Vendor
        fields = '__all__'

    def create(self, validated_data):
        # Auto-generate vendor code
        last_vendor = Vendor.objects.order_by('id').last()
        if last_vendor:
            code_num = int(last_vendor.vendor_code.split('VEND')[1]) + 1
        else:
            code_num = 1001
        validated_data['vendor_code'] = f'VEND{code_num:04d}'
        return super().create(validated_data)