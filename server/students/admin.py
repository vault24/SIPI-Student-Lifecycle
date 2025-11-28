from django.contrib import admin
from .models import Student, AdditionalQualification


class AdditionalQualificationInline(admin.TabularInline):
    model = AdditionalQualification
    extra = 1


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['full_name_english', 'current_roll_number', 'department', 'semester', 'status']
    list_filter = ['status', 'department', 'semester', 'shift']
    search_fields = ['full_name_english', 'full_name_bangla', 'current_roll_number', 'current_registration_number']
    inlines = [AdditionalQualificationInline]
    readonly_fields = ['created_at', 'updated_at']


