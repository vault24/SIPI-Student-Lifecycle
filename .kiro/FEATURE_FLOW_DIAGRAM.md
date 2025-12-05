# Multiple Documents Selection - Flow Diagrams

## User Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION FORM                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │ Fill Student Info   │
                    │ • Names             │
                    │ • Department        │
                    │ • Roll Number       │
                    │ • etc.              │
                    └─────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │ Select App Type     │
                    │ • Testimonial       │
                    │ • Certificate       │
                    │ • Transcript        │
                    │ • etc.              │
                    └─────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │ Document Checkboxes │
                    │ Appear Dynamically  │
                    └─────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │ Select Documents    │
                    │ ☑ Doc 1             │
                    │ ☑ Doc 2             │
                    │ ☐ Doc 3             │
                    └─────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │ Fill Details        │
                    │ • Subject           │
                    │ • Message           │
                    └─────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │ Validate Form       │
                    │ • All fields filled │
                    │ • Doc selected      │
                    └─────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
            ✅ Valid              ❌ Invalid
                    │                   │
                    ▼                   ▼
            ┌──────────────┐    ┌──────────────┐
            │ Submit Form  │    │ Show Error   │
            └──────┬───────┘    │ Message      │
                   │            └──────────────┘
                   ▼
        ┌──────────────────────┐
        │ Application Submitted│
        │ Show Success Message │
        │ Display App ID       │
        └──────────────────────┘
```

## Document Selection Logic

```
┌─────────────────────────────────────────────────────────────┐
│              APPLICATION TYPE SELECTED                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │ Get Application     │
                    │ Type Value          │
                    └─────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │ Call Mapper         │
                    │ getDocumentMetadata │
                    │ ForApplicationType()│
                    └─────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │ Get Available       │
                    │ Documents Array     │
                    └─────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
            Documents Found      No Documents
                    │                   │
                    ▼                   ▼
            ┌──────────────┐    ┌──────────────┐
            │ Show Section │    │ Hide Section │
            │ Generate     │    │ (No docs)    │
            │ Checkboxes   │    └──────────────┘
            └──────────────┘
```

## Checkbox Generation

```
┌─────────────────────────────────────────────────────────────┐
│              GENERATE CHECKBOXES                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │ For Each Document   │
                    │ in Available Docs   │
                    └─────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │ Create Label        │
                    │ Element             │
                    └─────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │ Add Checkbox Input  │
                    │ • name: selected    │
                    │ • value: doc type   │
                    └─────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │ Add Document Icon   │
                    │ • From metadata     │
                    │ • Lucide icon       │
                    └─────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │ Add Document Name   │
                    │ • From metadata     │
                    │ • Bold text         │
                    └─────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │ Add Description     │
                    │ • From metadata     │
                    │ • Small text        │
                    └─────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │ Add Styling         │
                    │ • Border            │
                    │ • Hover effect      │
                    │ • Responsive grid   │
                    └─────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │ Render Icons        │
                    │ lucide.createIcons()│
                    └─────────────────────┘
```

## Form Submission Flow

```
┌─────────────────────────────────────────────────────────────┐
│              FORM SUBMISSION                                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │ Get Selected        │
                    │ Documents from      │
                    │ Checkboxes          │
                    └─────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │ Check if Documents  │
                    │ Section Visible     │
                    └─────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
            Section Visible      Section Hidden
                    │                   │
                    ▼                   ▼
            ┌──────────────┐    ┌──────────────┐
            │ Validate     │    │ Skip         │
            │ At least 1   │    │ Validation   │
            │ selected     │    └──────────────┘
            └──────┬───────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
    ✅ Valid            ❌ Invalid
        │                     │
        ▼                     ▼
    ┌────────────┐    ┌──────────────┐
    │ Collect    │    │ Show Error   │
    │ Form Data  │    │ Toast        │
    └────┬───────┘    │ "Please      │
         │            │ select at    │
         ▼            │ least one"   │
    ┌────────────┐    └──────────────┘
    │ Add        │
    │ Selected   │
    │ Documents  │
    │ Array      │
    └────┬───────┘
         │
         ▼
    ┌────────────┐
    │ Submit to  │
    │ Backend    │
    └────┬───────┘
         │
         ▼
    ┌────────────┐
    │ Show       │
    │ Success    │
    │ Message    │
    └────────────┘
