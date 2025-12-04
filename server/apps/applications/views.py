"""
Application Views
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter

from .models import Application
from .serializers import (
    ApplicationSerializer,
    ApplicationSubmitSerializer,
    ApplicationReviewSerializer
)


class ApplicationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing applications
    
    Provides CRUD operations and custom actions for application submission and review
    """
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['status', 'applicationType', 'department']
    ordering_fields = ['submittedAt', 'reviewedAt']
    ordering = ['-submittedAt']
    
    @action(detail=False, methods=['post'], permission_classes=[])
    def submit(self, request):
        """
        Public endpoint for submitting applications (no authentication required)
        
        POST /api/applications/submit/
        """
        serializer = ApplicationSubmitSerializer(data=request.data)
        if serializer.is_valid():
            application = serializer.save()
            response_serializer = ApplicationSerializer(application)
            return Response(
                response_serializer.data,
                status=status.HTTP_201_CREATED
            )
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=True, methods=['put'])
    def review(self, request, pk=None):
        """
        Admin endpoint for reviewing applications
        
        PUT /api/applications/{id}/review/
        """
        application = self.get_object()
        serializer = ApplicationReviewSerializer(data=request.data)
        
        if serializer.is_valid():
            # Update application with review data
            application.status = serializer.validated_data['status']
            application.reviewedBy = serializer.validated_data['reviewedBy']
            application.reviewNotes = serializer.validated_data.get('reviewNotes', '')
            application.reviewedAt = timezone.now()
            application.save()
            
            response_serializer = ApplicationSerializer(application)
            return Response(response_serializer.data)
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
