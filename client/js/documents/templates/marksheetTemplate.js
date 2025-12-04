// Marksheet Document Template

function getMarksheetTemplate() {
  return `
    <div class="document-container" style="font-family: 'Georgia', serif; max-width: 8.5in; margin: 0 auto; padding: 30px;">
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
        <h2 style="margin: 0; font-size: 18px; color: #1a3a52; font-weight: bold; text-transform: uppercase;">MARKSHEET</h2>
        <p style="margin: 5px 0; font-size: 11px; color: #666;">Semester {{SEMESTER}}, Session {{SESSION}}</p>
      </div>

      <!-- Student Information -->
      <div style="margin-bottom: 20px; font-size: 12px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 50%; padding: 5px 0;"><strong>Student Name:</strong> {{STUDENT_NAME}}</td>
            <td style="width: 50%; padding: 5px 0;"><strong>Roll Number:</strong> {{ROLL_NUMBER}}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0;"><strong>Registration No:</strong> {{REGISTRATION_NUMBER}}</td>
            <td style="padding: 5px 0;"><strong>Department:</strong> {{DEPARTMENT}}</td>
          </tr>
        </table>
      </div>

      <!-- Marks Table -->
      <div style="margin-bottom: 25px;">
        <table style="width: 100%; border-collapse: collapse; border: 2px solid #1a3a52; font-size: 11px;">
          <thead>
            <tr style="background-color: #1a3a52; color: white;">
              <th style="border: 1px solid #1a3a52; padding: 8px; text-align: left;">Subject</th>
              <th style="border: 1px solid #1a3a52; padding: 8px; text-align: center;">Theory</th>
              <th style="border: 1px solid #1a3a52; padding: 8px; text-align: center;">Practical</th>
              <th style="border: 1px solid #1a3a52; padding: 8px; text-align: center;">Total</th>
              <th style="border: 1px solid #1a3a52; padding: 8px; text-align: center;">Grade</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="5" style="border: 1px solid #1a3a52; padding: 8px; text-align: center; color: #999;">
                Subject-wise marks will be populated from student data
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Summary Section -->
      <div style="margin-bottom: 25px; font-size: 12px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #f0f0f0;">
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Total Marks:</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">{{TOTAL_MARKS}}</td>
          </tr>
          <tr style="background-color: #f0f0f0;">
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">GPA/Grade:</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">{{GPA}}</td>
          </tr>
        </table>
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
          <p style="margin: 0;">Document ID: {{ROLL_NUMBER}}-MARKSHEET-{{SESSION}}</p>
        </div>
      </div>
    </div>
  `;
}

window.getMarksheetTemplate = getMarksheetTemplate;
