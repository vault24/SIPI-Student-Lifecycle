// Character Certificate Document Template

function getCharacterCertificateTemplate() {
  return `
    <div class="document-container" style="font-family: 'Georgia', serif; max-width: 8.5in; margin: 0 auto; padding: 40px;">
      <!-- Document Header -->
      <div class="document-header" style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #1a3a52; padding-bottom: 20px;">
        <div style="margin-bottom: 15px;">
          <img src="{{INSTITUTE_LOGO}}" alt="Institute Logo" style="height: 60px; margin-bottom: 10px;">
        </div>
        <h1 style="margin: 0; font-size: 24px; color: #1a3a52; font-weight: bold;">{{INSTITUTE_NAME}}</h1>
        <p style="margin: 5px 0; font-size: 12px; color: #555;">Sirajganj, Bangladesh</p>
      </div>

      <!-- Document Title -->
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="margin: 0; font-size: 20px; color: #1a3a52; font-weight: bold; text-transform: uppercase;">CHARACTER CERTIFICATE</h2>
        <p style="margin: 5px 0; font-size: 12px; color: #666;">Ref: {{ROLL_NUMBER}}/{{SESSION}}</p>
      </div>

      <!-- Document Content -->
      <div class="document-content" style="line-height: 1.8; font-size: 13px; color: #333;">
        <p style="text-align: right; margin-bottom: 20px;">
          <strong>Date:</strong> {{ISSUE_DATE}}
        </p>

        <p style="margin-bottom: 15px;">
          To Whom It May Concern,
        </p>

        <p style="margin-bottom: 15px; text-align: justify;">
          This is to certify that <strong>{{STUDENT_NAME}}</strong> ({{STUDENT_NAME_BANGLA}}), son/daughter of {{FATHER_NAME}} and {{MOTHER_NAME}}, bearing Roll No. {{ROLL_NUMBER}} and Registration No. {{REGISTRATION_NUMBER}}, is a student of {{INSTITUTE_NAME}}, {{DEPARTMENT}} Department, Semester {{SEMESTER}}, Session {{SESSION}}.
        </p>

        <p style="margin-bottom: 15px; text-align: justify;">
          During his/her association with this institution, {{STUDENT_NAME}} has been a well-behaved and disciplined student. He/She has maintained excellent conduct and character throughout his/her academic career. He/She has not been involved in any misconduct or disciplinary action.
        </p>

        <p style="margin-bottom: 15px; text-align: justify;">
          {{STUDENT_NAME}} is known for his/her integrity, honesty, and moral values. He/She has been a responsible member of the student community and has contributed positively to the academic and social environment of the institution. His/Her character is beyond reproach.
        </p>

        <p style="margin-bottom: 30px; text-align: justify;">
          We certify that {{STUDENT_NAME}} is a person of good moral character and is fit for any position of trust and responsibility.
        </p>

        <p style="margin-bottom: 30px;">
          Yours faithfully,
        </p>
      </div>

      <!-- Document Footer -->
      <div class="document-footer" style="margin-top: 40px; border-top: 2px solid #ddd; padding-top: 20px;">
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

        <div style="margin-top: 40px; text-align: center; font-size: 10px; color: #999; border-top: 1px solid #ddd; padding-top: 15px;">
          <p style="margin: 0;">This is an official document issued by {{INSTITUTE_NAME}}</p>
          <p style="margin: 5px 0;">Document ID: {{ROLL_NUMBER}}-CHARACTER-{{SESSION}}</p>
        </div>
      </div>
    </div>
  `;
}

window.getCharacterCertificateTemplate = getCharacterCertificateTemplate;
