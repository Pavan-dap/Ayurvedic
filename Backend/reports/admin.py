from django.contrib import admin
from .models import ReportTemplate, GeneratedReport

@admin.register(ReportTemplate)
class ReportTemplateAdmin(admin.ModelAdmin):
    list_display = ['name', 'report_type', 'is_active', 'created_by', 'created_at']
    list_filter = ['report_type', 'is_active']
    search_fields = ['name', 'description']

@admin.register(GeneratedReport)
class GeneratedReportAdmin(admin.ModelAdmin):
    list_display = ['name', 'template', 'status', 'export_format', 'generated_by', 'generated_at']
    list_filter = ['status', 'export_format', 'generated_at']