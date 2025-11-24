# 📍 Feature Locations in the UI

## Where to Find the Features

### 🔴 Delete with Math Verification

#### Location 1: Student List Page
```
Dashboard → Students → All Students
```
- In the table, each student row has action buttons
- Click the red "Delete" button with trash icon
- Math verification modal appears

#### Location 2: Student Details Page
```
Dashboard → Students → Click any student → Student Details
```
- On the right side, there are 3 buttons
- Bottom button is red "Delete" with trash icon
- Click it to see math verification modal

### 🟢 Download Options

#### Location: Student Details Page Only
```
Dashboard → Students → Click any student → Student Details
```
- On the right side, there are 3 buttons
- Top button is green "Download" with download icon
- Click it to see download options modal

---

## Visual Layout

### Student List Page
```
┌─────────────────────────────────────────────────────────┐
│  All Students                          [+ Add Student]   │
├─────────────────────────────────────────────────────────┤
│  Search: [________________]  [Semester ▼]  [Status ▼]   │
├─────────────────────────────────────────────────────────┤
│  Student    │ Roll │ Semester │ Dept │ Status │ Actions │
├─────────────────────────────────────────────────────────┤
│  John Doe   │ 101  │ Sem 3    │ CSE  │ Active │ 👁 View │
│  📷 Photo   │      │          │      │        │ 🗑 Delete│ ← Click here
├─────────────────────────────────────────────────────────┤
```

### Student Details Page
```
┌─────────────────────────────────────────────────────────┐
│  ← Student Details                                       │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────┬──────────────┐│
│  │  📷                                   │ ┌──────────┐ ││
│  │  Profile Photo                       │ │ Download │ │← Click here (GREEN)
│  │                                      │ └──────────┘ ││
│  │  John Doe                            │ ┌──────────┐ ││
│  │  #101 │ Sem 3 │ CSE                 │ │   Edit   │ ││
│  │  [Active]                            │ └──────────┘ ││
│  │                                      │ ┌──────────┐ ││
│  │                                      │ │  Delete  │ │← Click here (RED)
│  │                                      │ └──────────┘ ││
│  └──────────────────────────────────────┴──────────────┘│
│                                                          │
│  Personal Information    │    Contact Information       │
│  Academic Information    │    Documents                 │
└─────────────────────────────────────────────────────────┘
```

---

## Modal Appearances

### Delete Verification Modal
```
┌─────────────────────────────────────────┐
│  ⚠️  Delete Student - Verification      │
│                                         │
│  You are about to permanently delete    │
│  John Doe. This action cannot be undone │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ To confirm deletion, solve this:  │ │
│  │                                   │ │
│  │         15 + 23 = ?               │ │ ← Random math problem
│  │                                   │ │
│  │  [    Enter answer    ]           │ │ ← Input field
│  │                                   │ │
│  └───────────────────────────────────┘ │
│                                         │
│         [Cancel]  [Verify & Delete]     │
└─────────────────────────────────────────┘
```

### Download Options Modal
```
┌─────────────────────────────────────────┐
│  📥 Download Student Data               │
│                                         │
│  Select what you want to download for   │
│  John Doe:                              │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ 👤 Student Information            │ │ ← Click to download
│  │    Personal, contact, academic    │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ 📄 Documents List                 │ │ ← Click to download
│  │    5 documents metadata           │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ 🏆 Testimonial Data               │ │ ← Click to download
│  │    Academic records & achievements│ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ 📦 Complete Profile               │ │ ← Click to download (Recommended)
│  │    All data including documents   │ │
│  └───────────────────────────────────┘ │
│                                         │
│              [Cancel]                   │
└─────────────────────────────────────────┘
```

---

## Step-by-Step Testing Guide

### Test Delete Feature

1. **Open the application** in your browser (e.g., `http://localhost:8000`)

2. **Navigate to Students**
   - Click "Students" in the sidebar OR
   - Click "View All Students" on dashboard

3. **Find a student** in the list

4. **Click the red "Delete" button** (trash icon)

5. **See the math verification modal**
   - Warning message appears
   - Random math problem is shown
   - Input field is auto-focused

6. **Try wrong answer first**
   - Type any wrong number
   - Click "Verify & Delete" or press Enter
   - See error message: "Incorrect answer. Please try again."
   - Input field clears and gets red border animation

7. **Enter correct answer**
   - Calculate the correct answer
   - Type it in the input field
   - Click "Verify & Delete" or press Enter
   - Student is deleted
   - Success toast appears
   - You're redirected to student list

### Test Download Feature

1. **Open the application** in your browser

2. **Navigate to a Student Details page**
   - Click "Students" in sidebar
   - Click "View" (eye icon) on any student

3. **Click the green "Download" button**
   - It's at the top right of the profile section
   - Has a download icon

4. **See the download options modal**
   - 4 beautiful cards appear
   - Each with icon, title, and description

5. **Click "Student Information"**
   - File downloads automatically
   - Success toast appears: "Student information downloaded"
   - Modal closes
   - Check your Downloads folder for `Student_Info_101.json`

6. **Open the downloaded file**
   - Open with text editor or JSON viewer
   - Verify it contains personal, contact, and academic info

7. **Repeat for other options**
   - Try "Documents List"
   - Try "Testimonial Data"
   - Try "Complete Profile" (largest file)

---

## Keyboard Shortcuts

### Delete Modal
- **Enter**: Submit answer
- **ESC**: Cancel and close modal

### Download Modal
- **ESC**: Close modal

---

## Expected Behavior

### Delete Feature
✅ Modal appears with warning  
✅ Random math problem (different each time)  
✅ Wrong answer shows error  
✅ Correct answer deletes student  
✅ Success notification  
✅ Redirects to student list  

### Download Feature
✅ Modal appears with 4 options  
✅ Clicking any option downloads file  
✅ File name includes roll number  
✅ JSON format (readable)  
✅ Success notification  
✅ Modal auto-closes  

---

## Troubleshooting

### If Delete Button Doesn't Work
- Check browser console for errors
- Ensure `dataManager.deleteStudent()` exists
- Verify modal container exists in HTML

### If Download Button Doesn't Work
- Check browser console for errors
- Ensure `utils.downloadJSON()` exists
- Check browser's download settings
- Verify pop-up blocker isn't blocking downloads

### If Math Problem Doesn't Appear
- Check if Lucide icons are loading
- Verify modal HTML is rendering
- Check CSS for modal visibility

---

## Browser Compatibility

✅ Chrome/Edge (Recommended)  
✅ Firefox  
✅ Safari  
⚠️ IE11 (Not supported)  

---

## File Download Locations

By default, files download to:
- **Windows**: `C:\Users\{YourName}\Downloads\`
- **Mac**: `/Users/{YourName}/Downloads/`
- **Linux**: `/home/{YourName}/Downloads/`

File naming pattern:
- `Student_Info_{rollNumber}.json`
- `Documents_List_{rollNumber}.json`
- `Testimonial_{rollNumber}.json`
- `Complete_Profile_{rollNumber}.json`
