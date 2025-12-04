"""
Alumni Property-Based Tests

These tests use Hypothesis to verify universal properties across all inputs.
"""
from django.test import TestCase
from hypothesis import given, settings, strategies as st
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Alumni
from apps.students.models import Student
from apps.departments.models import Department
from datetime import date, timedelta


class CareerPositionChronologyPropertyTest(TestCase):
    """
    **Feature: django-backend, Property 11: Career position chronology**
    
    Property: For any alumni record, when a new career position is added,
    the careerHistory array should be sorted by startDate in descending order
    (most recent first).
    """
    
    def setUp(self):
        """Create test department and student"""
        self.department = Department.objects.create(
            name='Computer Science',
            code='CSE'
        )
        
        self.student = Student.objects.create(
            fullNameBangla='বাংলা নাম',
            fullNameEnglish='Test Student',
            fatherName='Father Name',
            fatherNID='1234567890123456',
            motherName='Mother Name',
            motherNID='1234567890123456',
            dateOfBirth='2000-01-01',
            birthCertificateNo='BC123456',
            gender='Male',
            mobileStudent='01712345678',
            guardianMobile='01712345678',
            emergencyContact='Emergency',
            presentAddress={'division': 'Dhaka', 'district': 'Dhaka', 'subDistrict': 'Mirpur',
                          'policeStation': 'Mirpur', 'postOffice': 'Mirpur', 'municipality': 'Dhaka',
                          'village': 'Mirpur', 'ward': '1'},
            permanentAddress={'division': 'Dhaka', 'district': 'Dhaka', 'subDistrict': 'Mirpur',
                            'policeStation': 'Mirpur', 'postOffice': 'Mirpur', 'municipality': 'Dhaka',
                            'village': 'Mirpur', 'ward': '1'},
            highestExam='SSC',
            board='Dhaka',
            group='Science',
            rollNumber='R123456',
            registrationNumber='REG123456',
            passingYear=2020,
            gpa=3.5,
            currentRollNumber='CR123456',
            currentRegistrationNumber='CREG123456',
            semester=8,
            department=self.department,
            session='2020-2021',
            shift='Morning',
            currentGroup='A',
            enrollmentDate='2020-01-01',
            semesterResults=[
                {'semester': i, 'gpa': 3.5, 'cgpa': 3.5}
                for i in range(1, 9)
            ]
        )
        
        self.alumni = Alumni.objects.create(
            student=self.student,
            alumniType='recent',
            graduationYear=2024,
            currentSupportCategory='no_support_needed'
        )
    
    @settings(max_examples=50, deadline=None)
    @given(
        num_positions=st.integers(min_value=2, max_value=10),
    )
    def test_career_positions_sorted_by_date_descending(self, num_positions):
        """
        Test that career positions are always sorted by startDate in descending order
        """
        # Generate random career positions with different dates
        base_date = date(2020, 1, 1)
        positions = []
        
        for i in range(num_positions):
            # Create positions with random dates
            days_offset = i * 100 + (i * 37) % 50  # Semi-random offset
            start_date = base_date + timedelta(days=days_offset)
            
            position = {
                'company': f'Company {i}',
                'position': f'Position {i}',
                'startDate': start_date.isoformat(),
                'description': f'Description {i}'
            }
            positions.append(position)
        
        # Add positions in random order
        import random
        shuffled_positions = positions.copy()
        random.shuffle(shuffled_positions)
        
        for position in shuffled_positions:
            self.alumni.add_career_position(position)
        
        # Refresh from database
        self.alumni.refresh_from_db()
        
        # Verify positions are sorted by startDate descending
        career_history = self.alumni.careerHistory
        
        for i in range(len(career_history) - 1):
            current_date = career_history[i].get('startDate', '')
            next_date = career_history[i + 1].get('startDate', '')
            
            # Current date should be >= next date (descending order)
            self.assertGreaterEqual(
                current_date,
                next_date,
                f"Career history not sorted correctly: {current_date} should be >= {next_date}"
            )
    
    @settings(max_examples=30, deadline=None)
    @given(
        company_name=st.text(min_size=3, max_size=50, alphabet=st.characters(whitelist_categories=('Lu', 'Ll'), min_codepoint=65, max_codepoint=122)),
        position_title=st.text(min_size=3, max_size=50, alphabet=st.characters(whitelist_categories=('Lu', 'Ll'), min_codepoint=65, max_codepoint=122)),
    )
    def test_most_recent_position_becomes_current(self, company_name, position_title):
        """
        Test that the most recent position becomes the current position
        """
        # Add an older position
        old_position = {
            'company': 'Old Company',
            'position': 'Old Position',
            'startDate': '2020-01-01',
        }
        self.alumni.add_career_position(old_position)
        
        # Add a newer position
        new_position = {
            'company': company_name,
            'position': position_title,
            'startDate': '2024-01-01',
        }
        self.alumni.add_career_position(new_position)
        
        # Refresh from database
        self.alumni.refresh_from_db()
        
        # Current position should be the newer one
        self.assertEqual(self.alumni.currentPosition.get('company'), company_name)
        self.assertEqual(self.alumni.currentPosition.get('position'), position_title)
