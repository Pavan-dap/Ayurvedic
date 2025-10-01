from django.db import models
from django.contrib.auth.models import User

class ReportTemplate(models.Model):
    REPORT_TYPES = [
        ('SALES', 'Sales Report'),
        ('INVENTORY', 'Inventory Report'),
        ('PRODUCTION', 'Production Report'),
        ('FINANCIAL', 'Financial Report'),
        ('HR', 'HR Report'),
        ('CUSTOMER', 'Customer Report'),
        ('VENDOR', 'Vendor Report'),
    ]

    name = models.CharField(max_length=200)
    report_type = models.CharField(max_length=20, choices=REPORT_TYPES)
    description = models.TextField(blank=True, null=True)
    query_template = models.TextField(help_text='SQL query template for the report')
    parameters = models.JSONField(default=dict, help_text='Report parameters configuration')
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.report_type}"

class GeneratedReport(models.Model):
    REPORT_STATUS = [
        ('GENERATING', 'Generating'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
    ]

    EXPORT_FORMATS = [
        ('PDF', 'PDF'),
        ('EXCEL', 'Excel'),
        ('CSV', 'CSV'),
    ]

    template = models.ForeignKey(ReportTemplate, on_delete=models.CASCADE, related_name='generated_reports')
    name = models.CharField(max_length=200)
    parameters_used = models.JSONField(default=dict)
    status = models.CharField(max_length=15, choices=REPORT_STATUS, default='GENERATING')
    export_format = models.CharField(max_length=10, choices=EXPORT_FORMATS, default='PDF')
    file_path = models.CharField(max_length=500, blank=True, null=True)
    file_size = models.BigIntegerField(default=0)
    
    # Metadata
    total_records = models.IntegerField(default=0)
    generation_time = models.FloatField(default=0.0, help_text='Time taken to generate report in seconds')
    error_message = models.TextField(blank=True, null=True)
    
    generated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    generated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.status}"