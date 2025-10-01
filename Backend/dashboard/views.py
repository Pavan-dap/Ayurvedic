from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import SavedDashboard, DashboardWidget
from .serializers import SavedDashboardSerializer, DashboardWidgetSerializer

class SavedDashboardViewSet(viewsets.ModelViewSet):
    queryset = SavedDashboard.objects.all().select_related('created_by').prefetch_related('widgets')
    serializer_class = SavedDashboardSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_default', 'created_by']
    search_fields = ['name', 'description']
    ordering = ['-created_at']

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'])
    def set_default(self, request, pk=None):
        dashboard = self.get_object()
        
        # Remove default from all other dashboards for this user
        SavedDashboard.objects.filter(
            created_by=request.user,
            is_default=True
        ).update(is_default=False)
        
        # Set this dashboard as default
        dashboard.is_default = True
        dashboard.save()
        
        return Response({'message': 'Dashboard set as default'})

    @action(detail=True, methods=['post'])
    def clone_dashboard(self, request, pk=None):
        original = self.get_object()
        
        # Create a copy
        cloned = SavedDashboard.objects.create(
            name=f"{original.name} (Copy)",
            description=original.description,
            created_by=request.user
        )
        
        # Copy all widgets
        for widget in original.widgets.all():
            DashboardWidget.objects.create(
                dashboard=cloned,
                name=widget.name,
                type=widget.type,
                chart_type=widget.chart_type,
                data_source=widget.data_source,
                filters=widget.filters,
                position_x=widget.position_x,
                position_y=widget.position_y,
                width=widget.width,
                height=widget.height,
                config=widget.config
            )
        
        serializer = self.get_serializer(cloned)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class DashboardWidgetViewSet(viewsets.ModelViewSet):
    queryset = DashboardWidget.objects.all().select_related('dashboard')
    serializer_class = DashboardWidgetSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['dashboard', 'type', 'data_source']
    ordering = ['position_y', 'position_x']

    @action(detail=False, methods=['get'])
    def widget_data(self, request):
        """Get actual data for widgets based on their configuration"""
        widget_id = request.query_params.get('widget_id')
        
        if not widget_id:
            return Response({'error': 'widget_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            widget = DashboardWidget.objects.get(id=widget_id)
        except DashboardWidget.DoesNotExist:
            return Response({'error': 'Widget not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Generate mock data based on widget configuration
        data = self.generate_widget_data(widget)
        
        return Response(data)

    def generate_widget_data(self, widget):
        """Generate sample data for different widget types"""
        if widget.data_source == 'sales':
            if widget.type == 'chart':
                return {
                    'labels': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    'datasets': [{
                        'label': 'Sales',
                        'data': [12000, 15000, 18000, 14000, 22000, 25000, 20000],
                        'backgroundColor': 'rgba(16, 122, 87, 0.8)'
                    }]
                }
            elif widget.type == 'table':
                return {
                    'headers': ['Product', 'Sales', 'Growth'],
                    'rows': [
                        ['Brahmi Hair Oil', '₹25,000', '+12%'],
                        ['Triphala Churna', '₹18,500', '+8%'],
                        ['Neem Face Cream', '₹15,200', '-3%']
                    ]
                }
            elif widget.type == 'metric':
                return {
                    'value': '₹2,45,670',
                    'change': '+15.3%',
                    'trend': 'up'
                }
        
        elif widget.data_source == 'inventory':
            if widget.type == 'alert':
                return {
                    'alerts': [
                        {'type': 'low_stock', 'count': 8, 'message': 'products need restocking'},
                        {'type': 'expiry', 'count': 3, 'message': 'items expire within 30 days'}
                    ]
                }
        
        return {'message': 'No data available'}