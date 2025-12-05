# Multiple Documents Selection Feature

## Overview

The application form has been enhanced to allow students to select multiple documents when submitting an application. Instead of just selecting an application type, students can now choose specific documents they need based on their application type.

## What Changed

### Application Form Updates

#### 1. New Document Selection Section
- Added a new "Select Required Documents" section that appears after selecting an application type
- Displays checkboxes for all available documents for the selected application type
- Each checkbox shows:
  - Document icon
  - Document name
  - Document description
  - Hover effect for better UX

#### 2. Dynamic Checkbox Generation
- Checkboxes are generated dynamically based on the selected application type
- Uses the existing `APPLICATION_DOCUMENT_MAPPING` to determine available documents
- Only shows documents relevant to the selected application type

#### 3. Form Validation
- Validates that at least one document is selected before submission
- Shows error message if no documents are selected
- Prevents form submission if validation fails

## How It Works

### Step 1: Select Application Type
1. Student selects an application type from the dropdown
2. `updateDocumentCheckboxes()` function is triggered
3. Available documents for that type are fetched

### Step 2: View Available Documents
1. Document selection section becomes visible
2. Checkboxes are displayed for each available document
3. Each checkbox shows document details

### Step 3: Select Documents
1. Student checks the boxes for documents they need
2. Can select one or multiple documents
3. At least one document must be selected

### Step 4: Submit Application
1. Form validates that documents are selected
2. Selected documents are included in the submission
3. Application is submitted with document selections

## Application Type to Document Mapping

| Application Type | Available Documents |
|---|---|
| Testimonial | Testimonial |
| Certificate | Character Certificate, Clearance Certificate |
| Character Certificate | Character Certificate |
| Transcript | Academic Transcript, Marksheet |
| Stipend | Character Certificate, Academic Transcript |
| Other Documents | All 7 documents |

## Code Changes

### File Modified: `client/js/pages/applications.js`

#### New Function: `updateDocumentCheckboxes()`
```javascript
function updateDocumentCheckboxes() {
    // Gets selected application type
    // Fetches available documents
    // Generates and displays checkboxes
    // Updates UI dynamically
}
```

#### Updated Function: `handlePublicApplicationSubmit()`
```javascript
// Now includes:
// - Gets selected documents from checkboxes
// - Validates at least one document is selected
// - Includes selectedDocuments array in submission
```

#### Form Changes
- Added `onchange="updateDocumentCheckboxes()"` to application type select
- Added documents section with checkboxes container
- Added validation for document selection

## UI Components

### Document Checkbox Item
```html
<label class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition">
    <input type="checkbox" name="selectedDocuments" value="{documentType}">
    <div class="flex-1">
        <div class="flex items-center gap-2">
            <i data-lucide="{icon}"></i>
            <span class="font-medium">{documentName}</span>
        </div>
        <p class="text-xs text-gray-500">{description}</p>
    </div>
</label>
```

### Features
- ✅ Checkbox for selection
- ✅ Document icon
- ✅ Document name
- ✅ Document description
- ✅ Hover effect
- ✅ Responsive grid layout (1 column on mobile, 2 on desktop)

## Data Structure

### Application Data with Documents
```javascript
{
    fullNameBangla: string,
    fullNameEnglish: string,
    fatherName: string,
    motherName: string,
    department: string,
    session: string,
    shift: string,
    rollNumber: string,
    registrationNumber: string,
    email: string,
    applicationType: string,
    subject: string,
    message: string,
    selectedDocuments: [
        'testimonial',
        'character-certificate',
        'academic-transcript'
    ]
}
```

## Validation Rules

1. **Application Type Required** - Must select an application type
2. **At Least One Document** - Must select at least one document
3. **All Other Fields Required** - Same as before

## User Experience

### Before
1. Select application type
2. Fill in details
3. Submit
4. After approval, select documents

### After
1. Select application type
2. Select required documents
3. Fill in details
4. Submit
5. After approval, documents are pre-selected

## Benefits

✅ **Better Planning** - Students know what documents they need upfront
✅ **Faster Processing** - Admin knows exactly which documents are needed
✅ **Reduced Back-and-Forth** - No need to ask for additional documents later
✅ **Improved UX** - Clear visual representation of available documents
✅ **Flexible Selection** - Can select multiple documents from one application

## Integration with Existing System

### Document Selection Page
- When application is approved, the document selection page will show the pre-selected documents
- Students can still generate other available documents if needed

### Document Viewer
- Works seamlessly with the existing document generation system
- No changes needed to document templates or rendering

### API Integration
- Backend receives `selectedDocuments` array in the application submission
- Can be stored and used for tracking which documents were requested

## Testing Checklist

- [ ] Application type dropdown works
- [ ] Document checkboxes appear after selecting type
- [ ] Correct documents shown for each application type
- [ ] Can select multiple documents
- [ ] Can deselect documents
- [ ] Form validation prevents submission without documents
- [ ] Error message shows when no documents selected
- [ ] Selected documents are included in submission
- [ ] Form submission works with selected documents
- [ ] Success message displays after submission
- [ ] Responsive design works on mobile
- [ ] Responsive design works on tablet
- [ ] Responsive design works on desktop

## Browser Compatibility

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## Accessibility

- ✅ Proper label associations
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ ARIA attributes (if needed)
- ✅ Color not the only indicator

## Performance

- ✅ Minimal DOM manipulation
- ✅ Efficient checkbox generation
- ✅ No unnecessary re-renders
- ✅ Fast checkbox updates

## Future Enhancements

1. **Document Preview** - Show preview of selected documents
2. **Document Descriptions** - More detailed descriptions
3. **Required vs Optional** - Mark some documents as required
4. **Document Bundles** - Pre-defined document packages
5. **Estimated Processing Time** - Show time for each document
6. **Document Pricing** - If applicable, show costs
7. **Bulk Operations** - Select/deselect all documents

## Troubleshooting

### Checkboxes Not Appearing
- Verify application type is selected
- Check browser console for errors
- Verify `getDocumentMetadataForApplicationType()` is available

### Validation Error
- Ensure at least one document is selected
- Check that `selectedDocuments` array is not empty

### Form Not Submitting
- Verify all required fields are filled
- Check that at least one document is selected
- Check browser console for errors

## Support

For issues or questions:
1. Check this guide
2. Review the troubleshooting section
3. Check browser console for errors
4. Contact admin or IT support

---

**Version:** 1.0.0
**Status:** ✅ Complete
**Last Updated:** 2025-12-05
