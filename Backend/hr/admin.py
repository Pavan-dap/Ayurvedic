from django.contrib import admin
from .models import Department, Employee, Attendance, Leave, Payroll, ShiftSchedule, EmployeeShift

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'head', 'is_active', 'created_at']
    list_filter = ['is_active']

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ['employee_id', 'user', 'department', 'designation', 'outlet', 'is_active']
    list_filter = ['department', 'employment_type', 'outlet', 'is_active']
    search_fields = ['employee_id', 'user__first_name', 'user__last_name']

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ['employee', 'date', 'check_in_time', 'check_out_time', 'total_hours', 'is_present', 'is_late']
    list_filter = ['date', 'is_present', 'is_late', 'shift_type']
    search_fields = ['employee__user__first_name', 'employee__employee_id']

@admin.register(Leave)
class LeaveAdmin(admin.ModelAdmin):
    list_display = ['employee', 'leave_type', 'start_date', 'end_date', 'total_days', 'status']
    list_filter = ['leave_type', 'status', 'start_date']

@admin.register(Payroll)
class PayrollAdmin(admin.ModelAdmin):
    list_display = ['employee', 'month', 'year', 'net_salary', 'status']
    list_filter = ['month', 'year', 'status']