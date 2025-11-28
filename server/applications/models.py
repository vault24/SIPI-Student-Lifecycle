from django.db import models


class Application(models.Model):
    """Application model for student document/service requests"""
    
    APPLICATION_TYPES = [
        ('Testimonial', 'Testimonial'),
        ('Certificate', 'Certificate'),
        ('Stipend', 'Stipend'),
        ('Character Certificate', 'Character Certificate'),
        ('Transcript', 'Transcript'),
        ('Other Documents', 'Other Documents'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    # Student Information
    full_name_bangla = models.CharField(max_length=200)
    full_name_english = models.CharField(max_length=200)
    father_name = models.CharField(max_length=200)
    mother_name = models.CharField(max_length=200)
    department = models.CharField(max_length=200)
    session = models.CharField(max_length=20)
    shift = models.CharField(max_length=20, choices=[
        ('Morning', 'Morning'),
        ('Day', 'Day'),
        ('Evening', 'Evening'),
    ])
    roll_number = models.CharField(max_length=50)
    registration_number = models.CharField(max_length=50)
    email = models.EmailField(blank=True, null=True)
    
    # Application Details
    application_type = models.CharField(max_length=50, choices=APPLICATION_TYPES)
    subject = models.CharField(max_length=500)
    message = models.TextField()
    
    # Status and Review
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(blank=True, null=True)
    reviewed_by = models.CharField(max_length=200, blank=True, null=True)
    review_notes = models.TextField(blank=True, null=True)
    
    class Meta:
        ordering = ['-submitted_at']
        indexes = [
            models.Index(fields=['status', 'submitted_at']),
            models.Index(fields=['roll_number']),
        ]
    
    def __str__(self):
        return f"{self.full_name_english} - {self.application_type} ({self.status})"


