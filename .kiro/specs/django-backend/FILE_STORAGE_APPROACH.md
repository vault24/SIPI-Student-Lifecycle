# File Storage Approach

## Overview

The Django backend will store uploaded files (student photos and documents) directly in the frontend's assets directory at `client/assets/images/`. The PostgreSQL database will only store the relative file paths, not the actual files.

## Directory Structure

```
project-root/
├── client/                          # Frontend
│   └── assets/
│       └── images/
│           ├── students/            # Student profile photos
│           │   ├── photo_001.jpg
│           │   ├── photo_002.png
│           │   └── ...
│           └── documents/           # Student documents
│               ├── doc_001.pdf
│               ├── doc_002.pdf
│               └── ...
└── server/                          # Django backend
    ├── manage.py
    ├── utils/
    │   └── file_handler.py          # Utility for saving files
    └── apps/
        ├── students/
        └── documents/
```

## Implementation Details

### 1. File Upload Flow

**Student Photo Upload:**
1. Frontend sends POST request to `/api/students/{id}/upload-photo/` with image file
2. Django validates file type (jpg, png) and size (max 5MB)
3. Django saves file to `../client/assets/images/students/` with unique filename
4. Django stores relative path in database: `"students/photo_123.jpg"`
5. Django returns the relative path in API response
6. Frontend uses the path to display image: `<img src="assets/images/students/photo_123.jpg">`

**Document Upload:**
1. Frontend sends POST request to `/api/documents/` with PDF file
2. Django validates file type (pdf) and size (max 10MB)
3. Django saves file to `../client/assets/images/documents/` with unique filename
4. Django stores relative path in database: `"documents/doc_456.pdf"`
5. Django returns the relative path in API response
6. Frontend uses the path to display/download: `<a href="assets/images/documents/doc_456.pdf">`

### 2. Database Schema

**Student Model:**
```python
class Student(models.Model):
    # ... other fields ...
    profilePhoto = models.CharField(max_length=500, blank=True)
    # Stores: "students/photo_123.jpg"
```

**Document Model:**
```python
class Document(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    fileName = models.CharField(max_length=255)
    fileType = models.CharField(max_length=50)
    category = models.CharField(max_length=50)
    filePath = models.CharField(max_length=500)  # Stores: "documents/doc_456.pdf"
    fileSize = models.IntegerField()
    uploadDate = models.DateTimeField(auto_now_add=True)
```

### 3. File Handler Utility

**Location:** `server/utils/file_handler.py`

```python
import os
import uuid
from pathlib import Path

def save_uploaded_file(uploaded_file, subdirectory):
    """
    Save uploaded file to client/assets/images/{subdirectory}/
    
    Args:
        uploaded_file: Django UploadedFile object
        subdirectory: 'students' or 'documents'
    
    Returns:
        str: Relative path (e.g., "students/photo_123.jpg")
    """
    # Get project root (server directory)
    base_dir = Path(__file__).resolve().parent.parent
    
    # Navigate to client/assets/images/
    upload_dir = base_dir.parent / 'client' / 'assets' / 'images' / subdirectory
    
    # Create directory if it doesn't exist
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate unique filename
    ext = uploaded_file.name.split('.')[-1]
    filename = f"{uuid.uuid4().hex}.{ext}"
    
    # Full file path
    file_path = upload_dir / filename
    
    # Save file
    with open(file_path, 'wb+') as destination:
        for chunk in uploaded_file.chunks():
            destination.write(chunk)
    
    # Return relative path for database
    return f"{subdirectory}/{filename}"

def delete_file(relative_path):
    """
    Delete file from client/assets/images/
    
    Args:
        relative_path: Path like "students/photo_123.jpg"
    """
    base_dir = Path(__file__).resolve().parent.parent
    file_path = base_dir.parent / 'client' / 'assets' / 'images' / relative_path
    
    if file_path.exists():
        file_path.unlink()
```

### 4. API Response Format

**Student Detail Response:**
```json
{
  "id": "uuid-123",
  "fullNameEnglish": "John Doe",
  "profilePhoto": "students/photo_123.jpg",
  "...": "other fields"
}
```

**Document List Response:**
```json
[
  {
    "id": "uuid-456",
    "studentId": "uuid-123",
    "fileName": "NID_Card.pdf",
    "fileType": "application/pdf",
    "category": "NID",
    "filePath": "documents/doc_456.pdf",
    "fileSize": 1024000,
    "uploadDate": "2024-01-15T10:30:00Z"
  }
]
```

### 5. Frontend Usage

**Display Student Photo:**
```javascript
// API returns: { profilePhoto: "students/photo_123.jpg" }
const photoUrl = `assets/images/${student.profilePhoto}`;
// Result: "assets/images/students/photo_123.jpg"

// In HTML:
<img src="${photoUrl}" alt="Student Photo">
```

**Display/Download Document:**
```javascript
// API returns: { filePath: "documents/doc_456.pdf" }
const docUrl = `assets/images/${document.filePath}`;
// Result: "assets/images/documents/doc_456.pdf"

// In HTML:
<a href="${docUrl}" target="_blank">View Document</a>
```

## Benefits of This Approach

1. **Simple Frontend Integration**: Frontend can directly access files without API calls
2. **No CORS Issues**: Files are served from the same origin as the frontend
3. **Fast File Access**: No need to proxy files through Django
4. **Clear Separation**: Database stores metadata, filesystem stores files
5. **Easy Backup**: Files are in the frontend directory, easy to backup with frontend code
6. **Development Simplicity**: No need to configure Django media serving

## File Deletion

When a document is deleted:
1. Django receives DELETE request to `/api/documents/{id}/`
2. Django retrieves the document record from database
3. Django deletes the physical file from `client/assets/images/documents/`
4. Django deletes the database record
5. Both file and record are removed

## Security Considerations

1. **File Type Validation**: Only allow jpg, png for photos; pdf for documents
2. **File Size Limits**: 5MB for images, 10MB for documents
3. **Unique Filenames**: Use UUID to prevent filename conflicts and guessing
4. **Path Validation**: Ensure uploaded paths don't escape the intended directory
5. **Access Control**: (Future) Add authentication to prevent unauthorized uploads

## Migration from localStorage

When migrating from the current localStorage implementation:
1. Existing mock data uses URLs like `https://ui-avatars.com/api/?name=...`
2. These will be replaced with actual uploaded files
3. Database will store relative paths instead of full URLs
4. Frontend will construct full paths by prepending `assets/images/`
