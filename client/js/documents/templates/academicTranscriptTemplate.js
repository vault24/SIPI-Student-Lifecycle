// Academic Transcript Document Template

function getAcademicTranscriptTemplate() {
  return `
    <div class="document-container" style="font-family: 'Georgia', serif; max-width: 11in; margin: 0 auto; padding: 30px;">
      <!-- Document Header -->
      <div class="document-header" style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #1a3a52; padding-bottom: 15px;">
        <div style="margin-bottom: 10px;">
          <img src="{{INSTITUTE_LOGO}}" alt="Institute Logo" style="height: 50px; margin-bottom: 8px;">
        </div>
        <h1 style="margin: 0; font-size: 22px; color: #1a3a52; font-weight: bold;">{{INSTITUTE_NAME}}</h1>
        <p style="margin: 3px 0; font-size: 11px; color: #555;">Sirajganj, Bangladesh</p>
      </div>

      <!-- Document Title -->
      <div style="text-align: center; margin-bottom: 25px;">
        <h2 style="margin: 0; font-size: 18px; color: #1a3a52; font-weight: bold; text-transform: uppercase;">ACADEMIC TRANSCRIPT</h2>
      </div>

      <!-- Student Information -->
      <div style="margin-bottom: 25px; font-size: 12px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 50%; padding: 5px 0;"><strong>Student Name:</strong> {{STUDENT_NAME}}</td>
            <td style="width: 50%; padding: 5px 0;"><strong>Roll Number:</strong> {{ROLL_NUMBER}}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0;"><strong>Registration No:</strong> {{REGISTRATION_NUMBER}}</td>
            <td style="padding: 5px 0;"><strong>Department:</strong> {{DEPARTMENT}}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0;"><strong>Session:</strong> {{SESSION}}</td>
            <td style="padding: 5px 0;"><strong>Date of Birth:</strong> {{DATE_OF_BIRTH}}</td>
          </tr>
        </table>
      </div>

      <!-- Academic Records Table -->
      <div style="margin-bottom: 25px;">
        <table style="width: 100%; border-collapse: collapse; border: 2px solid #1a3a52; font-size: 11px;">
          <thead>
            <tr style="background-color: #1a3a52; color: white;">
              <th style="border: 1px solid #1a3a52; padding: 8px; text-align: left;">Semester</th>
              <th style="border: 1px solid #1a3a52; padding: 8px; text-align: left;">Course Code</th>
              <th style="border: 1px solid #1a3a52; padding: 8px; text-align: left;">Course Title</th>
              <th style="border: 1px solid #1a3a52; padding: 8px; text-align: center;">Credits</th>
              <th style="border: 1px solid #1a3a52; padding: 8px; text-align: center;">Grade</th>
              <th style="border: 1px solid #1a3a52; padding: 8px; text-align: center;">GPA</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="6" style="border: 1px solid #1a3a52; padding: 8px; text-align: center; color: #999;">
                Semester-wise course records will be populated from student data
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Summary Section -->
      <div style="margin-bottom: 25px; font-size: 12px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #f0f0f0;">
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Total Credits Earned:</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">{{TOTAL_CREDITS}}</td>
          </tr>
          <tr style="background-color: #f0f0f0;">
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Cumulative GPA:</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">{{TOTAL_GPA}}</td>
          </tr>
        </table>
      </div>

      <!-- Notes -->
      <div style="margin-bottom: 25px; font-size: 11px; color: #666; border: 1px solid #ddd; padding: 10px; background-color: #f9f9f9;">
        <p style="margin: 0;"><strong>Note:</strong> This transcript is an official record of the student's academic performance. Grades are based on the grading scale used by {{INSTITUTE_NAME}}.</p>
      </div>

      <!-- Document Footer -->
      <div class="document-footer" style="margin-top: 30px; border-top: 2px solid #ddd; padding-top: 15px;">
        <div style="display: inline-block; width: 100%;">
          <div style="float: left; width: 45%;">
            <div style="height: 50px; margin-bottom: 5px;"></div>
            <p style="margin: 0; font-size: 11px; border-top: 1px solid #333; padding-top: 5px;">
              <strong>{{PRINCIPAL_NAME}}</strong><br>
              Principal
            </p>
          </div>
          <div style="float: right; width: 45%; text-align: right;">
            <p style="margin: 0; font-size: 10px; color: #666;">
              <strong>Date:</strong> {{ISSUE_DATE}}<br>
              <strong>Official Seal</strong>
            </p>
          </div>
          <div style="clear: both;"></div>
        </div>

        <div style="margin-top: 30px; text-align: center; font-size: 9px; color: #999; border-top: 1px solid #ddd; padding-top: 10px;">
          <p style="margin: 0;">Document ID: {{ROLL_NUMBER}}-TRANSCRIPT-{{SESSION}}</p>
        </div>
      </div>
    </div>
  `;
}

window.getAcademicTranscriptTemplate = getAcademicTranscriptTemplate;
