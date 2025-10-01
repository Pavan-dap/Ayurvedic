from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum, Count, Avg
from django.utils import timezone
from datetime import datetime, timedelta
from .models import (
    Department, Employee, Attendance, Leave, Payroll, ShiftSchedule, EmployeeShift
)
from .serializers import (
    DepartmentSerializer, EmployeeSerializer, AttendanceSerializer,
    LeaveSerializer, PayrollSerializer, ShiftScheduleSerializer, EmployeeShiftSerializer
)

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all().select_related('head')
    serializer_class = DepartmentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_active']
    search_fields = ['name']

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all().select_related('user', 'department', 'outlet')
    serializer_class = EmployeeSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['department', 'outlet', 'employment_type', 'is_active']
    search_fields = ['employee_id', 'user__first_name', 'user__last_name', 'designation']
    ordering = ['employee_id']

    @action(detail=False, methods=['get'])
    def employee_summary(self, request):
        total_employees = Employee.objects.filter(is_active=True).count()
        
        # Department wise count
        dept_summary = Employee.objects.filter(is_active=True).values(
            'department__name'
        ).annotate(count=Count('id')).order_by('-count')
        
        # Employment type summary
        type_summary = Employee.objects.filter(is_active=True).values(
            'employment_type'
        ).annotate(count=Count('id'))
        
        return Response({
            'total_employees': total_employees,
            'by_department': dept_summary,
            'by_employment_type': type_summary
        })

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all().select_related('employee__user')
    serializer_class = AttendanceSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['employee', 'date', 'is_present', 'is_late', 'shift_type']
    ordering = ['-date', 'employee__employee_id']

    @action(detail=False, methods=['post'])
    def bulk_attendance(self, request):
        """Mark attendance for multiple employees"""
        attendance_data = request.data.get('attendances', [])
        created_count = 0
        
        for data in attendance_data:
            employee_id = data.get('employee_id')
            date = data.get('date')
            check_in = data.get('check_in_time')
            check_out = data.get('check_out_time')
            
            try:
                employee = Employee.objects.get(id=employee_id)
                attendance, created = Attendance.objects.update_or_create(
                    employee=employee,
                    date=date,
                    defaults={
                        'check_in_time': check_in,
                        'check_out_time': check_out
                    }
                )
                if created:
                    created_count += 1
            except Employee.DoesNotExist:
                continue
        
        return Response({'message': f'Created/updated {created_count} attendance records'})

    @action(detail=False, methods=['get'])
    def attendance_summary(self, request):
        today = timezone.now().date()
        
        # Today's attendance
        today_attendance = Attendance.objects.filter(date=today).aggregate(
            total_present=Count('id', filter=models.Q(is_present=True)),
            total_late=Count('id', filter=models.Q(is_late=True)),
            avg_hours=Avg('total_hours')
        )
        
        # This month's summary
        start_of_month = today.replace(day=1)
        month_attendance = Attendance.objects.filter(
            date__gte=start_of_month
        ).values('employee__user__first_name', 'employee__user__last_name').annotate(
            days_present=Count('id', filter=models.Q(is_present=True)),
            total_hours=Sum('total_hours'),
            overtime_hours=Sum('overtime_hours')
        )
        
        return Response({
            'today': today_attendance,
            'this_month': list(month_attendance)
        })

class LeaveViewSet(viewsets.ModelViewSet):
    queryset = Leave.objects.all().select_related('employee__user', 'approved_by')
    serializer_class = LeaveSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['employee', 'leave_type', 'status', 'start_date']
    ordering = ['-applied_date']

    @action(detail=True, methods=['post'])
    def approve_leave(self, request, pk=None):
        leave = self.get_object()
        if leave.status == 'PENDING':
            leave.status = 'APPROVED'
            leave.approved_by = request.user
            leave.approved_date = timezone.now()
            leave.comments = request.data.get('comments', '')
            leave.save()
            return Response({'message': 'Leave approved successfully'})
        return Response({'error': 'Leave cannot be approved'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def reject_leave(self, request, pk=None):
        leave = self.get_object()
        if leave.status == 'PENDING':
            leave.status = 'REJECTED'
            leave.approved_by = request.user
            leave.approved_date = timezone.now()
            leave.comments = request.data.get('comments', 'Leave rejected')
            leave.save()
            return Response({'message': 'Leave rejected'})
        return Response({'error': 'Leave cannot be rejected'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def leave_summary(self, request):
        # Pending leaves
        pending_leaves = Leave.objects.filter(status='PENDING').count()
        
        # Leave type summary
        leave_summary = Leave.objects.values('leave_type').annotate(
            count=Count('id'),
            total_days=Sum('total_days')
        )
        
        return Response({
            'pending_leaves': pending_leaves,
            'by_type': list(leave_summary)
        })

class PayrollViewSet(viewsets.ModelViewSet):
    queryset = Payroll.objects.all().select_related('employee__user', 'generated_by')
    serializer_class = PayrollSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['employee', 'month', 'year', 'status']
    ordering = ['-year', '-month', 'employee__employee_id']

    @action(detail=False, methods=['post'])
    def generate_payroll(self, request):
        """Generate payroll for a specific month and year"""
        month = request.data.get('month')
        year = request.data.get('year')
        employee_ids = request.data.get('employee_ids', [])
        
        if not month or not year:
            return Response({'error': 'Month and year are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        employees = Employee.objects.filter(is_active=True)
        if employee_ids:
            employees = employees.filter(id__in=employee_ids)
        
        generated_count = 0
        for employee in employees:
            # Check if payroll already exists
            if Payroll.objects.filter(employee=employee, month=month, year=year).exists():
                continue
            
            # Calculate attendance for the month
            start_date = datetime(year, month, 1).date()
            if month == 12:
                end_date = datetime(year + 1, 1, 1).date() - timedelta(days=1)
            else:
                end_date = datetime(year, month + 1, 1).date() - timedelta(days=1)
            
            attendance_summary = Attendance.objects.filter(
                employee=employee,
                date__gte=start_date,
                date__lte=end_date
            ).aggregate(
                days_worked=Count('id', filter=models.Q(is_present=True)),
                total_hours=Sum('total_hours'),
                overtime_hours=Sum('overtime_hours')
            )
            
            # Create payroll
            payroll = Payroll.objects.create(
                employee=employee,
                month=month,
                year=year,
                basic_salary=employee.salary,
                days_worked=attendance_summary['days_worked'] or 0,
                overtime_hours=attendance_summary['overtime_hours'] or 0,
                overtime_amount=(attendance_summary['overtime_hours'] or 0) * 100,  # ₹100 per hour
                generated_by=request.user
            )
            generated_count += 1
        
        return Response({'message': f'Generated payroll for {generated_count} employees'})

    @action(detail=True, methods=['post'])
    def process_payroll(self, request, pk=None):
        payroll = self.get_object()
        if payroll.status == 'DRAFT':
            payroll.status = 'PROCESSED'
            payroll.save()
            return Response({'message': 'Payroll processed successfully'})
        return Response({'error': 'Payroll cannot be processed'}, status=status.HTTP_400_BAD_REQUEST)

class ShiftScheduleViewSet(viewsets.ModelViewSet):
    queryset = ShiftSchedule.objects.all()
    serializer_class = ShiftScheduleSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_active']
    search_fields = ['name']

class EmployeeShiftViewSet(viewsets.ModelViewSet):
    queryset = EmployeeShift.objects.all().select_related('employee__user', 'shift')
    serializer_class = EmployeeShiftSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['employee', 'shift', 'day_of_week', 'is_working_day']