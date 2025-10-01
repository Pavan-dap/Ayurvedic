from django.contrib import admin
from .models import (
    ProductionFormula, FormulaIngredient, ProductionBatch,
    BatchIngredientConsumption, ProductionOrder, QualityCheck
)

@admin.register(ProductionFormula)
class ProductionFormulaAdmin(admin.ModelAdmin):
    list_display = ['finished_product', 'formula_name', 'version', 'batch_size', 'is_active']
    list_filter = ['is_active', 'finished_product__category']

@admin.register(ProductionBatch)
class ProductionBatchAdmin(admin.ModelAdmin):
    list_display = ['batch_number', 'formula', 'status', 'planned_quantity', 'actual_quantity', 'quality_approved']
    list_filter = ['status', 'quality_approved', 'production_date']
    search_fields = ['batch_number', 'formula__finished_product__name']

@admin.register(ProductionOrder)
class ProductionOrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'product', 'quantity_to_produce', 'priority', 'status', 'due_date']
    list_filter = ['status', 'priority', 'due_date']

@admin.register(QualityCheck)
class QualityCheckAdmin(admin.ModelAdmin):
    list_display = ['batch', 'check_date', 'overall_result', 'checked_by']
    list_filter = ['overall_result', 'check_date']