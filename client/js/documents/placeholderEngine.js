// Placeholder Engine for Document Templates
// Handles replacement of placeholders with student data

class PlaceholderEngine {
  constructor() {
    this.placeholderPattern = /\{\{([A-Z_]+)\}\}/g;
  }

  /**
   * Replace all placeholders in a template with student data
   * @param {string} template - HTML template with placeholders
   * @param {object} studentData - Student profile data
   * @returns {string} - Template with replaced placeholders
   */
  replacePlaceholders(template, studentData) {
    if (!template || !studentData) {
      return template;
    }

    return template.replace(this.placeholderPattern, (match, placeholder) => {
      const value = this.getPlaceholderValue(placeholder, studentData);
      return value !== null ? value : '';
    });
  }

  /**
   * Get value for a placeholder from student data
   * @param {string} placeholder - Placeholder name (e.g., 'STUDENT_NAME')
   * @param {object} studentData - Student profile data
   * @returns {string|null} - Placeholder value or null if not found
   */
  getPlaceholderValue(placeholder, studentData) {
    const placeholderMap = {
      // Personal Information
      'STUDENT_NAME': studentData.fullNameEnglish || '',
      'STUDENT_NAME_BANGLA': studentData.fullNameBangla || '',
      'FATHER_NAME': studentData.fatherName || '',
      'MOTHER_NAME': studentData.motherName || '',
      'DATE_OF_BIRTH': this.formatDate(studentData.dateOfBirth),
      'GENDER': studentData.gender || '',
      'BLOOD_GROUP': studentData.bloodGroup || '',
      'RELIGION': studentData.religion || '',

      // Academic Information
      'ROLL_NUMBER': studentData.currentRollNumber || '',
      'REGISTRATION_NUMBER': studentData.currentRegistrationNumber || '',
      'DEPARTMENT': studentData.department?.name || '',
      'SEMESTER': studentData.semester || '',
      'SESSION': studentData.session || '',
      'SHIFT': studentData.shift || '',
      'GROUP': studentData.currentGroup || '',

      // Contact Information
      'MOBILE_STUDENT': studentData.mobileStudent || '',
      'GUARDIAN_MOBILE': studentData.guardianMobile || '',
      'EMAIL': studentData.email || '',
      'EMERGENCY_CONTACT': studentData.emergencyContact || '',

      // Address Information
      'PRESENT_ADDRESS': this.formatAddress(studentData.presentAddress),
      'PERMANENT_ADDRESS': this.formatAddress(studentData.permanentAddress),

      // Document-specific
      'ISSUE_DATE': this.formatDate(new Date()),
      'STUDENT_PHOTO': studentData.profilePhoto || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="160" height="160"%3E%3Crect fill="%23e5e7eb" width="160" height="160"/%3E%3C/svg%3E',
      'QR_CODE': '', // Will be generated separately
      'INSTITUTE_NAME': 'Sylhet Institute of Professional Institute',
      'INSTITUTE_LOGO': '', // Will be set from config
      'PRINCIPAL_NAME': 'Dr. Principal Name',
      'PRINCIPAL_SIGNATURE': '', // Placeholder for signature
      'EXAM_NAME': 'Final Examination',
      'EXAM_CENTER': 'Main Campus',
      'EXAM_DATE': this.formatDate(new Date()),
      'EXAM_TIME': '10:00 AM - 1:00 PM'
    };

    return placeholderMap[placeholder] || null;
  }

  /**
   * Format date to readable format
   * @param {string|Date} date - Date to format
   * @returns {string} - Formatted date
   */
  formatDate(date) {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return dateObj.toLocaleDateString('en-US', options);
  }

  /**
   * Format address object to string
   * @param {object} address - Address object
   * @returns {string} - Formatted address
   */
  formatAddress(address) {
    if (!address || typeof address !== 'object') return '';

    const parts = [
      address.village,
      address.municipality,
      address.postOffice,
      address.policeStation,
      address.subDistrict,
      address.district,
      address.division
    ].filter(Boolean);

    return parts.join(', ');
  }

  /**
   * Verify all placeholders are replaced
   * @param {string} html - HTML to check
   * @returns {boolean} - True if no placeholders remain
   */
  hasUnreplacedPlaceholders(html) {
    return this.placeholderPattern.test(html);
  }

  /**
   * Get list of unreplaced placeholders
   * @param {string} html - HTML to check
   * @returns {array} - Array of unreplaced placeholder names
   */
  getUnreplacedPlaceholders(html) {
    const unreplaced = [];
    let match;
    
    while ((match = this.placeholderPattern.exec(html)) !== null) {
      unreplaced.push(match[1]);
    }
    
    return unreplaced;
  }
}

// Create global instance
const placeholderEngine = new PlaceholderEngine();

// Export to global scope
window.PlaceholderEngine = PlaceholderEngine;
window.placeholderEngine = placeholderEngine;
