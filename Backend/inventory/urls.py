from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductCategoryViewSet, ProductViewSet, StockViewSet, StockMovementViewSet,
    PurchaseOrderViewSet, PurchaseOrderItemViewSet, 
    GoodsReceiptNoteViewSet, GoodsReceiptItemViewSet
)

router = DefaultRouter()
router.register(r'categories', ProductCategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'stock', StockViewSet)
router.register(r'movements', StockMovementViewSet)
router.register(r'purchase-orders', PurchaseOrderViewSet)
router.register(r'po-items', PurchaseOrderItemViewSet)
router.register(r'grn', GoodsReceiptNoteViewSet)
router.register(r'grn-items', GoodsReceiptItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
]