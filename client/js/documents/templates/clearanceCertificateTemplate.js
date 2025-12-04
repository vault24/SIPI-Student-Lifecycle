// Clearance Certificate Document Template

function getClearanceCertificateTemplate() {
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
        <h2 style="margin: 0; font-size: 20px; color: #1a3a52; font-weight: bold; text-transform: uppercase;">CLEARANCE CERTIFICATE</h2>
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
          This is to certify that <strong>{{STUDENT_NAME}}</strong> ({{STUDENT_NAME_BANGLA}}), Roll No. {{ROLL_NUMBER}}, Registration No. {{REGISTRATION_NUMBER}}, of {{DEPARTMENT}} Department, Session {{SESSION}}, has completed all formalities and clearances required by {{INSTITUTE_NAME}}.
        </p>

        <!-- Clearance Sections -->
        <div style="margin: 25px 0; border: 1px solid #ddd; padding: 15px; background-color: #f9f9f9;">
          <h3 style="margin: 0 0 15px 0; font-size: 14px; color: #1a3a52; border-bottom: 2px solid #1a3a52; padding-bottom: 8px;">CLEARANCE STATUS</h3>

          <!-- Library Clearance -->
          <div style="margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; background: white;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="margin: 0; font-weight: bold; font-size: 13px;">Library Clearance</p>
                <p style="margin: 3px 0; font-size: 11px; color: #666;">All books and materials returned</p>
              </div>
              <div style="text-align: center;">
                <div style="width: 40px; height: 40px; border: 2px solid #27ae60; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #d5f4e6;">
                  <span style="font-size: 20px; color: #27ae60;">✓</span>
                </div>
              </div>
            </div>
            <div style="margin-top: 10px; border-top: 1px solid #ddd; padding-top: 8px;">
              <p style="margin: 0; font-size: 11px;"><strong>Librarian:</strong> _________________ <strong>Date:</strong> _________</p>
            </div>
          </div>

          <!-- Accounts Clearance -->
          <div style="margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; background: white;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="margin: 0; font-weight: bold; font-size: 13px;">Accounts Clearance</p>
                <p style="margin: 3px 0; font-size: 11px; color: #666;">All dues and fees paid</p>
              </div>
              <div style="text-align: center;">
                <div style="width: 40px; height: 40px; border: 2px solid #27ae60; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #d5f4e6;">
                  <span style="font-size: 20px; color: #27ae60;">✓</span>
                </div>
              </div>
            </div>
            <div style="margin-top: 10px; border-top: 1px solid #ddd; padding-top: 8px;">
              <p style="margin: 0; font-size: 11px;"><strong>Accounts Officer:</strong> _________________ <strong>Date:</strong> _________</p>
            </div>
          </div>

          <!-- Academic Clearance -->
          <div style="padding: 10px; border: 1px solid #ddd; background: white;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="margin: 0; font-weight: bold; font-size: 13px;">Academic Clearance</p>
                <p style="margin: 3px 0; font-size: 11px; color: #666;">All academic requirements fulfilled</p>
              </div>
              <div style="text-align: center;">
                <div style="width: 40px; height: 40px; border: 2px solid #27ae60; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #d5f4e6;">
                  <span style="font-size: 20px; color: #27ae60;">✓</span>
                </div>
              </div>
            </div>
            <div style="margin-top: 10px; border-top: 1px solid #ddd; padding-top: 8px;">
              <p style="margin: 0; font-size: 11px;"><strong>Academic Coordinator:</strong> _________________ <strong>Date:</strong> _________</p>
            </div>
          </div>
        </div>

        <p style="margin-bottom: 30px; text-align: justify;">
          {{STUDENT_NAME}} is hereby cleared to proceed with further studies or employment. This certificate is valid for all official purposes.
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
          <p style="margin: 5px 0;">Document ID: {{ROLL_NUMBER}}-CLEARANCE-{{SESSION}}</p>
        </div>
      </div>
    </div>
  `;
}

window.getClearanceCertificateTemplate = getClearanceCertificateTemplate;
