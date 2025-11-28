from django.contrib import admin
from .models import Document


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ['student', 'document_type', 'file_name', 'file_size', 'upload_date']
    list_filter = ['document_type', 'upload_date']
    search_fields = ['student__full_name_english', 'file_name']
    readonly_fields = ['upload_date', 'file_size', 'file_type']


