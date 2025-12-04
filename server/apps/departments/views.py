"""
Department Views
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import ProtectedError
from .models import Department
from .serializers import DepartmentSerializer, DepartmentListSerializer


class DepartmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Department CRUD operations
    
    Endpoints:
    - GET /api/departments/ - List all departments
    - POST /api/departments/ - Create new department
    - GET /api/departments/{id}/ - Get department details
    - PUT /api/departments/{id}/ - Update department
    - DELETE /api/departments/{id}/ - Delete department (protected if has students)
    - GET /api/departments/{id}/students/ - Get students in department
    """
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

    def get_serializer_class(self):
        """Use lightweight serializer for list view"""
        if self.action == 'list':
            return DepartmentListSerializer
        return DepartmentSerializer

    def destroy(self, request, *args, **kwargs):
        """
        Delete department with protection check
        Prevents deletion if department has enrolled students
        """
        instance = self.get_object()
        
        # Check if department has students
        if instance.student_count() > 0:
            return Response(
                {
                    'error': 'Cannot delete department',
                    'detail': f'Department has {instance.student_count()} enrolled student(s). '
                             'Please reassign or remove students before deleting the department.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ProtectedError:
            return Response(
                {
                    'error': 'Cannot delete department',
                    'detail': 'Department is referenced by other records.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['get'])
    def students(self, request, pk=None):
        """
        Get all students in this department
        Optional query param: semester (filter by semester)
        
        Example: GET /api/departments/{id}/students/?semester=3
        """
        department = self.get_object()
        students = department.student_set.all()
        
        # Filter by semester if provided
        semester = request.query_params.get('semester')
        if semester:
            try:
                semester = int(semester)
                students = students.filter(semester=semester)
            except ValueError:
                return Response(
                    {'error': 'Invalid semester value. Must be an integer.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Import here to avoid circular dependency
        from apps.students.serializers import StudentListSerializer
        serializer = StudentListSerializer(students, many=True)
        
        return Response({
            'department': DepartmentSerializer(department).data,
            'students': serializer.data,
            'count': students.count()
        })
