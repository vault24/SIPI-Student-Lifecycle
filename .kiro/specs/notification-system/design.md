# Design Document: Notification System

## Overview

The Notification System is a multi-layered architecture that handles notification creation, storage, delivery, and user management. It consists of:

- **Backend API**: Django REST endpoints for notification CRUD operations
- **Database Models**: PostgreSQL tables for notifications, preferences, and delivery logs
- **Real-time Engine**: WebSocket-based system for pushing notifications to connected clients
- **Frontend UI**: Notification center component with filtering, search, and preference management
- **Delivery Service**: Background task system for handling retries and email delivery

The system is designed to be scalable, reliable, and user-friendly, with support for multiple notification types and delivery channels.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Client)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Notification Center UI                              │   │
│  │  - Display notifications                             │   │
│  │  - Filter & Search                                   │   │
│  │  - Mark as read/archive/delete                       │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Real-time Connection Manager                        │   │
│  │  - WebSocket connection                              │   │
│  │  - Fallback polling                                  │   │
│  │  - Auto-reconnect logic                              │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Django)                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  REST API Endpoints                                  │   │
│  │  - POST /api/notifications/                          │   │
│  │  - GET /api/notifications/                           │   │
│  │  - PATCH /api/notifications/{id}/                    │   │
│  │  - DELETE /api/notifications/{id}/                   │   │
│  │  - GET /api/notification-preferences/                │   │
│  │  - PATCH /api/notification-preferences/              │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  WebSocket Handler                                   │   │
│  │  - Connection management                             │   │
│  │  - Real-time notification push                       │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Notification Service                                │   │
│  │  - Create notifications                              │   │
│  │  - Apply user preferences                            │   │
│  │  - Queue for delivery                                │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Delivery Service                                    │   │
│  │  - Retry logic with exponential backoff              │   │
│  │  - Email delivery                                    │   │
│  │  - Delivery status tracking                          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                  PostgreSQL Database                         │
│  - Notifications table                                       │
│  - NotificationPreferences table                             │
│  - DeliveryLog table                                         │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### Backend Components

#### 1. Notification Model
```python
class Notification(models.Model):
    recipient = ForeignKey(User)
    notification_type = CharField(choices=NOTIFICATION_TYPES)
    title = CharField(max_length=255)
    message = TextField()
    data = JSONField(default=dict)  # Additional context
    status = CharField(choices=['unread', 'read', 'archived', 'deleted'])
    created_at = DateTimeField(auto_now_add=True)
    read_at = DateTimeField(null=True)
    archived_at = DateTimeField(null=True)
    deleted_at = DateTimeField(null=True)
```

#### 2. NotificationPreference Model
```python
class NotificationPreference(models.Model):
    user = OneToOneField(User)
    notification_type = CharField()
    enabled = BooleanField(default=True)
    email_enabled = BooleanField(default=False)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
```

#### 3. DeliveryLog Model
```python
class DeliveryLog(models.Model):
    notification = ForeignKey(Notification)
    channel = CharField(choices=['in_app', 'email'])
    status = CharField(choices=['pending', 'delivered', 'failed'])
    retry_count = IntegerField(default=0)
    error_message = TextField(null=True)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
```

#### 4. REST API Endpoints

**Create Notification**
```
POST /api/notifications/
Request: {
    "recipient_id": int,
    "notification_type": string,
    "title": string,
    "message": string,
    "data": object (optional)
}
Response: {
    "id": int,
    "created_at": datetime,
    "status": "unread"
}
```

**List Notifications**
```
GET /api/notifications/?status=unread&type=application_status&search=query
Response: {
    "count": int,
    "results": [Notification]
}
```

**Update Notification Status**
```
PATCH /api/notifications/{id}/
Request: {
    "status": "read" | "archived" | "deleted"
}
Response: Notification
```

**Get Notification Preferences**
```
GET /api/notification-preferences/
Response: [NotificationPreference]
```

**Update Notification Preferences**
```
PATCH /api/notification-preferences/
Request: {
    "notification_type": string,
    "enabled": boolean,
    "email_enabled": boolean
}
Response: NotificationPreference
```

### Frontend Components

#### 1. NotificationCenter Component
- Displays list of notifications
- Supports filtering by type and date range
- Search functionality
- Mark as read/archive/delete actions
- Pagination support

