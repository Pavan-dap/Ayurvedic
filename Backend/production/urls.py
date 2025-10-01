from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductionFormulaViewSet, FormulaIngredientViewSet, ProductionBatchViewSet,
    BatchIngredientConsumptionViewSet, ProductionOrderViewSet, QualityCheckViewSet
)

router = DefaultRouter()
router.register(r'formulas', ProductionFormulaViewSet)
router.register(r'ingredients', FormulaIngredientViewSet)
router.register(r'batches', ProductionBatchViewSet)
router.register(r'consumption', BatchIngredientConsumptionViewSet)
router.register(r'orders', ProductionOrderViewSet)
router.register(r'quality', QualityCheckViewSet)

urlpatterns = [
    path('', include(router.urls)),
]