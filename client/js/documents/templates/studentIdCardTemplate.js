function getStudentIdCardTemplate(student) {
  // Handle missing student data
  if (!student) {
    console.error('Student data is required for ID card template');
    return '';
  }

  // Map student data fields to template variables
  const {
    fullNameEnglish = 'Student Name',
    profilePhoto = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="240" height="240"%3E%3Crect fill="%23e5e7eb" width="240" height="240"/%3E%3C/svg%3E',
    department = {},
    currentRollNumber = 'N/A',
    currentRegistrationNumber = 'N/A',
    session = 'N/A',
    guardianMobile = 'N/A',
    email = 'N/A',
    presentAddress = {},
  } = student;

  // Extract department name
  const departmentName = typeof department === 'object' ? (department.name || 'Department') : department;
  
  // Format address
  const formatAddress = (addr) => {
    if (!addr || typeof addr !== 'object') return 'N/A';
    const parts = [addr.village, addr.municipality, addr.district].filter(Boolean);
    return parts.join(', ') || 'N/A';
  };

  // Set template variables
  const instituteName = 'Sirajganj Polytechnic Institute';
  const studentName = fullNameEnglish;
  const studentPhotoUrl = profilePhoto;
  const departmentName_display = departmentName;
  const rollNumber = currentRollNumber;
  const registrationNumber = currentRegistrationNumber;
  const issueDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const expiryDate = new Date(new Date().setFullYear(new Date().getFullYear() + 4)).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const presentAddressStr = formatAddress(presentAddress);
  const website = 'www.sipi.edu.bd';

  return `
    <div class="document-container" style="font-family: 'Arial', sans-serif; margin: 0 auto; padding: 20px; background: #f5f5f5;">

      <!-- ========== FRONT SIDE ========== -->
      <!-- Standard ID Card Size: 85.6mm x 53.98mm (3.37" x 2.125") -->
      <div style="
        width: 320px;
        height: 200px;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0,0,0,0.25);
        position: relative;
        background: #0f172a;
        color: #ffffff;
        display: flex;
        flex-direction: column;
        margin: 0 auto 40px;
        page-break-after: avoid;
      ">

        <!-- Top White Header -->
        <div style="
          background: #ffffff;
          height: 50px;
          position: relative;
          padding: 6px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        ">
          <div style="
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, #22c55e, #0ea5e9);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-weight: bold;
            font-size: 12px;
          ">
            LOGO
          </div>

          <div style="flex: 1; margin-left: 8px;">
            <div style="font-size: 12px; font-weight: 700; color: #0f172a; text-transform: uppercase; line-height: 1;">
              ${instituteName}
            </div>
            <div style="font-size: 9px; color: #6b7280; line-height: 1;">
              Student ID Card
            </div>
          </div>
        </div>

        <!-- Blue Background -->
        <div style="
          position: absolute;
          top: 50px;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(160deg, #0ea5e9, #0369a1 70%, #020617);
        "></div>

        <!-- Green Curve -->
        <div style="
          position: absolute;
          top: 80px;
          right: -60px;
          width: 200px;
          height: 200px;
          background: #22c55e;
          border-radius: 50%;
          opacity: .8;
        "></div>

        <!-- Foreground Content -->
        <div style="
          position: relative;
          padding: 8px 10px;
          display: flex;
          gap: 8px;
          height: 150px;
          z-index: 10;
        ">

          <!-- Photo -->
          <div style="
            width: 100px;
            height: 100px;
            background: white;
            border-radius: 4px;
            overflow: hidden;
            border: 2px solid #0f172a;
            flex-shrink: 0;
          ">
            <img src="${studentPhotoUrl}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E'">
          </div>

          <!-- Info -->
          <div style="flex: 1; color: #ffffff; display: flex; flex-direction: column; justify-content: space-between; min-width: 0;">
            
            <div>
              <div style="font-size: 13px; font-weight: bold; color: #22c55e; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${studentName}
              </div>
              <div style="font-size: 8px; color: #e0e0e0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${departmentName_display}
              </div>
            </div>

            <div style="font-size: 7px; line-height: 1.3; color: #ffffff;">
              <div><strong>ID:</strong> ${rollNumber}</div>
              <div><strong>Reg:</strong> ${registrationNumber}</div>
              <div><strong>Session:</strong> ${session}</div>
            </div>

            <div style="font-size: 6px; color: #b0b0b0; display: flex; justify-content: space-between;">
              <span>Issue: ${issueDate.split(' ')[2]}</span>
              <span>Exp: ${expiryDate.split(' ')[2]}</span>
            </div>
          </div>

        </div>

        <!-- Barcode Footer -->
        <div style="
          position: relative;
          padding: 4px 8px;
          font-size: 6px;
          text-align: center;
          background: rgba(0,0,0,0.3);
        ">
          <div style="
            height: 12px;
            background-image: repeating-linear-gradient(to right,#000,#000 2px,#ffffff 2px,#ffffff 3px);
            margin-bottom: 2px;
          "></div>
          <div style="font-size: 5px; color: #b0b0b0;">${website}</div>
        </div>

      </div>

      <!-- ========== BACK SIDE ========== -->
      <!-- Standard ID Card Size: 85.6mm x 53.98mm (3.37" x 2.125") -->
      <div style="
        width: 320px;
        height: 200px;
        margin: 0 auto;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0,0,0,0.25);
        position: relative;
        background: #0f172a;
        color: #ffffff;
        display: flex;
        flex-direction: column;
        page-break-after: avoid;
      ">

        <!-- Header -->
        <div style="
          background: #020617;
          padding: 6px 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        ">
          <div style="
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: linear-gradient(135deg,#f97316,#22c55e,#0ea5e9);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
            flex-shrink: 0;
          ">
            LOGO
          </div>
          <div style="font-size: 9px; line-height: 1.2;">
            <div style="font-weight: bold; text-transform: uppercase;">
              ${instituteName}
            </div>
            <div style="font-size: 7px; color: #9ca3af;">
              Student ID Card
            </div>
          </div>
        </div>

        <!-- Content Section -->
        <div style="padding: 6px 8px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; font-size: 7px; line-height: 1.3;">
          
          <div style="background: #ffffff; border-radius: 4px; padding: 6px; color: #020617;">
            <div style="text-align: center; font-size: 8px; font-weight: bold; margin-bottom: 4px;">
              Terms & Conditions
            </div>
            <ul style="font-size: 6px; line-height: 1.2; margin: 0; padding-left: 12px;">
              <li>Non-transferable</li>
              <li>Report if lost</li>
              <li>Misuse = action</li>
            </ul>
          </div>

          <div style="display: flex; justify-content: space-between; gap: 4px; font-size: 6px;">
            <div style="flex: 1;">
              <div>📧 ${email.substring(0, 15)}</div>
              <div>�e ${guardianMobile}</div>
              <div>🌐 ${website}</div>
            </div>
            <div style="
              width: 50px;
              height: 50px;
              border: 1px solid #0ea5e9;
              border-radius: 3px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 5px;
              color: #6b7280;
              flex-shrink: 0;
            ">
              QR
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; font-size: 6px; color: #b0b0b0;">
            <span>Issue: ${issueDate.split(' ')[2]}</span>
            <span>Exp: ${expiryDate.split(' ')[2]}</span>
          </div>

        </div>

      </div>

    </div>
    
    <style>
      @media print {
        body {
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
        }
        
        html {
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* Hide navbar, header, footer, buttons */
        #navbar,
        #sidebar,
        .navbar,
        .sidebar,
        nav,
        footer,
        button,
        .no-print {
          display: none !important;
        }
        
        /* Show document container */
        .document-container {
          display: block !important;
          visibility: visible !important;
          margin: 0 !important;
          padding: 20px !important;
          background: white !important;
          page-break-after: avoid;
        }
        
        @page {
          margin: 0.5in;
        }
      }
    </style>
  `;
}

// Make it available globally in browser
if (typeof window !== 'undefined') {
  window.getStudentIdCardTemplate = getStudentIdCardTemplate;
}
