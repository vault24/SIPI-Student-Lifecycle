from django.db import models
from students.models import Student


class Document(models.Model):
    """Document model for student documents"""
    
    DOCUMENT_TYPES = [
        ('passport_photo', 'Passport Photo'),
        ('ssc_marksheet', 'SSC Marksheet'),
        ('ssc_certificate', 'SSC Certificate'),
        ('birth_certificate', 'Birth Certificate'),
        ('nid_copy', 'NID Copy'),
        ('father_nid_front', "Father's NID Front"),
        ('father_nid_back', "Father's NID Back"),
        ('mother_nid_front', "Mother's NID Front"),
        ('mother_nid_back', "Mother's NID Back"),
        ('testimonial', 'Testimonial'),
        ('medical_certificate', 'Medical Certificate'),
        ('quota_document', 'Quota Document'),
        ('extra_certificate', 'Extra Certificate'),
        ('other', 'Other'),
    ]
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='documents')
    document_type = models.CharField(max_length=50, choices=DOCUMENT_TYPES)
    file = models.FileField(upload_to='documents/%Y/%m/%d/')
    file_name = models.CharField(max_length=255)
    file_size = models.BigIntegerField(help_text="File size in bytes")
    file_type = models.CharField(max_length=100, help_text="MIME type")
    upload_date = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True, null=True)
    
    class Meta:
        ordering = ['-upload_date']
        indexes = [
            models.Index(fields=['student', 'document_type']),
        ]
    
    def __str__(self):
        return f"{self.student.full_name_english} - {self.get_document_type_display()}"


