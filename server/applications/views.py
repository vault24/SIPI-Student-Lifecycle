from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.utils import timezone
from .models import Application
from .serializers import ApplicationSerializer, ApplicationListSerializer


class ApplicationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing student applications.
    """
    queryset = Application.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ApplicationListSerializer
        return ApplicationSerializer
    
    def get_queryset(self):
        queryset = Application.objects.all()
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Search
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(full_name_english__icontains=search) |
                Q(full_name_bangla__icontains=search) |
                Q(roll_number__icontains=search) |
                Q(application_type__icontains=search)
            )
        
        return queryset
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {'message': 'Application submitted successfully', 'data': serializer.data},
            status=status.HTTP_201_CREATED,
            headers=headers
        )
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve an application"""
        application = self.get_object()
        application.status = 'approved'
        application.reviewed_at = timezone.now()
        application.reviewed_by = request.data.get('reviewed_by', 'Admin')
        application.review_notes = request.data.get('notes', '')
        application.save()
        
        serializer = self.get_serializer(application)
        return Response(
            {'message': 'Application approved', 'data': serializer.data},
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject an application"""
        application = self.get_object()
        application.status = 'rejected'
        application.reviewed_at = timezone.now()
        application.reviewed_by = request.data.get('reviewed_by', 'Admin')
        application.review_notes = request.data.get('notes', '')
        application.save()
        
        serializer = self.get_serializer(application)
        return Response(
            {'message': 'Application rejected', 'data': serializer.data},
            status=status.HTTP_200_OK
        )
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {'message': 'Application deleted successfully'},
            status=status.HTTP_200_OK
        )