```

## Application Type to Documents Mapping

```
┌─────────────────────────────────────────────────────────────┐
│              APPLICATION TYPE MAPPING                       │
└─────────────────────────────────────────────────────────────┘

Testimonial
    └─ Testimonial

Certificate
    ├─ Character Certificate
    └─ Clearance Certificate

Character Certificate
    └─ Character Certificate

Transcript
    ├─ Academic Transcript
    └─ Marksheet

Stipend
    ├─ Character Certificate
    └─ Academic Transcript

Other Documents
    ├─ Testimonial
    ├─ Character Certificate
    ├─ Academic Transcript
    ├─ Marksheet
    ├─ Student ID Card
    ├─ Clearance Certificate
    └─ Admit Card
```

## UI Component Structure

```
┌─────────────────────────────────────────────────────────────┐
│              DOCUMENT CHECKBOX COMPONENT                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ☑ [Icon] Document Name                                      │
│    Document description goes here                           │
└─────────────────────────────────────────────────────────────┘

Components:
├─ Checkbox Input
│  ├─ Type: checkbox
│  ├─ Name: selectedDocuments
│  ├─ Value: document-type
│  └─ Styling: w-4 h-4 text-blue-600
│
├─ Document Icon
│  ├─ From: metadata.icon
│  ├─ Library: Lucide
│  └─ Styling: w-4 h-4 text-{color}-600
│
├─ Document Name
│  ├─ From: metadata.name
│  ├─ Weight: font-medium
│  └─ Color: text-gray-900
│
└─ Document Description
   ├─ From: metadata.description
   ├─ Size: text-xs
   └─ Color: text-gray-500
```

## Responsive Layout

```
Mobile (1 column)
┌──────────────────────┐
│ ☑ Document 1         │
│    Description       │
├──────────────────────┤
│ ☑ Document 2         │
│    Description       │
├──────────────────────┤
│ ☑ Document 3         │
│    Description       │
└──────────────────────┘

Tablet/Desktop (2 columns)
┌──────────────────────┬──────────────────────┐
│ ☑ Document 1         │ ☑ Document 2         │
│    Description       │    Description       │
├──────────────────────┼──────────────────────┤
│ ☑ Document 3         │ ☑ Document 4         │
│    Description       │    Description       │
└──────────────────────┴──────────────────────┘
```

## State Management

```
┌─────────────────────────────────────────────────────────────┐
│              FORM STATE                                     │
└─────────────────────────────────────────────────────────────┘

Initial State
├─ applicationType: ""
├─ selectedDocuments: []
└─ documentsSection: hidden

After Type Selection
├─ applicationType: "Testimonial"
├─ availableDocuments: [...]
└─ documentsSection: visible

After Document Selection
├─ applicationType: "Testimonial"
├─ selectedDocuments: ["testimonial"]
└─ documentsSection: visible

After Form Submission
├─ applicationType: "Testimonial"
├─ selectedDocuments: ["testimonial"]
├─ fullNameEnglish: "John Doe"
├─ fullNameBangla: "জন ডো"
├─ ... (other fields)
└─ Status: submitted
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────┐
│              ERROR HANDLING                                 │
└─────────────────────────────────────────────────────────────┘

Form Submission
        │
        ▼
Check Documents Section Visible?
        │
    ┌───┴───┐
    │       │
   Yes      No
    │       │
    ▼       ▼
Check   Skip
Selected Validation
Docs    │
    │   ▼
    ▼   Continue
Found?  Submission
    │
┌───┴───┐
│       │
Yes     No
│       │
▼       ▼
Continue Show Error
Submission Toast
        │
        ▼
    "Please select
     at least one
     document"
        │
        ▼
    Stop Submission
```

---

**Diagrams Version:** 1.0.0
**Last Updated:** 2025-12-05
