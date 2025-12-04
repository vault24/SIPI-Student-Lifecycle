// Testimonial Document Template
// Returns HTML template for testimonial letter

function getTestimonialTemplate() {
  return `
    <div class="document-container" style="font-family: 'Georgia', serif; max-width: 8.5in; margin: 0 auto; padding: 40px;">
      <!-- Document Header -->
      <div class="document-header" style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #1a3a52; padding-bottom: 20px;">
        <div style="margin-bottom: 15px;">
          <img src="{{INSTITUTE_LOGO}}" alt="Institute Logo" style="height: 60px; margin-bottom: 10px;">
        </div>
        <h1 style="margin: 0; font-size: 24px; color: #1a3a52; font-weight: bold;">{{INSTITUTE_NAME}}</h1>
        <p style="margin: 5px 0; font-size: 12px; color: #555;">Sirajganj, Bangladesh</p>
        <p style="margin: 5px 0; font-size: 11px; color: #777;">Phone: +880-1234-567890 | Email: info@sipi.edu.bd</p>
      </div>

      <!-- Document Title -->
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="margin: 0; font-size: 20px; color: #1a3a52; font-weight: bold; text-transform: uppercase;">TESTIMONIAL</h2>
        <p style="margin: 5px 0; font-size: 12px; color: #666;">Reference No: {{ROLL_NUMBER}}/{{SESSION}}</p>
      </div>

      <!-- Document Content -->
      <div class="document-content" style="line-height: 1.8; font-size: 13px; color: #333;">
        <!-- Date -->
        <p style="text-align: right; margin-bottom: 20px;">
          <strong>Date:</strong> {{ISSUE_DATE}}
        </p>

        <!-- Salutation -->
        <p style="margin-bottom: 15px;">
          To Whom It May Concern,
        </p>

        <!-- Body -->
        <p style="margin-bottom: 15px; text-align: justify;">
          This is to certify that <strong>{{STUDENT_NAME}}</strong> ({{STUDENT_NAME_BANGLA}}) is a bonafide student of {{INSTITUTE_NAME}}. He/She has been studying in the {{DEPARTMENT}} department and is currently in Semester {{SEMESTER}} of the academic session {{SESSION}}.
        </p>

        <p style="margin-bottom: 15px; text-align: justify;">
          During his/her academic tenure at our institution, {{STUDENT_NAME}} has demonstrated commendable dedication towards his/her studies. He/She has maintained a good academic record and has actively participated in various academic and co-curricular activities. His/Her conduct and behavior have been exemplary throughout his/her stay at the institute.
        </p>

        <p style="margin-bottom: 15px; text-align: justify;">
          {{STUDENT_NAME}} is a sincere and hardworking student with a keen interest in learning. He/She has shown excellent aptitude in his/her field of study and has been a responsible member of the student community. We are confident that he/she will be an asset to any organization he/she joins.
        </p>

        <p style="margin-bottom: 30px; text-align: justify;">
          We wish him/her all the best in his/her future endeavors and hope that this testimonial will be helpful for his/her further studies or professional career.
        </p>

        <!-- Closing -->
        <p style="margin-bottom: 30px;">
          Yours faithfully,
        </p>
      </div>

      <!-- Document Footer -->
      <div class="document-footer" style="margin-top: 40px; border-top: 2px solid #ddd; padding-top: 20px;">
        <!-- Signature Block -->
        <div style="display: inline-block; width: 100%;">
          <div style="float: left; width: 45%;">
            <div style="height: 60px; margin-bottom: 5px;"></div>
            <p style="margin: 0; font-size: 12px; border-top: 1px solid #333; padding-top: 5px;">
              <strong>{{PRINCIPAL_NAME}}</strong><br>
              Principal<br>
              {{INSTITUTE_NAME}}
            </p>
          </div>
          <div style="float: right; width: 45%; text-align: right;">
            <p style="margin: 0; font-size: 11px; color: #666;">
              <strong>Official Seal</strong><br>
              <br>
              <br>
            </p>
          </div>
          <div style="clear: both;"></div>
        </div>

        <!-- Footer Info -->
        <div style="margin-top: 40px; text-align: center; font-size: 10px; color: #999; border-top: 1px solid #ddd; padding-top: 15px;">
          <p style="margin: 0;">This is an official document issued by {{INSTITUTE_NAME}}</p>
          <p style="margin: 5px 0;">Document ID: {{ROLL_NUMBER}}-TESTIMONIAL-{{SESSION}}</p>
        </div>
      </div>
    </div>

    <style>
      @media print {
        .document-container {
          page-break-after: avoid;
        }
        .document-header, .document-content, .document-footer {
          page-break-inside: avoid;
        }
      }
    </style>
  `;
}

// Export to global scope
window.getTestimonialTemplate = getTestimonialTemplate;
