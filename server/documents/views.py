from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Document
from .serializers import DocumentSerializer
from students.models import Student


class DocumentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing student documents.
    """
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    
    def get_queryset(self):
        queryset = Document.objects.all()
        
        # Filter by student
        student_id = self.request.query_params.get('student_id', None)
        if student_id:
            queryset = queryset.filter(student_id=student_id)
        
        # Filter by document type
        doc_type = self.request.query_params.get('type', None)
        if doc_type:
            queryset = queryset.filter(document_type=doc_type)
        
        return queryset
    
    def create(self, request, *args, **kwargs):
        # Validate student exists
        student_id = request.data.get('student')
        if not student_id:
            return Response(
                {'error': 'Student ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            student = Student.objects.get(pk=student_id)
        except Student.DoesNotExist:
            return Response(
                {'error': 'Student not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Get file from request
        if 'file' not in request.FILES:
            return Response(
                {'error': 'No file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        file = request.FILES['file']
        
        # Create document
        document = Document.objects.create(
            student=student,
            document_type=request.data.get('document_type', 'other'),
            file=file,
            file_name=file.name,
            file_size=file.size,
            file_type=file.content_type,
            description=request.data.get('description', '')
        )
        
        serializer = self.get_serializer(document, context={'request': request})
        return Response(
            {'message': 'Document uploaded successfully', 'data': serializer.data},
            status=status.HTTP_201_CREATED
        )
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {'message': 'Document deleted successfully'},
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['post'])
    def upload_multiple(self, request):
        """Upload multiple documents for a student"""
        student_id = request.data.get('student_id')
        if not student_id:
            return Response(
                {'error': 'Student ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            student = Student.objects.get(pk=student_id)
        except Student.DoesNotExist:
            return Response(
                {'error': 'Student not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        uploaded_docs = []
        errors = []
        
        # Handle multiple file uploads
        files = request.FILES.getlist('files')
        document_types = request.data.getlist('document_types', [])
        
        for i, file in enumerate(files):
            doc_type = document_types[i] if i < len(document_types) else 'other'
            try:
                document = Document.objects.create(
                    student=student,
                    document_type=doc_type,
                    file=file,
                    file_name=file.name,
                    file_size=file.size,
                    file_type=file.content_type,
                    description=request.data.get('description', '')
                )
                serializer = self.get_serializer(document, context={'request': request})
                uploaded_docs.append(serializer.data)
            except Exception as e:
                errors.append(f"Error uploading {file.name}: {str(e)}")
        
        return Response({
            'message': f'Uploaded {len(uploaded_docs)} document(s)',
            'data': uploaded_docs,
            'errors': errors
        }, status=status.HTTP_201_CREATED)


