from django.db import models
from django.core.validators import RegexValidator


class Student(models.Model):
    """Student model matching all frontend form fields"""
    
    # Personal Information
    full_name_bangla = models.CharField(max_length=200)
    full_name_english = models.CharField(max_length=200)
    father_name = models.CharField(max_length=200)
    father_nid = models.CharField(max_length=20)
    mother_name = models.CharField(max_length=200)
    mother_nid = models.CharField(max_length=20)
    date_of_birth = models.DateField()
    birth_certificate_no = models.CharField(max_length=100)
    nid_number = models.CharField(max_length=20, blank=True, null=True)
    gender = models.CharField(max_length=10, choices=[
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ])
    religion = models.CharField(max_length=50, blank=True, null=True)
    blood_group = models.CharField(max_length=5, blank=True, null=True, choices=[
        ('A+', 'A+'), ('A-', 'A-'), ('B+', 'B+'), ('B-', 'B-'),
        ('O+', 'O+'), ('O-', 'O-'), ('AB+', 'AB+'), ('AB-', 'AB-'),
    ])
    marital_status = models.CharField(max_length=20, blank=True, null=True, choices=[
        ('Single', 'Single'),
        ('Married', 'Married'),
        ('Divorced', 'Divorced'),
        ('Widowed', 'Widowed'),
    ])
    
    # Present Address
    present_division = models.CharField(max_length=100)
    present_district = models.CharField(max_length=100)
    present_sub_district = models.CharField(max_length=100)
    present_police_station = models.CharField(max_length=100)
    present_post_office = models.CharField(max_length=100)
    present_municipality = models.CharField(max_length=100)
    present_village = models.CharField(max_length=200)
    present_ward = models.CharField(max_length=50)
    
    # Permanent Address
    permanent_division = models.CharField(max_length=100)
    permanent_district = models.CharField(max_length=100)
    permanent_sub_district = models.CharField(max_length=100)
    permanent_police_station = models.CharField(max_length=100)
    permanent_post_office = models.CharField(max_length=100)
    permanent_municipality = models.CharField(max_length=100)
    permanent_village = models.CharField(max_length=200)
    permanent_ward = models.CharField(max_length=50)
    
    # Contact Information
    phone_regex = RegexValidator(regex=r'^01\d{9}$', message="Phone number must be 11 digits starting with 01")
    mobile_student = models.CharField(validators=[phone_regex], max_length=11)
    guardian_mobile = models.CharField(validators=[phone_regex], max_length=11)
    email = models.EmailField(blank=True, null=True)
    emergency_contact = models.CharField(max_length=200)
    
    # Educational Background
    highest_exam = models.CharField(max_length=100)
    board = models.CharField(max_length=100)
    group = models.CharField(max_length=50)
    roll_number = models.CharField(max_length=50)  # SSC roll number
    registration_number = models.CharField(max_length=50)  # SSC registration number
    passing_year = models.IntegerField()
    gpa = models.DecimalField(max_digits=5, decimal_places=2)
    institution_name = models.CharField(max_length=200, blank=True, null=True)
    
    # Current Academic Information
    current_roll_number = models.CharField(max_length=50, unique=True)
    current_registration_number = models.CharField(max_length=50, unique=True)
    semester = models.IntegerField(choices=[(i, f'Semester {i}') for i in range(1, 9)])
    department = models.CharField(max_length=200)
    session = models.CharField(max_length=20)
    shift = models.CharField(max_length=20, choices=[
        ('Morning', 'Morning'),
        ('Day', 'Day'),
        ('Evening', 'Evening'),
    ])
    current_group = models.CharField(max_length=20, choices=[
        ('A', 'Group A'),
        ('B', 'Group B'),
        ('C', 'Group C'),
        ('General', 'General'),
    ])
    
    # Profile Photo
    profile_photo = models.ImageField(upload_to='students/photos/', blank=True, null=True)
    
    # System fields
    status = models.CharField(max_length=20, choices=[
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('graduated', 'Graduated'),
    ], default='active')
    enrollment_date = models.DateField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['current_roll_number']),
            models.Index(fields=['current_registration_number']),
            models.Index(fields=['full_name_english']),
            models.Index(fields=['department', 'semester']),
        ]
    
    def __str__(self):
        return f"{self.full_name_english} ({self.current_roll_number})"


class AdditionalQualification(models.Model):
    """Additional qualifications for students"""
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='additional_qualifications')
    exam = models.CharField(max_length=100)
    board = models.CharField(max_length=100)
    year = models.IntegerField()
    gpa = models.DecimalField(max_digits=5, decimal_places=2)
    
    class Meta:
        ordering = ['-year']
    
    def __str__(self):
        return f"{self.exam} - {self.year}"


