"""
Department Tests
"""
from django.test import TestCase, tag
from rest_framework.test import APITestCase
from rest_framework import status
from hypothesis import given, strategies as st
from hypothesis.extra.django import TestCase as HypothesisTestCase
from .models import Department


class DepartmentModelTest(TestCase):
    """Unit tests for Department model"""
    
    def test_department_creation(self):
        """Test creating a department"""
        dept = Department.objects.create(
            name="Computer Science and Technology",
            code="CST"
        )
        self.assertEqual(dept.name, "Computer Science and Technology")
        self.assertEqual(dept.code, "CST")
        self.assertIsNotNone(dept.id)
        self.assertIsNotNone(dept.createdAt)
        self.assertIsNotNone(dept.updatedAt)
    
    def test_department_str(self):
        """Test department string representation"""
        dept = Department.objects.create(
            name="Civil Technology",
            code="CT"
        )
        self.assertEqual(str(dept), "Civil Technology (CT)")
    
    def test_unique_name_constraint(self):
        """Test that department names must be unique"""
        Department.objects.create(name="Test Dept", code="TD1")
        with self.assertRaises(Exception):
            Department.objects.create(name="Test Dept", code="TD2")
    
    def test_unique_code_constraint(self):
        """Test that department codes must be unique"""
        Department.objects.create(name="Test Dept 1", code="TD")
        with self.assertRaises(Exception):
            Department.objects.create(name="Test Dept 2", code="TD")


@tag('property')
class DepartmentPropertyTest(HypothesisTestCase):
    """
    Property-based tests for Department model
    Feature: django-backend, Property 1: Department creation with unique constraints
    Validates: Requirements 10.1
    """
    
    @given(
        name=st.text(min_size=1, max_size=255).filter(lambda x: x.strip()),
        code=st.text(min_size=1, max_size=10, alphabet=st.characters(whitelist_categories=('Lu', 'Nd'))).filter(lambda x: x.strip())
    )
    def test_department_creation_property(self, name, code):
        """
        Property: For any valid department name and code, creating a department
        should succeed and return a department with all required fields populated
        """
        # Clean up any existing departments to avoid unique constraint violations
        Department.objects.all().delete()
        
        # Create department
        dept = Department.objects.create(name=name.strip(), code=code.strip().upper())
        
        # Verify all fields are populated
        self.assertIsNotNone(dept.id)
        self.assertEqual(dept.name, name.strip())
        self.assertEqual(dept.code, code.strip().upper())
        self.assertIsNotNone(dept.createdAt)
        self.assertIsNotNone(dept.updatedAt)
        
        # Verify it can be retrieved
        retrieved = Department.objects.get(id=dept.id)
        self.assertEqual(retrieved.name, dept.name)
        self.assertEqual(retrieved.code, dept.code)


class DepartmentAPITest(APITestCase):
    """API tests for Department endpoints"""
    
    def setUp(self):
        """Set up test data"""
        self.dept1 = Department.objects.create(
            name="Computer Science and Technology",
            code="CST"
        )
        self.dept2 = Department.objects.create(
            name="Civil Technology",
            code="CT"
        )
    
    def test_list_departments(self):
        """Test GET /api/departments/"""
        response = self.client.get('/api/departments/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
    
    def test_create_department(self):
        """Test POST /api/departments/"""
        data = {
            'name': 'Electronic Technology',
            'code': 'ET'
        }
        response = self.client.post('/api/departments/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'Electronic Technology')
        self.assertEqual(response.data['code'], 'ET')
    
    def test_get_department_detail(self):
        """Test GET /api/departments/{id}/"""
        response = self.client.get(f'/api/departments/{self.dept1.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Computer Science and Technology')
    
    def test_update_department(self):
        """Test PUT /api/departments/{id}/"""
        data = {
            'name': 'Computer Science & Technology',
            'code': 'CST'
        }
        response = self.client.put(f'/api/departments/{self.dept1.id}/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Computer Science & Technology')
    
    def test_delete_department(self):
        """Test DELETE /api/departments/{id}/"""
        response = self.client.delete(f'/api/departments/{self.dept1.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Department.objects.filter(id=self.dept1.id).exists())
    
    def test_code_uppercase_validation(self):
        """Test that department codes are automatically uppercased"""
        data = {
            'name': 'Test Department',
            'code': 'td'
        }
        response = self.client.post('/api/departments/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['code'], 'TD')



class DepartmentDeletionProtectionPropertyTest(APITestCase):
    """
    **Feature: django-backend, Property 9: Department deletion protection**
    
    Property: For any department with enrolled students, DELETE requests
    to /api/departments/{id}/ should return HTTP 400 and preserve the department
    
    **Validates: Requirements 10.4**
    """
    
    def setUp(self):
        """Set up test data"""
        self.department = Department.objects.create(
            name='Computer Science',
            code='CS'
        )
    
    @given(
        has_students=st.booleans(),
    )
    def test_department_deletion_protection(self, has_students):
        """
        Test that departments with students cannot be deleted
        """
        from apps.students.models import Student
        
        # Create a student if has_students is True
        if has_students:
            Student.objects.create(
                fullNameBangla='জন ডো',
                fullNameEnglish='John Doe',
                fatherName='Father Name',
                fatherNID='1234567890',
                motherName='Mother Name',
                motherNID='0987654321',
                dateOfBirth='2000-01-01',
                birthCertificateNo='BC123456',
                gender='Male',
                mobileStudent='01712345678',
                guardianMobile='01798765432',
                emergencyContact='Emergency Contact',
                presentAddress={
                    'division': 'Dhaka',
                    'district': 'Dhaka',
                    'subDistrict': 'Mirpur',
                    'policeStation': 'Mirpur',
                    'postOffice': 'Mirpur',
                    'municipality': 'Dhaka',
                    'village': 'Mirpur',
                    'ward': '1'
                },
                permanentAddress={
                    'division': 'Dhaka',
                    'district': 'Dhaka',
                    'subDistrict': 'Mirpur',
                    'policeStation': 'Mirpur',
                    'postOffice': 'Mirpur',
                    'municipality': 'Dhaka',
                    'village': 'Mirpur',
                    'ward': '1'
                },
                highestExam='SSC',
                board='Dhaka',
                group='Science',
                rollNumber='12345',
                registrationNumber='67890',
                passingYear=2018,
                gpa=5.00,
                currentRollNumber='CS001',
                currentRegistrationNumber='REG001',
                semester=1,
                department=self.department,
                session='2023-24',
                shift='Day',
                currentGroup='A',
                enrollmentDate='2023-01-01'
            )
        
        # Try to delete the department
        response = self.client.delete(f'/api/departments/{self.department.id}/')
        
        if has_students:
            # Should fail - department has students
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertIn('error', response.data)
            
            # Verify department still exists
            self.assertTrue(Department.objects.filter(id=self.department.id).exists())
        else:
            # Should succeed - department has no students
            self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
            
            # Verify department was deleted
            self.assertFalse(Department.objects.filter(id=self.department.id).exists())
