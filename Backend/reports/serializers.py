from rest_framework import serializers
from .models import ReportTemplate, GeneratedReport

class ReportTemplateSerializer(serializers.ModelSerializer):
    report_type_display = serializers.CharField(source='get_report_type_display', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)

    class Meta:
        model = ReportTemplate
        fields = '__all__'

class GeneratedReportSerializer(serializers.ModelSerializer):
    template_name = serializers.CharField(source='template.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    export_format_display = serializers.CharField(source='get_export_format_display', read_only=True)
    generated_by_name = serializers.CharField(source='generated_by.get_full_name', read_only=True)

    class Meta:
        model = GeneratedReport
        fields = '__all__'