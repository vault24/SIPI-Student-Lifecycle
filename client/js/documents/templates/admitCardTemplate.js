// Admit Card Document Template

function getAdmitCardTemplate() {
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
        <h2 style="margin: 0; font-size: 20px; color: #1a3a52; font-weight: bold; text-transform: uppercase;">ADMIT CARD</h2>
        <p style="margin: 5px 0; font-size: 12px; color: #666;">{{EXAM_NAME}}</p>
      </div>

      <!-- Important Notice -->
      <div style="background-color: #fff3cd; border: 2px solid #ffc107; padding: 10px; margin-bottom: 20px; border-radius: 4px; font-size: 11px;">
        <p style="margin: 0; color: #856404;"><strong>⚠ Important:</strong> This admit card must be produced at the examination center. Candidates without this card will not be allowed to sit for the examination.</p>
      </div>

      <!-- Student Information -->
      <div style="margin-bottom: 20px; font-size: 12px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 50%; padding: 8px; border: 1px solid #ddd;"><strong>Student Name:</strong></td>
            <td style="width: 50%; padding: 8px; border: 1px solid #ddd;">{{STUDENT_NAME}}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Roll Number:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">{{ROLL_NUMBER}}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Registration No:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">{{REGISTRATION_NUMBER}}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Department:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">{{DEPARTMENT}}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Semester:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">{{SEMESTER}}</td>
          </tr>
        </table>
      </div>

      <!-- Exam Details -->
      <div style="margin-bottom: 20px; font-size: 12px;">
        <h3 style="margin: 0 0 10px 0; color: #1a3a52; border-bottom: 2px solid #1a3a52; padding-bottom: 5px;">EXAMINATION DETAILS</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 50%; padding: 8px; border: 1px solid #ddd;"><strong>Exam Name:</strong></td>
            <td style="width: 50%; padding: 8px; border: 1px solid #ddd;">{{EXAM_NAME}}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Exam Date:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">{{EXAM_DATE}}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Exam Time:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">{{EXAM_TIME}}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Exam Center:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">{{EXAM_CENTER}}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Room/Hall:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">________________</td>
          </tr>
        </table>
      </div>

      <!-- Instructions -->
      <div style="margin-bottom: 20px; font-size: 11px; background-color: #f9f9f9; border: 1px solid #ddd; padding: 10px; border-radius: 4px;">
        <h4 style="margin: 0 0 8px 0; color: #1a3a52;">INSTRUCTIONS FOR CANDIDATES:</h4>
        <ol style="margin: 0; padding-left: 20px;">
          <li>Report to the examination center 30 minutes before the scheduled time</li>
          <li>Bring this admit card and a valid ID proof</li>
          <li>Use only blue or black pen for writing</li>
          <li>Mobile phones and electronic devices are strictly prohibited</li>
          <li>Follow all instructions given by the invigilator</li>
          <li>Maintain silence and discipline in the examination hall</li>
        </ol>
      </div>

      <!-- Signature Section -->
      <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end;">
        <div style="text-align: center;">
          <div style="width: 80px; height: 50px; border: 1px dashed #999; margin-bottom: 5px;"></div>
          <p style="margin: 0; font-size: 11px;">Student Signature</p>
        </div>
        <div style="text-align: center;">
          <div style="width: 80px; height: 50px; border: 1px dashed #999; margin-bottom: 5px;"></div>
          <p style="margin: 0; font-size: 11px;">Invigilator Signature</p>
        </div>
      </div>

      <!-- Document Footer -->
      <div class="document-footer" style="border-top: 2px solid #ddd; padding-top: 15px; text-align: center; font-size: 10px; color: #999;">
        <p style="margin: 0;">Issued on: {{ISSUE_DATE}}</p>
        <p style="margin: 5px 0;">Document ID: {{ROLL_NUMBER}}-ADMIT-{{SESSION}}</p>
        <p style="margin: 5px 0;">For official use only</p>
      </div>
    </div>

    <style>
      @media print {
        .document-container {
          page-break-after: avoid;
        }
      }
    </style>
  `;
}

window.getAdmitCardTemplate = getAdmitCardTemplate;
