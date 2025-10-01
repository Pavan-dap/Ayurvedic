from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OutletViewSet, StockTransferViewSet, StockTransferItemViewSet, CashDenominationViewSet

router = DefaultRouter()
router.register(r'outlets', OutletViewSet)
router.register(r'transfers', StockTransferViewSet)
router.register(r'transfer-items', StockTransferItemViewSet)
router.register(r'cash', CashDenominationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]