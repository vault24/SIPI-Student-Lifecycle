// editStudentPage.js
// Extracted from app.js

(function() {
    'use strict';

async function renderEditStudent(params) {
    // Show loading skeleton
    renderNavbar('Edit Student');
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="max-w-6xl mx-auto">
            <div class="bg-white rounded-xl shadow-sm p-6">
                <div class="flex items-center gap-4 mb-6">
                    <button onclick="navigateTo('/student/${params.id}')" class="text-gray-600 hover:text-gray-900">
                        <i data-lucide="arrow-left" class="w-6 h-6"></i>
                    </button>
                    <h2 class="text-2xl font-bold text-gray-900">Edit Student Information</h2>
                </div>
                <div class="animate-pulse space-y-4">
                    <div class="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div class="h-10 bg-gray-200 rounded"></div>
                    <div class="h-10 bg-gray-200 rounded"></div>
                    <div class="h-10 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();
    
    try {
        // Fetch student data from backend
        const student = await backendAPI.students.getById(params.id);
        
        if (!student) {
            showToast('Student not found', 'error');
            navigateTo('/students');
            return;
        }
        
        // Render the form with student data
        renderEditStudentForm(student, params.id);
    } catch (error) {
        mainContent.innerHTML = `
            <div class="max-w-6xl mx-auto">
                <div class="bg-white rounded-xl shadow-sm p-6">
                    <div class="text-center py-12">
                        <i data-lucide="alert-circle" class="w-16 h-16 text-red-500 mx-auto mb-4"></i>
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Failed to Load Student</h3>
                        <p class="text-gray-600 mb-4">${error.message || 'Unable to fetch student data'}</p>
                        <button onclick="renderEditStudent({id: '${params.id}'})" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        `;
        lucide.createIcons();
    }
}

function renderEditStudentForm(student, studentId) {
    renderNavbar('Edit Student');
    
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="max-w-6xl mx-auto">
            <div class="bg-white rounded-xl shadow-sm p-6">
                <div class="flex items-center gap-4 mb-6">
                    <button onclick="navigateTo('/student/${student.id}')" class="text-gray-600 hover:text-gray-900">
                        <i data-lucide="arrow-left" class="w-6 h-6"></i>
                    </button>
                    <h2 class="text-2xl font-bold text-gray-900">Edit Student Information</h2>
                </div>
                
                <form id="edit-student-form" class="space-y-8">
                    <!-- Personal Information -->
                    <div class="border-b border-gray-200 pb-6">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <i data-lucide="user" class="w-5 h-5 text-blue-600"></i>
                            Personal Information
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Full Name (Bangla) <span class="text-red-500">*</span></label>
                                <input type="text" id="fullNameBangla" value="${student?.full_name_bangla || student?.fullNameBangla || ''}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Full Name (English) <span class="text-red-500">*</span></label>
                                <input type="text" id="fullNameEnglish" value="${student?.full_name_english || student?.fullNameEnglish || student?.full_name || ''}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Father's Name <span class="text-red-500">*</span></label>
                                <input type="text" id="fatherName" value="${student?.father_name || student?.fatherName || ''}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Father's NID No <span class="text-red-500">*</span></label>
                                <input type="text" id="fatherNID" value="${student?.father_nid || student?.fatherNID || ''}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Mother's Name <span class="text-red-500">*</span></label>
                                <input type="text" id="motherName" value="${student?.mother_name || student?.motherName || ''}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Mother's NID No <span class="text-red-500">*</span></label>
                                <input type="text" id="motherNID" value="${student?.mother_nid || student?.motherNID || ''}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Date of Birth <span class="text-red-500">*</span></label>
                                <input type="date" id="dateOfBirth" value="${student?.date_of_birth || student?.dateOfBirth || ''}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Birth Certificate No <span class="text-red-500">*</span></label>
                                <input type="text" id="birthCertificateNo" value="${student?.birth_certificate_no || student?.birthCertificateNo || ''}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">NID (Optional)</label>
                                <input type="text" id="nidNumber" value="${student?.nid_number || student?.nidNumber || ''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Gender <span class="text-red-500">*</span></label>
                                <select id="gender" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="">Select Gender</option>
                                    <option value="Male" ${(student?.gender || student?.gender) === 'Male' ? 'selected' : ''}>Male</option>
                                    <option value="Female" ${(student?.gender || student?.gender) === 'Female' ? 'selected' : ''}>Female</option>
                                    <option value="Other" ${(student?.gender || student?.gender) === 'Other' ? 'selected' : ''}>Other</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Religion (Optional)</label>
                                <input type="text" id="religion" value="${student?.religion || ''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Blood Group (Optional)</label>
                                <select id="bloodGroup" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="">Select Blood Group</option>
                                    ${['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => `<option value="${bg}" ${(student?.blood_group || student?.bloodGroup) === bg ? 'selected' : ''}>${bg}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Marital Status (Optional)</label>
                                <select id="maritalStatus" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="">Select Status</option>
                                    ${['Single', 'Married', 'Divorced', 'Widowed'].map(ms => `<option value="${ms}" ${(student?.marital_status || student?.maritalStatus) === ms ? 'selected' : ''}>${ms}</option>`).join('')}
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Contact Information -->
                    <div class="border-b border-gray-200 pb-6">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <i data-lucide="phone" class="w-5 h-5 text-blue-600"></i>
                            Contact Information
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Mobile No (Student) <span class="text-red-500">*</span></label>
                                <input type="tel" id="mobileStudent" value="${student?.mobile_student || student?.mobileStudent || ''}" required pattern="[0-9]{11}" maxlength="11" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Guardian Mobile <span class="text-red-500">*</span></label>
                                <input type="tel" id="guardianMobile" value="${student?.guardian_mobile || student?.guardianMobile || ''}" required pattern="[0-9]{11}" maxlength="11" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
                                <input type="email" id="email" value="${student?.email || ''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Emergency Contact <span class="text-red-500">*</span></label>
                                <input type="text" id="emergencyContact" value="${student?.emergency_contact || student?.emergencyContact || ''}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                        </div>
                    </div>

                    <!-- Current Academic -->
                    <div class="border-b border-gray-200 pb-6">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <i data-lucide="book-open" class="w-5 h-5 text-blue-600"></i>
                            Current Academic Information
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Roll Number <span class="text-red-500">*</span></label>
                                <input type="text" id="currentRollNumber" value="${student?.current_roll_number || student?.currentRollNumber || ''}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Registration Number <span class="text-red-500">*</span></label>
                                <input type="text" id="currentRegistrationNumber" value="${student?.current_registration_number || student?.currentRegistrationNumber || ''}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Current Semester <span class="text-red-500">*</span></label>
                                <select id="semester" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    ${[1,2,3,4,5,6,7,8].map(s => `<option value="${s}" ${(student?.semester || student?.semester) === s ? 'selected' : ''}>Semester ${s}</option>`).join('')}
                                    <option value="alumni" ${(student?.status || student?.status) === 'graduated' ? 'selected' : ''}>Alumni (Graduated)</option>
                                </select>
                                ${(student?.semester_results && student?.semester_results.length >= 8) ? `
                                    <p class="text-xs text-green-600 mt-1">
                                        <i data-lucide="check-circle" class="w-3 h-3 inline"></i>
                                        Student has completed all 8 semesters. Select "Alumni" to transition.
                                    </p>
                                ` : ''}
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Department <span class="text-red-500">*</span></label>
                                <select id="department" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="">Loading departments...</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Session <span class="text-red-500">*</span></label>
                                <input type="text" id="session" value="${student?.session || ''}" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., 2023-2024">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Shift <span class="text-red-500">*</span></label>
                                <select id="shift" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="">Select Shift</option>
                                    <option value="Morning" ${(student?.shift || student?.shift) === 'Morning' ? 'selected' : ''}>Morning</option>
                                    <option value="Day" ${(student?.shift || student?.shift) === 'Day' ? 'selected' : ''}>Day</option>
                                    <option value="Evening" ${(student?.shift || student?.shift) === 'Evening' ? 'selected' : ''}>Evening</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Group <span class="text-red-500">*</span></label>
                                <select id="currentGroup" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="">Select Group</option>
                                    <option value="A" ${(student?.current_group || student?.currentGroup) === 'A' ? 'selected' : ''}>Group A</option>
                                    <option value="B" ${(student?.current_group || student?.currentGroup) === 'B' ? 'selected' : ''}>Group B</option>
                                    <option value="C" ${(student?.current_group || student?.currentGroup) === 'C' ? 'selected' : ''}>Group C</option>
                                    <option value="General" ${(student?.current_group || student?.currentGroup) === 'General' ? 'selected' : ''}>General</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Status <span class="text-red-500">*</span></label>
                                <select id="status" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="active" ${(student?.status || student?.status) === 'active' ? 'selected' : ''}>Active</option>
                                    <option value="inactive" ${(student?.status || student?.status) === 'inactive' ? 'selected' : ''}>Inactive</option>
                                    <option value="graduated" ${(student?.status || student?.status) === 'graduated' ? 'selected' : ''}>Graduated</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Semester Results -->
                    <div class="border-b border-gray-200 pb-6">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <i data-lucide="award" class="w-5 h-5 text-blue-600"></i>
                                Semester Results
                            </h3>
                            <button type="button" onclick="addSemesterResult()" class="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                <i data-lucide="plus-circle" class="w-4 h-4"></i>
                                Add Semester Result
                            </button>
                        </div>
                        <div id="semester-results" class="space-y-3">
                            ${(student?.semester_results || student?.semesterResults || []).map((result, index) => {
                                const hasReferred = (result?.referred_subjects || result?.referredSubjects) && (result?.referred_subjects || result?.referredSubjects).length > 0;
                                const ref1 = hasReferred ? ((result?.referred_subjects || result?.referredSubjects)[0] || '') : '';
                                const ref2 = hasReferred ? ((result?.referred_subjects || result?.referredSubjects)[1] || '') : '';
                                const ref3 = hasReferred ? ((result?.referred_subjects || result?.referredSubjects)[2] || '') : '';
                                return `
                                <div class="semester-result-item border ${hasReferred ? 'border-red-300 bg-red-50' : 'border-gray-200'} rounded-lg p-3">
                                    <div class="flex items-center gap-3 mb-3">
                                        <input type="number" name="result-semester" value="${result?.semester || ''}" placeholder="Semester" min="1" max="8" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-32">
                                        <label class="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" name="result-is-referred" ${hasReferred ? 'checked' : ''} onchange="toggleReferredFields(this)" class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500">
                                            <span class="text-sm font-medium ${hasReferred ? 'text-red-700' : 'text-gray-700'}">Referred</span>
                                        </label>
                                        <button type="button" onclick="this.closest('.semester-result-item').remove()" class="ml-auto text-red-600 hover:text-red-700 text-sm font-medium">
                                            Remove
                                        </button>
                                    </div>
                                    
                                    <!-- GPA/CGPA Fields (shown when NOT referred) -->
                                    <div class="gpa-fields ${hasReferred ? 'hidden' : ''} grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label class="block text-xs font-medium text-gray-600 mb-1">GPA</label>
                                            <input type="text" name="result-gpa" value="${result?.gpa || ''}" placeholder="e.g., 3.75" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                                        </div>
                                        <div>
                                            <label class="block text-xs font-medium text-gray-600 mb-1">CGPA</label>
                                            <input type="text" name="result-cgpa" value="${result?.cgpa || ''}" placeholder="e.g., 3.80" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                                        </div>
                                    </div>
                                    
                                    <!-- Referred Subject Fields (shown when referred) -->
                                    <div class="referred-fields ${hasReferred ? '' : 'hidden'} space-y-2">
                                        <div>
                                            <label class="block text-xs font-medium text-red-700 mb-1">Referred Subject 1 <span class="text-red-500">*</span></label>
                                            <input type="text" name="result-ref-1" value="${ref1}" placeholder="e.g., Mathematics" class="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm bg-white">
                                        </div>
                                        <div>
                                            <label class="block text-xs font-medium text-red-700 mb-1">Referred Subject 2</label>
                                            <input type="text" name="result-ref-2" value="${ref2}" placeholder="e.g., Physics" class="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm bg-white">
                                        </div>
                                        <div>
                                            <label class="block text-xs font-medium text-red-700 mb-1">Referred Subject 3</label>
                                            <input type="text" name="result-ref-3" value="${ref3}" placeholder="e.g., Chemistry" class="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm bg-white">
                                        </div>
                                    </div>
                                </div>
                            `}).join('')}
                        </div>
                    </div>

                    <!-- Semester Attendance -->
                    <div class="border-b border-gray-200 pb-6">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <i data-lucide="calendar-check" class="w-5 h-5 text-green-600"></i>
                                Semester Attendance
                            </h3>
                            <button type="button" onclick="addSemesterAttendance()" class="text-sm text-green-600 hover:text-green-700 flex items-center gap-1">
                                <i data-lucide="plus-circle" class="w-4 h-4"></i>
                                Add Semester Attendance
                            </button>
                        </div>
                        <div id="semester-attendance" class="space-y-4">
                            ${(student?.semester_attendance || student?.semesterAttendance || []).map((attendance, index) => `
                                <div class="semester-attendance-item border border-gray-200 rounded-lg p-4">
                                    <div class="flex items-center justify-between mb-3">
                                        <input type="number" name="attendance-semester" value="${attendance?.semester || ''}" placeholder="Semester" min="1" max="8" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm w-32">
                                        <button type="button" onclick="this.closest('.semester-attendance-item').remove()" class="text-red-600 hover:text-red-700 text-sm font-medium">
                                            Remove Semester
                                        </button>
                                    </div>
                                    <div class="space-y-2 attendance-subjects-container">
                                        ${(attendance?.subjects || []).map((subject, subIndex) => `
                                            <div class="attendance-subject-item grid grid-cols-1 md:grid-cols-4 gap-2 p-2 bg-gray-50 rounded">
                                                <input type="text" name="subject-name" value="${subject?.name || ''}" placeholder="Subject Name" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm">
                                                <input type="number" name="subject-present" value="${subject?.present || ''}" placeholder="Present" min="0" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm">
                                                <input type="number" name="subject-total" value="${subject?.total || ''}" placeholder="Total Classes" min="1" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm">
                                                <button type="button" onclick="this.closest('.attendance-subject-item').remove()" class="text-red-600 hover:text-red-700 text-xs font-medium">
                                                    Remove
                                                </button>
                                            </div>
                                        `).join('')}
                                    </div>
                                    <button type="button" onclick="addSubjectToAttendance(this)" class="mt-2 text-xs text-green-600 hover:text-green-700 flex items-center gap-1">
                                        <i data-lucide="plus" class="w-3 h-3"></i>
                                        Add Subject
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Form Actions -->
                    <div class="flex gap-4 justify-end pt-4">
                        <button type="button" onclick="navigateTo('/student/${student.id}')" class="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button type="submit" class="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2">
                            <i data-lucide="save" class="w-5 h-5"></i>
                            Update Student
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    lucide.createIcons();
    
    // Extract department ID from the student object
    // The backend returns department as a nested object, so we need to extract the ID
    let currentDepartmentId = null;
    if (student.department) {
        if (typeof student.department === 'object' && student.department.id) {
            currentDepartmentId = student.department.id;
        } else if (typeof student.department === 'string') {
            currentDepartmentId = student.department;
        }
    }
    
    // Load departments
    loadDepartmentsForEdit(currentDepartmentId);
    
    // Handle form submission
    document.getElementById('edit-student-form').addEventListener('submit', (e) => handleEditStudent(e, studentId));
}

// Load departments for the dropdown
async function loadDepartmentsForEdit(currentDepartment) {
    try {
        const departments = await backendAPI.departments.getAll();
        const departmentSelect = document.getElementById('department');
        
        if (departments && departments.length > 0) {
            departmentSelect.innerHTML = departments.map(dept => {
                const deptName = dept?.name || dept?.department_name || '';
                let deptId = dept?.id || '';
                
                // Ensure deptId is a string
                if (typeof deptId === 'object') {
                    deptId = deptId?.toString() || '';
                }
                deptId = String(deptId).trim();
                
                // Check if this is the current department (by ID or name)
                const isSelected = (currentDepartment === deptId || currentDepartment === deptName || currentDepartment?.id === deptId);
                return `<option value="${deptId}" data-id="${deptId}" ${isSelected ? 'selected' : ''}>${deptName}</option>`;
            }).join('');
        } else {
            departmentSelect.innerHTML = `<option value="${currentDepartment}" selected>${currentDepartment}</option>`;
        }
    } catch (error) {
        console.error('Failed to load departments:', error);
        const departmentSelect = document.getElementById('department');
        departmentSelect.innerHTML = `<option value="${currentDepartment}" selected>${currentDepartment}</option>`;
    }
}

// Add semester result function
function addSemesterResult() {
    const container = document.getElementById('semester-results');
    const resultHtml = `
        <div class="semester-result-item border border-gray-200 rounded-lg p-3">
            <div class="flex items-center gap-3 mb-3">
                <input type="number" name="result-semester" placeholder="Semester" min="1" max="8" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-32">
                <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="result-is-referred" onchange="toggleReferredFields(this)" class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500">
                    <span class="text-sm font-medium text-gray-700">Referred</span>
                </label>
                <button type="button" onclick="this.closest('.semester-result-item').remove()" class="ml-auto text-red-600 hover:text-red-700 text-sm font-medium">
                    Remove
                </button>
            </div>
            
            <!-- GPA/CGPA Fields (shown when NOT referred) -->
            <div class="gpa-fields grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">GPA</label>
                    <input type="text" name="result-gpa" placeholder="e.g., 3.75" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">CGPA</label>
                    <input type="text" name="result-cgpa" placeholder="e.g., 3.80" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                </div>
            </div>
            
            <!-- Referred Subject Fields (hidden by default) -->
            <div class="referred-fields hidden space-y-2">
                <div>
                    <label class="block text-xs font-medium text-red-700 mb-1">Referred Subject 1 <span class="text-red-500">*</span></label>
                    <input type="text" name="result-ref-1" placeholder="e.g., Mathematics" class="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm bg-white">
                </div>
                <div>
                    <label class="block text-xs font-medium text-red-700 mb-1">Referred Subject 2</label>
                    <input type="text" name="result-ref-2" placeholder="e.g., Physics" class="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm bg-white">
                </div>
                <div>
                    <label class="block text-xs font-medium text-red-700 mb-1">Referred Subject 3</label>
                    <input type="text" name="result-ref-3" placeholder="e.g., Chemistry" class="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm bg-white">
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', resultHtml);
}

// Toggle referred fields based on checkbox
function toggleReferredFields(checkbox) {
    const resultItem = checkbox.closest('.semester-result-item');
    const gpaFields = resultItem.querySelector('.gpa-fields');
    const referredFields = resultItem.querySelector('.referred-fields');
    const referredLabel = checkbox.nextElementSibling;
    
    if (checkbox.checked) {
        // Show referred fields, hide GPA/CGPA
        gpaFields.classList.add('hidden');
        referredFields.classList.remove('hidden');
        resultItem.classList.remove('border-gray-200');
        resultItem.classList.add('border-red-300', 'bg-red-50');
        referredLabel.classList.remove('text-gray-700');
        referredLabel.classList.add('text-red-700');
        
        // Clear GPA/CGPA values
        const gpaInput = gpaFields.querySelector('[name="result-gpa"]');
        const cgpaInput = gpaFields.querySelector('[name="result-cgpa"]');
        if (gpaInput) gpaInput.value = '';
        if (cgpaInput) cgpaInput.value = '';
    } else {
        // Show GPA/CGPA, hide referred fields
        gpaFields.classList.remove('hidden');
        referredFields.classList.add('hidden');
        resultItem.classList.remove('border-red-300', 'bg-red-50');
        resultItem.classList.add('border-gray-200');
        referredLabel.classList.remove('text-red-700');
        referredLabel.classList.add('text-gray-700');
        
        // Clear referred subject values
        const ref1 = referredFields.querySelector('[name="result-ref-1"]');
        const ref2 = referredFields.querySelector('[name="result-ref-2"]');
        const ref3 = referredFields.querySelector('[name="result-ref-3"]');
        if (ref1) ref1.value = '';
        if (ref2) ref2.value = '';
        if (ref3) ref3.value = '';
    }
}

// Add semester attendance function
function addSemesterAttendance() {
    const container = document.getElementById('semester-attendance');
    const attendanceHtml = `
        <div class="semester-attendance-item border border-gray-200 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
                <input type="number" name="attendance-semester" placeholder="Semester" min="1" max="8" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm w-32">
                <button type="button" onclick="this.closest('.semester-attendance-item').remove()" class="text-red-600 hover:text-red-700 text-sm font-medium">
                    Remove Semester
                </button>
            </div>
            <div class="space-y-2 attendance-subjects-container">
                <div class="attendance-subject-item grid grid-cols-1 md:grid-cols-4 gap-2 p-2 bg-gray-50 rounded">
                    <input type="text" name="subject-name" placeholder="Subject Name" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm">
                    <input type="number" name="subject-present" placeholder="Present" min="0" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm">
                    <input type="number" name="subject-total" placeholder="Total Classes" min="1" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm">
                    <button type="button" onclick="this.closest('.attendance-subject-item').remove()" class="text-red-600 hover:text-red-700 text-xs font-medium">
                        Remove
                    </button>
                </div>
            </div>
            <button type="button" onclick="addSubjectToAttendance(this)" class="mt-2 text-xs text-green-600 hover:text-green-700 flex items-center gap-1">
                <i data-lucide="plus" class="w-3 h-3"></i>
                Add Subject
            </button>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', attendanceHtml);
    lucide.createIcons();
}

// Add subject to attendance
function addSubjectToAttendance(button) {
    const container = button.previousElementSibling;
    const subjectHtml = `
        <div class="attendance-subject-item grid grid-cols-1 md:grid-cols-4 gap-2 p-2 bg-gray-50 rounded">
            <input type="text" name="subject-name" placeholder="Subject Name" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm">
            <input type="number" name="subject-present" placeholder="Present" min="0" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm">
            <input type="number" name="subject-total" placeholder="Total Classes" min="1" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm">
            <button type="button" onclick="this.closest('.attendance-subject-item').remove()" class="text-red-600 hover:text-red-700 text-xs font-medium">
                Remove
            </button>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', subjectHtml);
}

async function handleEditStudent(e, studentId) {
    e.preventDefault();
    
    // Disable submit button and show loading state
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = `
        <svg class="animate-spin h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Updating...
    `;
    
    try {
        // Get current student data
        const currentStudent = await backendAPI.students.getById(studentId);
        const currentSemester = currentStudent.semester;
    
    // Collect semester results
    const semesterResults = [];
    let highestCompletedSemester = 0;
    document.querySelectorAll('.semester-result-item').forEach(item => {
        const semester = item.querySelector('[name="result-semester"]')?.value;
        const isReferred = item.querySelector('[name="result-is-referred"]')?.checked || false;
        
        if (semester) {
            const semesterNum = parseInt(semester);
            
            if (isReferred) {
                // Collect referred subjects from individual fields
                const ref1 = item.querySelector('[name="result-ref-1"]')?.value?.trim() || '';
                const ref2 = item.querySelector('[name="result-ref-2"]')?.value?.trim() || '';
                const ref3 = item.querySelector('[name="result-ref-3"]')?.value?.trim() || '';
                
                const referredSubjects = [ref1, ref2, ref3].filter(s => s.length > 0);
                
                // Only add if at least one referred subject is provided
                if (referredSubjects.length > 0) {
                    semesterResults.push({ 
                        semester: semesterNum, 
                        gpa: 0, // Set GPA to 0 for referred semesters
                        cgpa: null,
                        referredSubjects: referredSubjects
                    });
                }
            } else {
                // Collect GPA/CGPA
                const gpa = item.querySelector('[name="result-gpa"]')?.value;
                const cgpa = item.querySelector('[name="result-cgpa"]')?.value;
                
                if (gpa) {
                    semesterResults.push({ 
                        semester: semesterNum, 
                        gpa: parseFloat(gpa), 
                        cgpa: cgpa ? parseFloat(cgpa) : null,
                        referredSubjects: []
                    });
                    // Track highest completed semester (only for passed semesters)
                    if (semesterNum > highestCompletedSemester) {
                        highestCompletedSemester = semesterNum;
                    }
                }
            }
        }
    });
    
    // Collect semester attendance
    const semesterAttendance = [];
    document.querySelectorAll('.semester-attendance-item').forEach(item => {
        const semester = item.querySelector('[name="attendance-semester"]')?.value;
        if (semester) {
            const subjects = [];
            let totalPresent = 0;
            let totalClasses = 0;
            
            item.querySelectorAll('.attendance-subject-item').forEach(subjectItem => {
                const name = subjectItem.querySelector('[name="subject-name"]')?.value;
                const present = subjectItem.querySelector('[name="subject-present"]')?.value;
                const total = subjectItem.querySelector('[name="subject-total"]')?.value;
                
                if (name && present && total) {
                    const presentNum = parseInt(present);
                    const totalNum = parseInt(total);
                    const percentage = totalNum > 0 ? ((presentNum / totalNum) * 100).toFixed(2) : 0;
                    
                    subjects.push({
                        name: name,
                        present: presentNum,
                        total: totalNum,
                        percentage: parseFloat(percentage)
                    });
                    
                    totalPresent += presentNum;
                    totalClasses += totalNum;
                }
            });
            
            // Calculate average attendance
            const averageAttendance = totalClasses > 0 ? (totalPresent / totalClasses) * 100 : 0;
            
            if (subjects.length > 0) {
                semesterAttendance.push({
                    semester: parseInt(semester),
                    subjects: subjects,
                    averageAttendance: parseFloat(averageAttendance.toFixed(2))
                });
            }
        }
    });
    
        // Check if Alumni is selected
        const semesterValue = document.getElementById('semester').value;
        
        if (semesterValue === 'alumni') {
            // User selected Alumni - trigger transition
            // Check if all 8 semesters are present in the form data
            const completedSemesters = new Set(semesterResults.map(r => r.semester));
            const hasAllSemesters = [1, 2, 3, 4, 5, 6, 7, 8].every(sem => completedSemesters.has(sem));
            
            if (!hasAllSemesters) {
                showToast('Cannot transition to Alumni: Student must have results for all 8 semesters', 'error');
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
                return;
            }
            
            // Show confirmation and transition
            showConfirmModal({
                title: 'Transition to Alumni',
                message: `Are you sure you want to transition ${currentStudent.full_name_english || currentStudent.full_name} to Alumni status? This will mark them as graduated and create an alumni record with all their data preserved.`,
                confirmText: 'Transition to Alumni',
                type: 'info',
                onConfirm: async () => {
                    try {
                        const currentYear = new Date().getFullYear();
                        await backendAPI.students.transitionToAlumni(studentId, currentYear);
                        showToast(`${currentStudent.full_name_english || currentStudent.full_name} has been successfully transitioned to Alumni!`, 'success');
                        
                        // Redirect to alumni page
                        setTimeout(() => {
                            navigateTo('/alumni');
                        }, 1500);
                    } catch (error) {
                        showToast(error.message || 'Failed to transition to alumni', 'error');
                        submitButton.disabled = false;
                        submitButton.innerHTML = originalButtonText;
                    }
                }
            });
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
            return; // Don't continue with normal update
        }
    
        // Auto-increment semester if new result added for current semester
        let newSemester = parseInt(semesterValue);
        
        // Check if user added a result for the current semester
        const hasNewResultForCurrentSemester = semesterResults.some(result => result.semester === currentSemester);
        
        // Check if this is a new result (wasn't in the original data)
        const originalResults = currentStudent.semester_results || [];
        const hadResultForCurrentSemester = originalResults.some(result => result.semester === currentSemester);
        
        // If user just added a result for current semester, increment to next semester
        if (hasNewResultForCurrentSemester && !hadResultForCurrentSemester && highestCompletedSemester === currentSemester) {
            newSemester = Math.min(currentSemester + 1, 8); // Max semester is 8
            showToast(`Semester auto-incremented to ${newSemester}`, 'info');
        }
        
        // Prepare update data with camelCase for backend (Django model uses camelCase)
        // Get department ID from the selected option
        const departmentSelect = document.getElementById('department');
        const departmentOption = departmentSelect.options[departmentSelect.selectedIndex];
        let departmentId = departmentOption?.value;
        
        // Ensure departmentId is a string, not an object
        if (typeof departmentId === 'object') {
            departmentId = departmentId?.id || '';
        }
        departmentId = String(departmentId).trim();
        
        console.log('Department ID being sent:', departmentId, 'Type:', typeof departmentId);
        
        const updates = {
            fullNameBangla: document.getElementById('fullNameBangla').value,
            fullNameEnglish: document.getElementById('fullNameEnglish').value,
            fatherName: document.getElementById('fatherName').value,
            fatherNID: document.getElementById('fatherNID').value,
            motherName: document.getElementById('motherName').value,
            motherNID: document.getElementById('motherNID').value,
            dateOfBirth: document.getElementById('dateOfBirth').value,
            birthCertificateNo: document.getElementById('birthCertificateNo').value,
            nidNumber: document.getElementById('nidNumber').value || null,
            gender: document.getElementById('gender').value,
            religion: document.getElementById('religion').value || null,
            bloodGroup: document.getElementById('bloodGroup').value || null,
            maritalStatus: document.getElementById('maritalStatus').value || null,
            mobileStudent: document.getElementById('mobileStudent').value,
            guardianMobile: document.getElementById('guardianMobile').value,
            email: document.getElementById('email').value || null,
            emergencyContact: document.getElementById('emergencyContact').value,
            currentRollNumber: document.getElementById('currentRollNumber').value,
            currentRegistrationNumber: document.getElementById('currentRegistrationNumber').value,
            semester: newSemester,
            department: departmentId,  // Send department ID as string
            session: document.getElementById('session').value,
            shift: document.getElementById('shift').value,
            currentGroup: document.getElementById('currentGroup').value,
            status: document.getElementById('status').value,
            semesterResults: semesterResults,
            semesterAttendance: semesterAttendance,
            // Include educational background fields from current student (these don't change in edit form)
            highestExam: currentStudent?.highestExam || currentStudent?.highest_exam || '',
            board: currentStudent?.board || '',
            group: currentStudent?.group || '',
            rollNumber: currentStudent?.rollNumber || currentStudent?.roll_number || '',
            registrationNumber: currentStudent?.registrationNumber || currentStudent?.registration_number || '',
            passingYear: currentStudent?.passingYear || currentStudent?.passing_year || new Date().getFullYear(),
            gpa: currentStudent?.gpa || 0,
            institutionName: currentStudent?.institutionName || currentStudent?.institution_name || '',
            presentAddress: currentStudent?.presentAddress || currentStudent?.present_address || {},
            permanentAddress: currentStudent?.permanentAddress || currentStudent?.permanent_address || {},
            enrollmentDate: currentStudent?.enrollmentDate || currentStudent?.enrollment_date || new Date().toISOString().split('T')[0]
        };
        
        // Debug: Log the updates being sent
        console.log('Sending updates to backend:', updates);
        console.log('Department ID type:', typeof updates.department, 'Value:', updates.department);
        
        // Update student via backend API
        await backendAPI.students.update(studentId, updates);
        
        if (newSemester !== currentSemester) {
            showToast(`Semester auto-incremented to ${newSemester}`, 'info');
        }
        showToast('Student updated successfully!', 'success');
        
        // Redirect to student details page
        setTimeout(() => {
            navigateTo(`/student/${studentId}`);
        }, 1000);
        
    } catch (error) {
        console.error('Failed to update student:', error);
        console.error('Error details:', error.details);
        console.error('Error status:', error.status);
        
        // Show detailed error message
        let errorMsg = error.message || 'Failed to update student';
        if (error.details) {
            // If backend returned field-specific errors
            if (typeof error.details === 'object') {
                const fieldErrors = Object.entries(error.details)
                    .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
                    .join('\n');
                errorMsg = fieldErrors || errorMsg;
            }
        }
        
        showToast(errorMsg, 'error');
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
}

function uploadDocument(studentId) {
    showFormModal({
        title: 'Upload Document',
        fields: [
            { id: 'category', label: 'Document Category', type: 'select', required: true, options: [
                { value: 'NID', label: 'NID' },
                { value: 'Marksheet', label: 'Marksheet' },
                { value: 'Certificate', label: 'Certificate' },
                { value: 'Attendance Sheet', label: 'Attendance Sheet' },
                { value: 'Other', label: 'Other' }
            ]},
            { id: 'file', label: 'Select File', type: 'file', required: true, accept: '.pdf,.jpg,.jpeg,.png' }
        ],
        onSubmit: (formData) => {
            const document = {
                studentId: studentId,
                fileName: formData.file.name,
                fileType: formData.file.type,
                category: formData.category,
                fileSize: formData.file.size,
                fileUrl: '#'
            };
            
            if (dataManager.addDocument(document)) {
                showToast('Document uploaded successfully', 'success');
                renderStudentDetails({ id: studentId });
            } else {
                showToast('Failed to upload document', 'error');
            }
        }
    });
}

// Download Options Modal
function showDownloadOptions(studentId) {
    const student = dataManager.getStudent(studentId);
    const documents = dataManager.getDocuments(studentId);
    
    const modalId = generateUUID();
    const container = document.getElementById('modal-container');
    
    const modal = document.createElement('div');
    modal.id = `modal-${modalId}`;
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop';
    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6 fade-in">
            <h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <i data-lucide="download" class="w-5 h-5 text-blue-600"></i>
                Download Student Data
            </h3>
            <p class="text-sm text-gray-600 mb-4">Select what you want to download for <strong>${student.fullName}</strong>:</p>
            
            <div class="space-y-2 mb-6">
                <button onclick="downloadStudentInfo('${studentId}')" class="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <i data-lucide="user" class="w-5 h-5 text-blue-600"></i>
                        </div>
                        <div class="text-left">
                            <div class="font-medium text-gray-900">Student Information</div>
                            <div class="text-xs text-gray-500">Personal, contact, and academic details</div>
                        </div>
                    </div>
                    <i data-lucide="chevron-right" class="w-5 h-5 text-gray-400"></i>
                </button>
                
                <button onclick="downloadDocumentsList('${studentId}')" class="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <i data-lucide="file-text" class="w-5 h-5 text-purple-600"></i>
                        </div>
                        <div class="text-left">
                            <div class="font-medium text-gray-900">Documents List</div>
                            <div class="text-xs text-gray-500">${documents.length} documents metadata</div>
                        </div>
                    </div>
                    <i data-lucide="chevron-right" class="w-5 h-5 text-gray-400"></i>
                </button>
                
                <button onclick="downloadTestimonial('${studentId}')" class="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <i data-lucide="award" class="w-5 h-5 text-green-600"></i>
                        </div>
                        <div class="text-left">
                            <div class="font-medium text-gray-900">Testimonial Data</div>
                            <div class="text-xs text-gray-500">Academic records and achievements</div>
                        </div>
                    </div>
                    <i data-lucide="chevron-right" class="w-5 h-5 text-gray-400"></i>
                </button>
                
                <button onclick="downloadCompleteProfile('${studentId}')" class="w-full flex items-center justify-between p-4 border-2 border-blue-500 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <i data-lucide="package" class="w-5 h-5 text-white"></i>
                        </div>
                        <div class="text-left">
                            <div class="font-medium text-gray-900">Complete Profile</div>
                            <div class="text-xs text-gray-500">All data including documents</div>
                        </div>
                    </div>
                    <i data-lucide="chevron-right" class="w-5 h-5 text-gray-400"></i>
                </button>
            </div>
            
            <button onclick="closeModal('${modalId}')" class="w-full px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                Cancel
            </button>
        </div>
    `;
    
    container.appendChild(modal);
    lucide.createIcons();
}

// Download Functions
function downloadStudentInfo(studentId) {
    const student = dataManager.getStudent(studentId);
    const data = {
        'Personal Information': {
            'Full Name (Bangla)': student.fullNameBangla || 'N/A',
            'Full Name (English)': student.fullNameEnglish || student.fullName,
            'Father Name': student.fatherName || 'N/A',
            'Father NID': student.fatherNID || 'N/A',
            'Mother Name': student.motherName || 'N/A',
            'Mother NID': student.motherNID || 'N/A',
            'Date of Birth': student.dateOfBirth,
            'Birth Certificate No': student.birthCertificateNo || 'N/A',
            'NID': student.nidNumber || 'N/A',
            'Gender': student.gender || 'N/A',
            'Religion': student.religion || 'N/A',
            'Blood Group': student.bloodGroup || 'N/A',
            'Marital Status': student.maritalStatus || 'N/A'
        },
        'Contact Information': {
            'Mobile (Student)': student.mobileStudent || student.phone,
            'Guardian Mobile': student.guardianMobile || 'N/A',
            'Email': student.email || 'N/A',
            'Emergency Contact': student.emergencyContact || 'N/A'
        },
        'Current Academic': {
            'Roll Number': student.currentRollNumber || student.rollNumber,
            'Registration Number': student.currentRegistrationNumber || student.registrationNumber,
            'Semester': student.semester,
            'Department': student.department,
            'Session': student.session || 'N/A',
            'Shift': student.shift || 'N/A',
            'Group': student.currentGroup || 'N/A',
            'Status': student.status
        }
    };
    
    utils.downloadJSON(data, `Student_Info_${student.rollNumber}.json`);
    showToast('Student information downloaded', 'success');
    closeModal(document.querySelector('[id^="modal-"]')?.id.replace('modal-', ''));
}

function downloadDocumentsList(studentId) {
    const student = dataManager.getStudent(studentId);
    const documents = dataManager.getDocuments(studentId);
    
    const data = documents.map(doc => ({
        'File Name': doc.fileName,
        'Category': doc.category,
        'File Type': doc.fileType,
        'File Size': formatFileSize(doc.fileSize),
        'Upload Date': formatDate(doc.uploadDate, 'long')
    }));
    
    utils.downloadJSON(data, `Documents_List_${student.rollNumber}.json`);
    showToast('Documents list downloaded', 'success');
    closeModal(document.querySelector('[id^="modal-"]')?.id.replace('modal-', ''));
}

function downloadTestimonial(studentId) {
    const student = dataManager.getStudent(studentId);
    const marks = dataManager.getMarks(studentId);
    const attendance = dataManager.getAttendance(studentId);
    
    const data = {
        'Student Information': {
            'Name': student.fullName,
            'Roll Number': student.rollNumber,
            'Registration Number': student.registrationNumber,
            'Department': student.department,
            'Session': student.session || 'N/A',
            'Enrollment Date': formatDate(student.enrollmentDate, 'long')
        },
        'Academic Performance': {
            'Current Semester': student.semester,
            'Semester Results': student.semesterResults || [],
            'Overall Status': student.status
        },
        'Marks Records': marks.length,
        'Attendance Records': attendance.length
    };
    
    utils.downloadJSON(data, `Testimonial_${student.rollNumber}.json`);
    showToast('Testimonial data downloaded', 'success');
    closeModal(document.querySelector('[id^="modal-"]')?.id.replace('modal-', ''));
}

function downloadCompleteProfile(studentId) {
    const student = dataManager.getStudent(studentId);
    const documents = dataManager.getDocuments(studentId);
    const marks = dataManager.getMarks(studentId);
    const attendance = dataManager.getAttendance(studentId);
    
    const data = {
        student: student,
        documents: documents,
        marks: marks,
        attendance: attendance
    };
    
    utils.downloadJSON(data, `Complete_Profile_${student.rollNumber}.json`);
    showToast('Complete profile downloaded', 'success');
    closeModal(document.querySelector('[id^="modal-"]')?.id.replace('modal-', ''));
}

// Toggle collapsible section
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const icon = document.getElementById(`${sectionId}-icon`);
    
    if (section.style.display === 'none') {
        section.style.display = 'block';
        icon.style.transform = 'rotate(0deg)';
    } else {
        section.style.display = 'none';
        icon.style.transform = 'rotate(-90deg)';
    }
}

// Transition student to alumni
function transitionStudentToAlumni(studentId) {
    const student = dataManager.getStudent(studentId);
    
    if (!student) {
        showToast('Student not found', 'error');
        return;
    }
    
    // Check if already an alumni
    if (dataManager.getAlumniByStudentId(studentId)) {
        showToast('Student is already an alumni', 'warning');
        return;
    }
    
    // Check if eligible
    if (!dataManager.hasCompletedEighthSemester(studentId)) {
        showToast('Student has not completed all 8 semesters', 'error');
        return;
    }
    
    showConfirmModal({
        title: 'Transition to Alumni',
        message: `Are you sure you want to transition ${student.fullName} to Alumni status? This will mark them as graduated and create an alumni record with all their student data preserved.`,
        confirmText: 'Transition to Alumni',
        type: 'info',
        onConfirm: () => {
            try {
                const alumniRecord = dataManager.transitionToAlumni(studentId);
                showToast(`${student.fullName} has been successfully transitioned to Alumni!`, 'success');
                
                // Redirect to alumni details page
                setTimeout(() => {
                    navigateTo(`/alumni/${alumniRecord.id}`);
                }, 1500);
            } catch (error) {
                showToast(error.message, 'error');
            }
        }
    });
}

// Update Semester Results
function updateSemesterResults(studentId) {
    const student = dataManager.getStudent(studentId);
    if (!student) {
        showToast('Student not found', 'error');
        return;
    }
    navigateTo(`/edit-student/${studentId}`);
    setTimeout(() => {
        const resultsSection = document.querySelector('[onclick*="addSemesterResult"]');
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            resultsSection.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2');
            setTimeout(() => {
                resultsSection.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2');
            }, 2000);
        }
    }, 500);
}

// Update Semester Attendance
function updateSemesterAttendance(studentId) {
    const student = dataManager.getStudent(studentId);
    if (!student) {
        showToast('Student not found', 'error');
        return;
    }
    navigateTo(`/edit-student/${studentId}`);
    setTimeout(() => {
        const attendanceSection = document.querySelector('[onclick*="addSemesterAttendance"]');
        if (attendanceSection) {
            attendanceSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            attendanceSection.classList.add('ring-2', 'ring-green-500', 'ring-offset-2');
            setTimeout(() => {
                attendanceSection.classList.remove('ring-2', 'ring-green-500', 'ring-offset-2');
            }, 2000);
        }
    }, 500);
}

// View Document (live preview without download)
function viewDocument(documentId) {
    const doc = dataManager.getDocuments().find(d => d.id === documentId);
    if (!doc) {
        showToast('Document not found', 'error');
        return;
    }
    
    const modalId = generateUUID();
    const container = document.getElementById('modal-container');
    
    const modal = document.createElement('div');
    modal.id = `modal-${modalId}`;
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop';
    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
            <div class="flex items-center justify-between p-4 border-b border-gray-200">
                <div class="flex items-center gap-3">
                    <i data-lucide="file-text" class="w-5 h-5 text-blue-600"></i>
                    <div>
                        <h3 class="font-semibold text-gray-900">${doc.fileName}</h3>
                        <p class="text-xs text-gray-500">${doc.category} â€¢ ${formatFileSize(doc.fileSize)}</p>
                    </div>
                </div>
                <button onclick="closeModal('${modalId}')" class="text-gray-400 hover:text-gray-600">
                    <i data-lucide="x" class="w-6 h-6"></i>
                </button>
            </div>
            <div class="flex-1 overflow-hidden bg-gray-100">
                ${doc.fileType.includes('pdf') ? `
                    <iframe src="${doc.fileUrl}" class="w-full h-full" frameborder="0"></iframe>
                ` : doc.fileType.includes('image') ? `
                    <div class="w-full h-full flex items-center justify-center p-4">
                        <img src="${doc.fileUrl}" alt="${doc.fileName}" class="max-w-full max-h-full object-contain">
                    </div>
                ` : `
                    <div class="w-full h-full flex items-center justify-center p-8">
                        <div class="text-center">
                            <i data-lucide="file" class="w-16 h-16 mx-auto mb-4 text-gray-400"></i>
                            <p class="text-gray-600 mb-4">Preview not available for this file type</p>
                            <a href="${doc.fileUrl}" download="${doc.fileName}" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg inline-flex items-center gap-2">
                                <i data-lucide="download" class="w-4 h-4"></i>
                                Download File
                            </a>
                        </div>
                    </div>
                `}
            </div>
            <div class="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
                <div class="text-sm text-gray-600">
                    Uploaded: ${formatDate(doc.uploadDate, 'long')}
                </div>
                <div class="flex gap-2">
                    <a href="${doc.fileUrl}" download="${doc.fileName}" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg inline-flex items-center gap-2 text-sm">
                        <i data-lucide="download" class="w-4 h-4"></i>
                        Download
                    </a>
                    <button onclick="closeModal('${modalId}')" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm">
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(modal);
    lucide.createIcons();
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modalId);
        }
    });
}

// Helper function for navigation to edit student page
function editStudent(studentId) {
    navigateTo(`/edit-student/${studentId}`);
}

// Export helper functions that are used by this page
window.editStudent = editStudent;
window.toggleSection = toggleSection;
window.uploadDocument = uploadDocument;
window.transitionStudentToAlumni = transitionStudentToAlumni;
window.addSemesterResult = addSemesterResult;
window.addSemesterAttendance = addSemesterAttendance;
window.updateSemesterResults = updateSemesterResults;
window.updateSemesterAttendance = updateSemesterAttendance;
window.viewDocument = viewDocument;
window.addSubjectToAttendance = addSubjectToAttendance;
window.showDownloadOptions = showDownloadOptions;
window.downloadStudentInfo = downloadStudentInfo;
window.downloadDocumentsList = downloadDocumentsList;
window.downloadTestimonial = downloadTestimonial;
window.downloadCompleteProfile = downloadCompleteProfile;
window.toggleReferredFields = toggleReferredFields;

// Export to global scope
window.EditStudentPage = {
    render: renderEditStudent
};

})();
