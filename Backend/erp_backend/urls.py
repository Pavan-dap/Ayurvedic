from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import UserDetailView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/customers/', include('customers.urls')),
    path('api/vendors/', include('vendors.urls')),
    path('api/inventory/', include('inventory.urls')),
    path('api/production/', include('production.urls')),
    path('api/sales/', include('sales.urls')),
    path('api/finance/', include('finance.urls')),
    path('api/hr/', include('hr.urls')),
    path('api/outlets/', include('outlets.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/dashboard/', include('dashboard.urls')),
    path('api/users/<int:pk>/', UserDetailView.as_view()), 
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)