// API Service for SLMS - Handles all backend API calls

// Use API_CONFIG if available, otherwise default
const API_BASE_URL = (window.API_CONFIG && window.API_CONFIG.BASE_URL) || 'http://localhost:8000/api';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const config = { ...defaultOptions, ...options };
    
    // Handle FormData (for file uploads)
    if (options.body instanceof FormData) {
        delete config.headers['Content-Type'];
    }

    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Students API
const studentsAPI = {
    // Get all students
    async getAll(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = `/students/${queryString ? `?${queryString}` : ''}`;
        const response = await apiCall(endpoint);
        return response.results || response; // Handle pagination
    },

    // Get student by ID
    async getById(id) {
        return await apiCall(`/students/${id}/`);
    },

    // Create student
    async create(studentData) {
        // Handle additional qualifications
        const additionalQualifications = studentData.additionalQualifications || [];
        delete studentData.additionalQualifications;

        // Convert field names from frontend format to backend format
        const backendData = {
            full_name_bangla: studentData.fullNameBangla,
            full_name_english: studentData.fullNameEnglish,
            father_name: studentData.fatherName,
            father_nid: studentData.fatherNID,
            mother_name: studentData.motherName,
            mother_nid: studentData.motherNID,
            date_of_birth: studentData.dateOfBirth,
            birth_certificate_no: studentData.birthCertificateNo,
            nid_number: studentData.nidNumber || '',
            gender: studentData.gender,
            religion: studentData.religion || '',
            blood_group: studentData.bloodGroup || '',
            marital_status: studentData.maritalStatus || '',
            
            // Present Address
            present_division: studentData.presentAddress?.division || studentData.presentDivision,
            present_district: studentData.presentAddress?.district || studentData.presentDistrict,
            present_sub_district: studentData.presentAddress?.subDistrict || studentData.presentSubDistrict,
            present_police_station: studentData.presentAddress?.policeStation || studentData.presentPoliceStation,
            present_post_office: studentData.presentAddress?.postOffice || studentData.presentPostOffice,
            present_municipality: studentData.presentAddress?.municipality || studentData.presentMunicipality,
            present_village: studentData.presentAddress?.village || studentData.presentVillage,
            present_ward: studentData.presentAddress?.ward || studentData.presentWard,
            
            // Permanent Address
            permanent_division: studentData.permanentAddress?.division || studentData.permanentDivision,
            permanent_district: studentData.permanentAddress?.district || studentData.permanentDistrict,
            permanent_sub_district: studentData.permanentAddress?.subDistrict || studentData.permanentSubDistrict,
            permanent_police_station: studentData.permanentAddress?.policeStation || studentData.permanentPoliceStation,
            permanent_post_office: studentData.permanentAddress?.postOffice || studentData.permanentPostOffice,
            permanent_municipality: studentData.permanentAddress?.municipality || studentData.permanentMunicipality,
            permanent_village: studentData.permanentAddress?.village || studentData.permanentVillage,
            permanent_ward: studentData.permanentAddress?.ward || studentData.permanentWard,
            
            // Contact
            mobile_student: studentData.mobileStudent || studentData.phone,
            guardian_mobile: studentData.guardianMobile,
            email: studentData.email || '',
            emergency_contact: studentData.emergencyContact,
            
            // Educational Background
            highest_exam: studentData.highestExam,
            board: studentData.board,
            group: studentData.group,
            roll_number: studentData.rollNumber,
            registration_number: studentData.registrationNumber,
            passing_year: studentData.passingYear,
            gpa: studentData.gpa,
            institution_name: studentData.institutionName || '',
            
            // Current Academic
            current_roll_number: studentData.currentRollNumber,
            current_registration_number: studentData.currentRegistrationNumber,
            semester: studentData.semester,
            department: studentData.department,
            session: studentData.session,
            shift: studentData.shift,
            current_group: studentData.currentGroup,
            
            // Additional Qualifications
            additional_qualifications: additionalQualifications.map(q => ({
                exam: q.exam,
                board: q.board,
                year: parseInt(q.year),
                gpa: parseFloat(q.gpa)
            })),
            
            status: studentData.status || 'active',
        };

        const response = await apiCall('/students/', {
            method: 'POST',
            body: JSON.stringify(backendData),
        });
        
        return response.data || response;
    },

    // Update student
    async update(id, updates) {
        // Convert field names
        const backendData = {};
        const fieldMapping = {
            fullNameBangla: 'full_name_bangla',
            fullNameEnglish: 'full_name_english',
            fatherName: 'father_name',
            fatherNID: 'father_nid',
            motherName: 'mother_name',
            motherNID: 'mother_nid',
            dateOfBirth: 'date_of_birth',
            birthCertificateNo: 'birth_certificate_no',
            nidNumber: 'nid_number',
            gender: 'gender',
            religion: 'religion',
            bloodGroup: 'blood_group',
            maritalStatus: 'marital_status',
            mobileStudent: 'mobile_student',
            phone: 'mobile_student',
            guardianMobile: 'guardian_mobile',
            email: 'email',
            emergencyContact: 'emergency_contact',
            currentRollNumber: 'current_roll_number',
            currentRegistrationNumber: 'current_registration_number',
            semester: 'semester',
            department: 'department',
            session: 'session',
            shift: 'shift',
            currentGroup: 'current_group',
            status: 'status',
        };

        for (const [frontendKey, backendKey] of Object.entries(fieldMapping)) {
            if (updates.hasOwnProperty(frontendKey)) {
                backendData[backendKey] = updates[frontendKey];
            }
        }

        // Handle address updates
        if (updates.presentAddress) {
            Object.assign(backendData, {
                present_division: updates.presentAddress.division,
                present_district: updates.presentAddress.district,
                present_sub_district: updates.presentAddress.subDistrict,
                present_police_station: updates.presentAddress.policeStation,
                present_post_office: updates.presentAddress.postOffice,
                present_municipality: updates.presentAddress.municipality,
                present_village: updates.presentAddress.village,
                present_ward: updates.presentAddress.ward,
            });
        }

        if (updates.permanentAddress) {
            Object.assign(backendData, {
                permanent_division: updates.permanentAddress.division,
                permanent_district: updates.permanentAddress.district,
                permanent_sub_district: updates.permanentAddress.subDistrict,
                permanent_police_station: updates.permanentAddress.policeStation,
                permanent_post_office: updates.permanentAddress.postOffice,
                permanent_municipality: updates.permanentAddress.municipality,
                permanent_village: updates.permanentAddress.village,
                permanent_ward: updates.permanentAddress.ward,
            });
        }

        const response = await apiCall(`/students/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(backendData),
        });
        
        return response.data || response;
    },

    // Delete student
    async delete(id) {
        return await apiCall(`/students/${id}/`, {
            method: 'DELETE',
        });
    },

    // Search students
    async search(query) {
        return await apiCall(`/students/search/?q=${encodeURIComponent(query)}`);
    },

    // Upload profile photo
    async uploadPhoto(id, photoFile) {
        const formData = new FormData();
        formData.append('photo', photoFile);

        return await apiCall(`/students/${id}/upload_photo/`, {
            method: 'POST',
            body: formData,
        });
    },
};

// Documents API
const documentsAPI = {
    // Get all documents
    async getAll(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = `/documents/${queryString ? `?${queryString}` : ''}`;
        const response = await apiCall(endpoint);
        return response.results || response;
    },

    // Get documents by student ID
    async getByStudentId(studentId) {
        return await apiCall(`/documents/?student_id=${studentId}`);
    },

    // Upload document
    async upload(studentId, file, documentType, description = '') {
        const formData = new FormData();
        formData.append('student', studentId);
        formData.append('file', file);
        formData.append('document_type', documentType);
        formData.append('description', description);

        return await apiCall('/documents/', {
            method: 'POST',
            body: formData,
        });
    },

    // Upload multiple documents
    async uploadMultiple(studentId, files, documentTypes, description = '') {
        const formData = new FormData();
        formData.append('student_id', studentId);
        formData.append('description', description);
        
        files.forEach(file => formData.append('files', file));
        documentTypes.forEach(type => formData.append('document_types', type));

        return await apiCall('/documents/upload_multiple/', {
            method: 'POST',
            body: formData,
        });
    },

    // Delete document
    async delete(id) {
        return await apiCall(`/documents/${id}/`, {
            method: 'DELETE',
        });
    },
};

// Applications API
const applicationsAPI = {
    // Get all applications
    async getAll(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = `/applications/${queryString ? `?${queryString}` : ''}`;
        const response = await apiCall(endpoint);
        return response.results || response;
    },

    // Get application by ID
    async getById(id) {
        return await apiCall(`/applications/${id}/`);
    },

    // Submit application
    async submit(applicationData) {
        const backendData = {
            full_name_bangla: applicationData.fullNameBangla,
            full_name_english: applicationData.fullNameEnglish,
            father_name: applicationData.fatherName,
            mother_name: applicationData.motherName,
            department: applicationData.department,
            session: applicationData.session,
            shift: applicationData.shift,
            roll_number: applicationData.rollNumber,
            registration_number: applicationData.registrationNumber,
            email: applicationData.email || '',
            application_type: applicationData.applicationType,
            subject: applicationData.subject,
            message: applicationData.message,
        };

        const response = await apiCall('/applications/', {
            method: 'POST',
            body: JSON.stringify(backendData),
        });
        
        return response.data || response;
    },

    // Approve application
    async approve(id, reviewedBy = 'Admin', notes = '') {
        return await apiCall(`/applications/${id}/approve/`, {
            method: 'POST',
            body: JSON.stringify({ reviewed_by: reviewedBy, notes }),
        });
    },

    // Reject application
    async reject(id, reviewedBy = 'Admin', notes = '') {
        return await apiCall(`/applications/${id}/reject/`, {
            method: 'POST',
            body: JSON.stringify({ reviewed_by: reviewedBy, notes }),
        });
    },

    // Delete application
    async delete(id) {
        return await apiCall(`/applications/${id}/`, {
            method: 'DELETE',
        });
    },
};

// Export API
window.api = {
    students: studentsAPI,
    documents: documentsAPI,
    applications: applicationsAPI,
    baseURL: API_BASE_URL,
};


