from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SavedDashboardViewSet, DashboardWidgetViewSet

router = DefaultRouter()
router.register(r'dashboards', SavedDashboardViewSet)
router.register(r'widgets', DashboardWidgetViewSet)

urlpatterns = [
    path('', include(router.urls)),
]