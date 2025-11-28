from rest_framework import serializers
from .models import Application


class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ['submitted_at', 'reviewed_at']


class ApplicationListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views"""
    class Meta:
        model = Application
        fields = [
            'id', 'full_name_english', 'application_type', 'subject',
            'status', 'submitted_at', 'department', 'roll_number'
        ]


