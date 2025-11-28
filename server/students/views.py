from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Student
from .serializers import (
    StudentSerializer,
    StudentListSerializer,
    StudentCreateSerializer
)


class StudentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing students.
    Provides CRUD operations and search functionality.
    """
    queryset = Student.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'list':
            return StudentListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return StudentCreateSerializer
        return StudentSerializer
    
    def get_queryset(self):
        queryset = Student.objects.all()
        
        # Search by name or roll number
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(full_name_english__icontains=search) |
                Q(full_name_bangla__icontains=search) |
                Q(current_roll_number__icontains=search) |
                Q(current_registration_number__icontains=search)
            )
        
        # Filter by semester
        semester = self.request.query_params.get('semester', None)
        if semester:
            queryset = queryset.filter(semester=semester)
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by department
        department = self.request.query_params.get('department', None)
        if department:
            queryset = queryset.filter(department=department)
        
        return queryset
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {'message': 'Student created successfully', 'data': serializer.data},
            status=status.HTTP_201_CREATED,
            headers=headers
        )
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(
            {'message': 'Student updated successfully', 'data': serializer.data},
            status=status.HTTP_200_OK
        )
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {'message': 'Student deleted successfully'},
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search students by name or roll number"""
        query = request.query_params.get('q', '')
        if not query:
            return Response(
                {'error': 'Search query parameter "q" is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        students = Student.objects.filter(
            Q(full_name_english__icontains=query) |
            Q(full_name_bangla__icontains=query) |
            Q(current_roll_number__icontains=query) |
            Q(current_registration_number__icontains=query)
        )
        
        serializer = StudentListSerializer(students, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def upload_photo(self, request, pk=None):
        """Upload profile photo for a student"""
        student = self.get_object()
        if 'photo' not in request.FILES:
            return Response(
                {'error': 'No photo file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        student.profile_photo = request.FILES['photo']
        student.save()
        
        serializer = self.get_serializer(student)
        return Response(
            {'message': 'Photo uploaded successfully', 'data': serializer.data},
            status=status.HTTP_200_OK
        )


