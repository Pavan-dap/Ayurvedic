from django.db import models
from django.contrib.auth.models import User
from inventory.models import Product

class ProductionFormula(models.Model):
    finished_product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='formulas')
    formula_name = models.CharField(max_length=200)
    version = models.CharField(max_length=20, default='1.0')
    batch_size = models.DecimalField(max_digits=10, decimal_places=3, help_text='Standard batch size')
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.finished_product.name} - {self.formula_name} v{self.version}"

class FormulaIngredient(models.Model):
    formula = models.ForeignKey(ProductionFormula, on_delete=models.CASCADE, related_name='ingredients')
    ingredient = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity_required = models.DecimalField(max_digits=10, decimal_places=3)
    unit_of_measure = models.CharField(max_length=20)
    cost_per_unit = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    percentage = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    is_critical = models.BooleanField(default=False)  # Critical ingredients that cannot be substituted

    def __str__(self):
        return f"{self.formula.finished_product.name} - {self.ingredient.name}"

class ProductionBatch(models.Model):
    BATCH_STATUS = [
        ('PLANNED', 'Planned'),
        ('IN_PROGRESS', 'In Progress'),
        ('QUALITY_CHECK', 'Quality Check'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]

    batch_number = models.CharField(max_length=50, unique=True)
    formula = models.ForeignKey(ProductionFormula, on_delete=models.CASCADE, related_name='batches')
    planned_quantity = models.DecimalField(max_digits=10, decimal_places=3)
    actual_quantity = models.DecimalField(max_digits=10, decimal_places=3, default=0.000)
    wastage_quantity = models.DecimalField(max_digits=10, decimal_places=3, default=0.000)
    status = models.CharField(max_length=20, choices=BATCH_STATUS, default='PLANNED')
    production_date = models.DateTimeField()
    completion_date = models.DateTimeField(blank=True, null=True)
    manufacturing_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    labor_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    overhead_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    cost_per_unit = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    quality_approved = models.BooleanField(default=False)
    quality_notes = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Calculate total cost and cost per unit
        self.total_cost = self.manufacturing_cost + self.labor_cost + self.overhead_cost
        if self.actual_quantity > 0:
            self.cost_per_unit = self.total_cost / self.actual_quantity
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.batch_number} - {self.formula.finished_product.name}"

class BatchIngredientConsumption(models.Model):
    batch = models.ForeignKey(ProductionBatch, on_delete=models.CASCADE, related_name='ingredient_consumption')
    ingredient = models.ForeignKey(Product, on_delete=models.CASCADE)
    batch_number_used = models.CharField(max_length=50)
    planned_quantity = models.DecimalField(max_digits=10, decimal_places=3)
    actual_quantity_used = models.DecimalField(max_digits=10, decimal_places=3)
    wastage = models.DecimalField(max_digits=10, decimal_places=3, default=0.000)
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.batch.batch_number} - {self.ingredient.name}"

class ProductionOrder(models.Model):
    ORDER_STATUS = [
        ('DRAFT', 'Draft'),
        ('APPROVED', 'Approved'),
        ('IN_PRODUCTION', 'In Production'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]

    order_number = models.CharField(max_length=20, unique=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='production_orders')
    quantity_to_produce = models.DecimalField(max_digits=10, decimal_places=3)
    priority = models.CharField(max_length=20, choices=[
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('URGENT', 'Urgent')
    ], default='MEDIUM')
    due_date = models.DateField()
    status = models.CharField(max_length=20, choices=ORDER_STATUS, default='DRAFT')
    notes = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_production_orders')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.order_number} - {self.product.name}"

class QualityCheck(models.Model):
    RESULT_CHOICES = [
        ('PASS', 'Pass'),
        ('FAIL', 'Fail'),
        ('CONDITIONAL', 'Conditional Pass'),
    ]

    batch = models.ForeignKey(ProductionBatch, on_delete=models.CASCADE, related_name='quality_checks')
    check_date = models.DateTimeField()
    checked_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
    # Quality parameters
    appearance = models.CharField(max_length=11, choices=RESULT_CHOICES, blank=True, null=True)
    color = models.CharField(max_length=11, choices=RESULT_CHOICES, blank=True, null=True)
    odor = models.CharField(max_length=11, choices=RESULT_CHOICES, blank=True, null=True)
    consistency = models.CharField(max_length=11, choices=RESULT_CHOICES, blank=True, null=True)
    ph_value = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    
    overall_result = models.CharField(max_length=12, choices=RESULT_CHOICES)
    comments = models.TextField(blank=True, null=True)
    corrective_action = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.batch.batch_number} - QC - {self.overall_result}"