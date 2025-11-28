from django.contrib import admin
from .models import Application


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ['full_name_english', 'application_type', 'status', 'submitted_at']
    list_filter = ['status', 'application_type', 'submitted_at']
    search_fields = ['full_name_english', 'roll_number', 'application_type']
    readonly_fields = ['submitted_at', 'reviewed_at']


