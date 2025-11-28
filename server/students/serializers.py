from rest_framework import serializers
from .models import Student, AdditionalQualification


class AdditionalQualificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdditionalQualification
        fields = ['id', 'exam', 'board', 'year', 'gpa']


class StudentSerializer(serializers.ModelSerializer):
    additional_qualifications = AdditionalQualificationSerializer(many=True, read_only=True)
    profile_photo_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Student
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
    
    def get_profile_photo_url(self, obj):
        if obj.profile_photo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_photo.url)
            return obj.profile_photo.url
        return None


class StudentListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views"""
    profile_photo_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Student
        fields = [
            'id', 'full_name_english', 'full_name_bangla', 'current_roll_number',
            'current_registration_number', 'semester', 'department', 'status',
            'profile_photo_url', 'created_at'
        ]
    
    def get_profile_photo_url(self, obj):
        if obj.profile_photo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_photo.url)
            return obj.profile_photo.url
        return None


class StudentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating students with additional qualifications"""
    additional_qualifications = AdditionalQualificationSerializer(many=True, required=False)
    
    class Meta:
        model = Student
        exclude = ['created_at', 'updated_at']
    
    def create(self, validated_data):
        qualifications_data = validated_data.pop('additional_qualifications', [])
        student = Student.objects.create(**validated_data)
        
        for qual_data in qualifications_data:
            AdditionalQualification.objects.create(student=student, **qual_data)
        
        return student
    
    def update(self, instance, validated_data):
        qualifications_data = validated_data.pop('additional_qualifications', None)
        
        # Update student fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update additional qualifications if provided
        if qualifications_data is not None:
            # Delete existing qualifications
            instance.additional_qualifications.all().delete()
            # Create new ones
            for qual_data in qualifications_data:
                AdditionalQualification.objects.create(student=instance, **qual_data)
        
        return instance