#### 2. NotificationBell Component
- Shows unread notification count
- Dropdown preview of recent notifications
- Click to open full notification center

#### 3. NotificationPreferences Component
- Toggle switches for each notification type
- Email delivery options
- Save preferences

#### 4. RealTimeNotificationManager
- Manages WebSocket connection
- Handles reconnection logic
- Emits events for new notifications
- Fallback to polling if WebSocket unavailable

## Data Models

### Notification Types
```
- application_status: Application status changes
- document_approval: Document approval/rejection
- student_admission: Student admission decisions
- system_announcement: System-wide announcements
- deadline_reminder: Upcoming deadlines
- account_activity: Account-related activities
```

### Notification Status Flow
```
unread → read
unread → archived
unread → deleted
read → archived
read → deleted
archived → deleted
```

### Delivery Status Flow
```
pending → delivered
pending → failed
failed → pending (retry)
failed → failed (max retries exceeded)
```

## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Notification Creation Idempotence
*For any* notification creation request with identical parameters, creating the notification multiple times should result in only one notification being stored in the database.
**Validates: Requirements 6.2**

### Property 2: User Preference Enforcement
*For any* user with a disabled notification type preference, no notifications of that type should be delivered to that user, regardless of when the preference was set.
**Validates: Requirements 3.3**

### Property 3: Notification Status Transitions
*For any* notification, the status should only transition through valid states (unread → read/archived/deleted, read → archived/deleted, archived → deleted).
**Validates: Requirements 1.4**

### Property 4: Real-time Delivery Consistency
*For any* logged-in user, when a notification is created for them, the notification should appear in their notification center within 5 seconds without requiring a page refresh.
**Validates: Requirements 7.2**

### Property 5: Delivery Retry Behavior
*For any* failed notification delivery, the system should retry up to 3 times with exponential backoff before marking as permanently failed.
**Validates: Requirements 5.2**

### Property 6: Notification Data Persistence
*For any* notification marked as deleted, the notification should not appear in the user's notification center but should remain in the database for audit purposes.
**Validates: Requirements 8.3**

### Property 7: Announcement Group Delivery
*For any* announcement sent to a user group, all users in that group should receive a notification unless they have disabled that notification type.
**Validates: Requirements 2.2**

### Property 8: Notification Search Accuracy
*For any* search query, the returned notifications should contain the search term in either the title or message field.
**Validates: Requirements 4.3**

## Error Handling

### API Error Responses
- **400 Bad Request**: Invalid notification data (missing required fields, invalid type)
- **401 Unauthorized**: User not authenticated
- **403 Forbidden**: User attempting to access another user's notifications
- **404 Not Found**: Notification or preference not found
- **500 Internal Server Error**: Database or service errors

### Delivery Failures
- Log all delivery failures with error details
- Implement exponential backoff: 1s, 10s, 100s
- Alert administrators after 3 failed attempts
- Provide admin dashboard to view failed deliveries

### Connection Failures
- WebSocket connection loss triggers automatic reconnection
- Fallback to polling if WebSocket unavailable
- Queue notifications during disconnection, deliver on reconnection
- Display connection status indicator to user

## Testing Strategy

### Unit Testing
- Test notification creation with valid and invalid data
- Test preference enforcement logic
- Test status transition validation
- Test search and filter logic
- Test retry logic with mocked delays

### Property-Based Testing
- **Property 1**: Generate random notification creation requests and verify idempotence
- **Property 2**: Generate random users with preferences and verify enforcement
- **Property 3**: Generate random status transitions and verify validity
- **Property 4**: Simulate real-time delivery and verify timing
- **Property 5**: Simulate delivery failures and verify retry behavior
- **Property 6**: Generate delete operations and verify persistence
- **Property 7**: Generate announcements to groups and verify delivery
- **Property 8**: Generate search queries and verify accuracy

### Testing Framework
- **Backend**: Django TestCase with pytest for property-based testing using Hypothesis
- **Frontend**: Jest for unit tests, fast-check for property-based testing
- **Integration**: End-to-end tests using Selenium or Playwright

### Test Configuration
- Minimum 100 iterations per property-based test
- Mock external services (email, WebSocket)
- Use fixtures for test data
- Separate test database for isolation

