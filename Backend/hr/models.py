from django.db import models
from django.contrib.auth.models import User
from outlets.models import Outlet

class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    head = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='headed_departments')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Employee(models.Model):
    EMPLOYMENT_TYPES = [
        ('FULL_TIME', 'Full Time'),
        ('PART_TIME', 'Part Time'),
        ('CONTRACT', 'Contract'),
        ('INTERN', 'Intern'),
    ]

    employee_id = models.CharField(max_length=20, unique=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employee_profile')
    outlet = models.ForeignKey(Outlet, on_delete=models.CASCADE, related_name='employees')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='employees')
    designation = models.CharField(max_length=100)
    employment_type = models.CharField(max_length=15, choices=EMPLOYMENT_TYPES, default='FULL_TIME')
    
    # Personal Information
    phone = models.CharField(max_length=15)
    emergency_contact = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField()
    date_of_birth = models.DateField(blank=True, null=True)
    
    # Employment Information
    join_date = models.DateField()
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    
    # Bank Details
    bank_name = models.CharField(max_length=100, blank=True, null=True)
    account_number = models.CharField(max_length=50, blank=True, null=True)
    ifsc_code = models.CharField(max_length=20, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.employee_id} - {self.user.get_full_name()}"

class Attendance(models.Model):
    SHIFT_TYPES = [
        ('MORNING', 'Morning Shift'),
        ('EVENING', 'Evening Shift'),
        ('NIGHT', 'Night Shift'),
        ('GENERAL', 'General'),
    ]

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='attendances')
    date = models.DateField()
    shift_type = models.CharField(max_length=10, choices=SHIFT_TYPES, default='GENERAL')
    check_in_time = models.TimeField(blank=True, null=True)
    check_out_time = models.TimeField(blank=True, null=True)
    total_hours = models.DecimalField(max_digits=4, decimal_places=2, default=0.00)
    overtime_hours = models.DecimalField(max_digits=4, decimal_places=2, default=0.00)
    is_present = models.BooleanField(default=False)
    is_late = models.BooleanField(default=False)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['employee', 'date', 'shift_type']

    def save(self, *args, **kwargs):
        if self.check_in_time and self.check_out_time:
            from datetime import datetime, timedelta
            
            # Calculate total hours
            check_in = datetime.combine(self.date, self.check_in_time)
            check_out = datetime.combine(self.date, self.check_out_time)
            
            # Handle overnight shifts
            if check_out < check_in:
                check_out += timedelta(days=1)
            
            total_time = check_out - check_in
            self.total_hours = total_time.total_seconds() / 3600
            
            # Standard work hours (8 hours)
            standard_hours = 8
            if self.total_hours > standard_hours:
                self.overtime_hours = self.total_hours - standard_hours
            
            self.is_present = True
            
            # Check if late (assuming 9:00 AM start time)
            from datetime import time
            standard_start = time(9, 0)
            if self.check_in_time > standard_start:
                self.is_late = True
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.employee.user.get_full_name()} - {self.date}"

class Leave(models.Model):
    LEAVE_TYPES = [
        ('CASUAL', 'Casual Leave'),
        ('SICK', 'Sick Leave'),
        ('ANNUAL', 'Annual Leave'),
        ('MATERNITY', 'Maternity Leave'),
        ('PATERNITY', 'Paternity Leave'),
        ('EMERGENCY', 'Emergency Leave'),
    ]

    LEAVE_STATUS = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
        ('CANCELLED', 'Cancelled'),
    ]

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='leaves')
    leave_type = models.CharField(max_length=15, choices=LEAVE_TYPES)
    start_date = models.DateField()
    end_date = models.DateField()
    total_days = models.IntegerField()
    reason = models.TextField()
    status = models.CharField(max_length=10, choices=LEAVE_STATUS, default='PENDING')
    applied_date = models.DateTimeField(auto_now_add=True)
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_leaves')
    approved_date = models.DateTimeField(blank=True, null=True)
    comments = models.TextField(blank=True, null=True)

    def save(self, *args, **kwargs):
        # Calculate total days
        self.total_days = (self.end_date - self.start_date).days + 1
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.employee.user.get_full_name()} - {self.leave_type} - {self.start_date} to {self.end_date}"

class Payroll(models.Model):
    PAYROLL_STATUS = [
        ('DRAFT', 'Draft'),
        ('PROCESSED', 'Processed'),
        ('PAID', 'Paid'),
    ]

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='payrolls')
    month = models.IntegerField()
    year = models.IntegerField()
    
    # Earnings
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2)
    hra = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    conveyance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    overtime_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    bonus = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_earnings = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    # Deductions
    pf_deduction = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    esi_deduction = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    tax_deduction = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    other_deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    # Final amount
    net_salary = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    # Working days
    total_working_days = models.IntegerField(default=30)
    days_worked = models.IntegerField(default=0)
    leaves_taken = models.IntegerField(default=0)
    overtime_hours = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    
    status = models.CharField(max_length=10, choices=PAYROLL_STATUS, default='DRAFT')
    generated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='generated_payrolls')
    generated_at = models.DateTimeField(auto_now_add=True)
    paid_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        unique_together = ['employee', 'month', 'year']

    def save(self, *args, **kwargs):
        # Calculate totals
        self.total_earnings = self.basic_salary + self.hra + self.conveyance + self.overtime_amount + self.bonus
        self.total_deductions = self.pf_deduction + self.esi_deduction + self.tax_deduction + self.other_deductions
        self.net_salary = self.total_earnings - self.total_deductions
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.employee.user.get_full_name()} - {self.month}/{self.year} - ₹{self.net_salary}"

class ShiftSchedule(models.Model):
    name = models.CharField(max_length=100)
    start_time = models.TimeField()
    end_time = models.TimeField()
    break_duration = models.IntegerField(default=60, help_text='Break duration in minutes')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.start_time} to {self.end_time}"

class EmployeeShift(models.Model):
    DAYS_OF_WEEK = [
        ('MONDAY', 'Monday'),
        ('TUESDAY', 'Tuesday'),
        ('WEDNESDAY', 'Wednesday'),
        ('THURSDAY', 'Thursday'),
        ('FRIDAY', 'Friday'),
        ('SATURDAY', 'Saturday'),
        ('SUNDAY', 'Sunday'),
    ]

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='shift_schedules')
    shift = models.ForeignKey(ShiftSchedule, on_delete=models.CASCADE)
    day_of_week = models.CharField(max_length=10, choices=DAYS_OF_WEEK)
    is_working_day = models.BooleanField(default=True)
    effective_from = models.DateField()
    effective_until = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"{self.employee.user.get_full_name()} - {self.day_of_week} - {self.shift.name}"