from rest_framework import serializers
from .models import Document
from students.serializers import StudentListSerializer


class DocumentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    student_info = StudentListSerializer(source='student', read_only=True)
    
    class Meta:
        model = Document
        fields = '__all__'
        read_only_fields = ['upload_date']
    
    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None


