from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Vendor, VendorProduct, VendorPerformance
from .serializers import VendorSerializer, VendorProductSerializer, VendorPerformanceSerializer

class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all().prefetch_related('products', 'performance_records')
    serializer_class = VendorSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['vendor_type', 'is_active', 'city', 'state']
    search_fields = ['name', 'vendor_code', 'contact_person', 'phone']
    ordering_fields = ['created_at', 'name', 'performance_rating']

    @action(detail=True, methods=['get'])
    def products(self, request, pk=None):
        vendor = self.get_object()
        products = VendorProduct.objects.filter(vendor=vendor, is_active=True)
        serializer = VendorProductSerializer(products, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add_performance_rating(self, request, pk=None):
        vendor = self.get_object()
        serializer = VendorPerformanceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(vendor=vendor, evaluated_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VendorProductViewSet(viewsets.ModelViewSet):
    queryset = VendorProduct.objects.all().select_related('vendor')
    serializer_class = VendorProductSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['vendor', 'is_active']
    search_fields = ['product_name', 'product_code']

class VendorPerformanceViewSet(viewsets.ModelViewSet):
    queryset = VendorPerformance.objects.all().select_related('vendor', 'evaluated_by')
    serializer_class = VendorPerformanceSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['vendor', 'evaluation_date']
    ordering = ['-created_at']