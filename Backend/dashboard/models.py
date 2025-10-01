from django.db import models
from django.contrib.auth.models import User

class SavedDashboard(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    is_default = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class DashboardWidget(models.Model):
    WIDGET_TYPES = [
        ('chart', 'Chart'),
        ('table', 'Table'),
        ('metric', 'Metric Card'),
        ('alert', 'Alert Widget'),
    ]

    CHART_TYPES = [
        ('bar', 'Bar Chart'),
        ('line', 'Line Chart'),
        ('pie', 'Pie Chart'),
        ('doughnut', 'Doughnut Chart'),
    ]

    dashboard = models.ForeignKey(SavedDashboard, on_delete=models.CASCADE, related_name='widgets')
    name = models.CharField(max_length=200)
    type = models.CharField(max_length=20, choices=WIDGET_TYPES)
    chart_type = models.CharField(max_length=20, choices=CHART_TYPES, blank=True, null=True)
    data_source = models.CharField(max_length=50)
    filters = models.JSONField(default=dict)
    position_x = models.IntegerField(default=0)
    position_y = models.IntegerField(default=0)
    width = models.IntegerField(default=6)
    height = models.IntegerField(default=4)
    config = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.dashboard.name} - {self.name}"