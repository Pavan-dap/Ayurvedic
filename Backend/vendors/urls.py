from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VendorViewSet, VendorProductViewSet, VendorPerformanceViewSet

router = DefaultRouter()
router.register(r'vendors', VendorViewSet)
router.register(r'products', VendorProductViewSet)
router.register(r'performance', VendorPerformanceViewSet)

urlpatterns = [
    path('', include(router.urls)),
]