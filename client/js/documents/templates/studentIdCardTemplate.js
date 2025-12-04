// Student ID Card Document Template
// 85mm x 54mm card size

function getStudentIdCardTemplate() {
  return `
    <div class="document-container" style="font-family: 'Arial', sans-serif; margin: 0 auto; padding: 10px;">
      <!-- ID Card Container (85mm x 54mm) -->
      <div style="width: 85mm; height: 54mm; margin: 0 auto; border: 2px solid #1a3a52; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); display: flex; flex-direction: column; position: relative; overflow: hidden;">
        
        <!-- Front Side -->
        <div style="flex: 1; display: flex; padding: 8mm; position: relative;">
          <!-- Left Section - Photo -->
          <div style="width: 25mm; height: 38mm; margin-right: 5mm; border: 1px solid #333; background: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <img src="{{STUDENT_PHOTO}}" alt="Student Photo" style="width: 100%; height: 100%; object-fit: cover;">
          </div>

          <!-- Right Section - Info -->
          <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; font-size: 9px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 3mm; border-bottom: 1px solid #1a3a52; padding-bottom: 2mm;">
              <p style="margin: 0; font-size: 8px; font-weight: bold; color: #1a3a52;">{{INSTITUTE_NAME}}</p>
              <p style="margin: 0; font-size: 7px; color: #666;">Student ID Card</p>
            </div>

            <!-- Student Info -->
            <div style="font-size: 8px; line-height: 1.3;">
              <p style="margin: 1mm 0;"><strong>Name:</strong> {{STUDENT_NAME}}</p>
              <p style="margin: 1mm 0;"><strong>Roll:</strong> {{ROLL_NUMBER}}</p>
              <p style="margin: 1mm 0;"><strong>Reg:</strong> {{REGISTRATION_NUMBER}}</p>
              <p style="margin: 1mm 0;"><strong>Dept:</strong> {{DEPARTMENT}}</p>
              <p style="margin: 1mm 0;"><strong>Session:</strong> {{SESSION}}</p>
            </div>

            <!-- Validity -->
            <div style="font-size: 7px; color: #666; border-top: 1px solid #ddd; padding-top: 2mm;">
              <p style="margin: 0;">Valid Till: {{SESSION}}</p>
            </div>
          </div>
        </div>

        <!-- Signature Area -->
        <div style="padding: 0 8mm 5mm 8mm; display: flex; justify-content: space-between; align-items: flex-end; font-size: 7px; border-top: 1px solid #ddd;">
          <div style="text-align: center;">
            <div style="width: 20mm; height: 8mm; border: 1px dashed #999; margin-bottom: 1mm;"></div>
            <p style="margin: 0;">Student Signature</p>
          </div>
          <div style="text-align: center;">
            <div style="width: 20mm; height: 8mm; border: 1px dashed #999; margin-bottom: 1mm;"></div>
            <p style="margin: 0;">Authority</p>
          </div>
        </div>
      </div>

      <!-- Back Side (Optional) -->
      <div style="margin-top: 15mm; width: 85mm; height: 54mm; margin-left: auto; margin-right: auto; border: 2px solid #1a3a52; background: white; padding: 8mm; position: relative;">
        <!-- QR Code Area -->
        <div style="text-align: center; margin-bottom: 5mm;">
          <div style="width: 25mm; height: 25mm; border: 1px solid #333; margin: 0 auto; display: flex; align-items: center; justify-content: center; background: #f0f0f0;">
            <p style="margin: 0; font-size: 8px; color: #999;">QR Code</p>
          </div>
        </div>

        <!-- Back Info -->
        <div style="font-size: 8px; line-height: 1.4;">
          <p style="margin: 2mm 0;"><strong>Emergency Contact:</strong></p>
          <p style="margin: 1mm 0;">{{GUARDIAN_MOBILE}}</p>
          
          <p style="margin: 2mm 0;"><strong>Email:</strong></p>
          <p style="margin: 1mm 0;">{{EMAIL}}</p>

          <p style="margin: 2mm 0;"><strong>Address:</strong></p>
          <p style="margin: 1mm 0; font-size: 7px;">{{PRESENT_ADDRESS}}</p>
        </div>

        <!-- Footer -->
        <div style="position: absolute; bottom: 5mm; right: 8mm; font-size: 7px; color: #999;">
          <p style="margin: 0;">Issued: {{ISSUE_DATE}}</p>
        </div>
      </div>

      <!-- Print Instructions -->
      <div style="margin-top: 10mm; font-size: 9px; color: #666; text-align: center; border-top: 1px solid #ddd; padding-top: 5mm;">
        <p style="margin: 0;"><strong>Print Instructions:</strong> Print on cardstock, cut along borders, laminate for durability</p>
      </div>
    </div>

    <style>
      @media print {
        body {
          margin: 0;
          padding: 0;
        }
        .document-container {
          page-break-after: avoid;
        }
      }
    </style>
  `;
}

window.getStudentIdCardTemplate = getStudentIdCardTemplate;
