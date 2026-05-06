# Notification System Design

## API Endpoints

---

## 1. Create Notification

**POST** `/api/notifications`

### Request Body

```json
{
  "studentID": 1042,
  "type": "Result",
  "message": "Your exam results are available"
}
```

### Response

```http
201 Created
```

---

## 2. Get My Notifications

**GET** `/api/notifications?studentID=1042`

### Response

```json
[
  {
    "id": "123",
    "type": "Result",
    "message": "Your exam results are available",
    "time": "2024-05-06 10:30 AM",
    "read": false
  }
]
```

---

## 3. Mark as Read

**PATCH** `/api/notifications/123/read`

### Response

```http
200 OK
```

---

## 4. Delete Notification

**DELETE** `/api/notifications/123`

### Response

```http
204 No Content
```

---

# Database (PostgreSQL)

## Table: notifications

```sql
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL,
  type VARCHAR(50),
  message TEXT,
  timestamp TIMESTAMP DEFAULT NOW(),
  is_read BOOLEAN DEFAULT false
);

-- Speed up queries
CREATE INDEX ON notifications(student_id);
CREATE INDEX ON notifications(student_id, is_read);
```

---

# Common Problems & Solutions

## Problem 1: Too many old notifications

- Delete notifications older than 3 months automatically

---

## Problem 2: Slow when many students

- Add indexes (already done above)
- Show only 20 notifications at a time

---

## Problem 3: Many notifications sent at once

- Insert multiple notifications together instead of one-by-one

---

# Example Query

```sql
-- Get unread notifications for a student
SELECT * FROM notifications
WHERE student_id = 1042
  AND is_read = false
ORDER BY timestamp DESC
LIMIT 20;
```

---

