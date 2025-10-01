from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Department, Employee, Attendance, Leave, Payroll, ShiftSchedule, EmployeeShift
)

class DepartmentSerializer(serializers.ModelSerializer):
    head_name = serializers.CharField(source='head.get_full_name', read_only=True)
    employee_count = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = '__all__'

    def get_employee_count(self, obj):
        return obj.employees.filter(is_active=True).count()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class EmployeeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    outlet_name = serializers.CharField(source='outlet.name', read_only=True)
    employment_type_display = serializers.CharField(source='get_employment_type_display', read_only=True)
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = Employee
        fields = '__all__'

    def create(self, validated_data):
        # Auto-generate employee ID
        last_employee = Employee.objects.order_by('id').last()
        if last_employee:
            try:
                emp_num = int(last_employee.employee_id.split('EMP')[1]) + 1
            except:
                emp_num = 1001
        else:
            emp_num = 1001
            
        validated_data['employee_id'] = f'EMP{emp_num:04d}'
        return super().create(validated_data)

class AttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.get_full_name', read_only=True)
    employee_id = serializers.CharField(source='employee.employee_id', read_only=True)
    shift_type_display = serializers.CharField(source='get_shift_type_display', read_only=True)

    class Meta:
        model = Attendance
        fields = '__all__'

class LeaveSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.get_full_name', read_only=True)
    employee_id = serializers.CharField(source='employee.employee_id', read_only=True)
    leave_type_display = serializers.CharField(source='get_leave_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Leave
        fields = '__all__'

class PayrollSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.get_full_name', read_only=True)
    employee_id = serializers.CharField(source='employee.employee_id', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Payroll
        fields = '__all__'

class ShiftScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShiftSchedule
        fields = '__all__'

class EmployeeShiftSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.get_full_name', read_only=True)
    shift_name = serializers.CharField(source='shift.name', read_only=True)
    day_of_week_display = serializers.CharField(source='get_day_of_week_display', read_only=True)

    class Meta:
        model = EmployeeShift
        fields = '__all__'