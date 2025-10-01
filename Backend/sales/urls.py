from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SaleViewSet, SaleItemViewSet, PaymentViewSet, 
    SplitPaymentViewSet, DiscountViewSet, SalesTargetViewSet
)

router = DefaultRouter()
router.register(r'sales', SaleViewSet)
router.register(r'items', SaleItemViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'split-payments', SplitPaymentViewSet)
router.register(r'discounts', DiscountViewSet)
router.register(r'targets', SalesTargetViewSet)

urlpatterns = [
    path('', include(router.urls)),
]