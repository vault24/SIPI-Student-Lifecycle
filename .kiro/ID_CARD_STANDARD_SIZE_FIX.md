# Student ID Card - Standard Size Fix

## Summary of Changes

### Standard ID Card Size
- **Dimensions**: 320px × 200px (85.6mm × 53.98mm)
- **International Standard**: Credit card size
- **Optimized for**: Printing on standard ID card stock

### Front Side Layout
- Header (50px): Logo, institute name, card type
- Content (150px): Photo (100×100px) + student info
- Footer: Barcode and website

### Back Side Layout  
- Header (30px): Logo and institute info
- Content: Terms, contact info, QR code, dates

### All Content Now Visible
✅ Student name (with ellipsis if long)
✅ Department (with ellipsis if long)
✅ ID number
✅ Registration number
✅ Session
✅ Student photo (with fallback)
✅ Contact information
✅ Issue/expiry dates
✅ QR code area
✅ Terms & conditions

### Font Sizes
- Header: 12px
- Name: 13px (bold, green)
- Department: 8px
- Info: 7px
- Footer: 6px

### Print Optimization
- Page break prevention
- High contrast colors
- Proper margins
- Barcode pattern for scanning

## File Modified
- `client/js/documents/templates/studentIdCardTemplate.js`
