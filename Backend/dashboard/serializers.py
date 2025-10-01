from rest_framework import serializers
from .models import SavedDashboard, DashboardWidget

class DashboardWidgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = DashboardWidget
        fields = '__all__'

class SavedDashboardSerializer(serializers.ModelSerializer):
    widgets = DashboardWidgetSerializer(many=True, read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)

    class Meta:
        model = SavedDashboard
        fields = '__all__'