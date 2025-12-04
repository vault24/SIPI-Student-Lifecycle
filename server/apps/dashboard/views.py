"""
Dashboard Views
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count, Q
from apps.students.models import Student
from apps.alumni.models import Alumni
from apps.applications.models import Application


class DashboardStatsView(APIView):
    """
    API view for dashboard statistics
    
    GET /api/dashboard/stats/
    """
    
    def get(self, request):
        """
        Get comprehensive dashboard statistics
        """
        try:
            # Total students count
            total_students = Student.objects.count()
            active_students = Student.objects.filter(status='active').count()
            graduated_students = Student.objects.filter(status='graduated').count()
            discontinued_students = Student.objects.filter(status='discontinued').count()
            
            # Student statistics by status
            student_stats_by_status = list(Student.objects.values('status').annotate(
                count=Count('id')
            ).order_by('status'))
            
            # Student statistics by department
            student_stats_by_department = list(Student.objects.values(
                'department__name', 'department__code'
            ).annotate(
                count=Count('id')
            ).order_by('department__name'))
            
            # Student statistics by semester
            student_stats_by_semester = list(Student.objects.values('semester').annotate(
                count=Count('id')
            ).order_by('semester'))
            
            # Alumni statistics
            total_alumni = Alumni.objects.count()
            recent_alumni = Alumni.objects.filter(alumniType='recent').count()
            established_alumni = Alumni.objects.filter(alumniType='established').count()
            
            # Convert support categories to dict format
            support_dict = {}
            alumni_by_support = Alumni.objects.values('currentSupportCategory').annotate(
                count=Count('student_id')
            )
            for item in alumni_by_support:
                support_dict[item['currentSupportCategory']] = item['count']
            
            # Convert years to dict format
            year_dict = {}
            alumni_by_year = Alumni.objects.values('graduationYear').annotate(
                count=Count('student_id')
            ).order_by('-graduationYear')
            for item in alumni_by_year:
                year_dict[str(item['graduationYear'])] = item['count']
            
            # Application statistics
            total_applications = Application.objects.count()
            pending_applications = Application.objects.filter(status='pending').count()
            approved_applications = Application.objects.filter(status='approved').count()
            rejected_applications = Application.objects.filter(status='rejected').count()
            
            applications_by_status = list(Application.objects.values('status').annotate(
                count=Count('id')
            ).order_by('status'))
            
            applications_by_type = list(Application.objects.values('applicationType').annotate(
                count=Count('id')
            ).order_by('applicationType'))
            
            # Compile all statistics
            stats = {
                'students': {
                    'total': total_students,
                    'active': active_students,
                    'graduated': graduated_students,
                    'discontinued': discontinued_students,
                    'byStatus': student_stats_by_status,
                    'byDepartment': student_stats_by_department,
                    'bySemester': student_stats_by_semester,
                },
                'alumni': {
                    'total': total_alumni,
                    'recent': recent_alumni,
                    'established': established_alumni,
                    'bySupport': support_dict,
                    'byYear': year_dict,
                },
                'applications': {
                    'total': total_applications,
                    'pending': pending_applications,
                    'approved': approved_applications,
                    'rejected': rejected_applications,
                    'byStatus': applications_by_status,
                    'byType': applications_by_type,
                }
            }
            
            return Response(stats, status=status.HTTP_200_OK)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
