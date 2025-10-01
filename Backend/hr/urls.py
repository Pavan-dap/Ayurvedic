from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DepartmentViewSet, EmployeeViewSet, AttendanceViewSet,
    LeaveViewSet, PayrollViewSet, ShiftScheduleViewSet, EmployeeShiftViewSet
)

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet)
router.register(r'employees', EmployeeViewSet)
router.register(r'attendance', AttendanceViewSet)
router.register(r'leaves', LeaveViewSet)
router.register(r'payroll', PayrollViewSet)
router.register(r'shifts', ShiftScheduleViewSet)
router.register(r'employee-shifts', EmployeeShiftViewSet)

urlpatterns = [
    path('', include(router.urls)),
]