from rest_framework import serializers
from .models import Customer, CustomerCategory, CustomerTransaction

class CustomerCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerCategory
        fields = '__all__'

class CustomerTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerTransaction
        fields = '__all__'

class CustomerSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    total_purchase = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    recent_transactions = CustomerTransactionSerializer(source='transactions', many=True, read_only=True)

    class Meta:
        model = Customer
        fields = '__all__'

    def create(self, validated_data):
        # Auto-generate customer code
        last_customer = Customer.objects.order_by('id').last()
        if last_customer:
            code_num = int(last_customer.customer_code.split('CUST')[1]) + 1
        else:
            code_num = 1001
        validated_data['customer_code'] = f'CUST{code_num:04d}'
        return super().create(validated_data)