from rest_framework import serializers
from .models import Sale, SaleItem, Payment, SplitPayment, Discount, SalesTarget

class SaleItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = SaleItem
        fields = '__all__'

class SplitPaymentSerializer(serializers.ModelSerializer):
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)
    
    class Meta:
        model = SplitPayment
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)
    
    class Meta:
        model = Payment
        fields = '__all__'

    def create(self, validated_data):
        # Auto-generate payment number
        from datetime import datetime
        today = datetime.now().strftime('%Y%m%d')
        last_payment = Payment.objects.filter(
            payment_number__startswith=f'PAY{today}'
        ).order_by('id').last()
        
        if last_payment:
            try:
                seq_num = int(last_payment.payment_number[-3:]) + 1
            except:
                seq_num = 1
        else:
            seq_num = 1
            
        validated_data['payment_number'] = f'PAY{today}{seq_num:03d}'
        return super().create(validated_data)

class SaleSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(many=True, read_only=True)
    payments = PaymentSerializer(many=True, read_only=True)
    split_payments = SplitPaymentSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    outlet_name = serializers.CharField(source='outlet.name', read_only=True)
    sale_type_display = serializers.CharField(source='get_sale_type_display', read_only=True)
    payment_status_display = serializers.CharField(source='get_payment_status_display', read_only=True)

    class Meta:
        model = Sale
        fields = '__all__'

    def create(self, validated_data):
        # Auto-generate invoice number
        from datetime import datetime
        today = datetime.now().strftime('%Y%m%d')
        last_sale = Sale.objects.filter(
            invoice_number__startswith=f'INV{today}'
        ).order_by('id').last()
        
        if last_sale:
            try:
                seq_num = int(last_sale.invoice_number[-4:]) + 1
            except:
                seq_num = 1
        else:
            seq_num = 1
            
        validated_data['invoice_number'] = f'INV{today}{seq_num:04d}'
        return super().create(validated_data)

class DiscountSerializer(serializers.ModelSerializer):
    discount_type_display = serializers.CharField(source='get_discount_type_display', read_only=True)
    
    class Meta:
        model = Discount
        fields = '__all__'

class SalesTargetSerializer(serializers.ModelSerializer):
    outlet_name = serializers.CharField(source='outlet.name', read_only=True)
    salesperson_name = serializers.CharField(source='salesperson.get_full_name', read_only=True)
    period_type_display = serializers.CharField(source='get_period_type_display', read_only=True)
    
    class Meta:
        model = SalesTarget
        fields = '__all__'