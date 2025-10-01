from django.contrib import admin
from .models import SavedDashboard, DashboardWidget

@admin.register(SavedDashboard)
class SavedDashboardAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_default', 'created_by', 'created_at']
    list_filter = ['is_default', 'created_at']
    search_fields = ['name', 'description']

@admin.register(DashboardWidget)
class DashboardWidgetAdmin(admin.ModelAdmin):
    list_display = ['name', 'dashboard', 'type', 'data_source', 'created_at']
    list_filter = ['type', 'data_source', 'created_at']
    search_fields = ['name', 'dashboard__name']