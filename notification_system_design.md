# Notification System Design

# Stage 1: REST API Design

## API Endpoints

---

## 1. Create Notification

**POST** `/api/notifications`

### Request Body

```json
{
  "studentID": 1042,
  "type": "Result",
  "message": "Your exam results are available",
  "timestamp": "2024-05-06T10:30:00Z"
}
```

### Response

```json
{
  "id": "notif_123",
  "message": "Created successfully"
}
```

---

## 2. Get Notifications

**GET** `/api/notifications?studentID=1042&isRead=false`

### Response

```json
[
  {
    "id": "notif_123",
    "studentID": 1042,
    "type": "Result",
    "message": "Your exam results are available",
    "timestamp": "2024-05-06T10:30:00Z",
    "isRead": false
  }
]
```

---

## 3. Mark as Read

**PATCH** `/api/notifications/:id/read`

### Response

```json
{
  "message": "Marked as read"
}
```

---

## 4. Delete Notification

**DELETE** `/api/notifications/:id`

### Response

```http
204 No Content
```

---

# JSON Schema

```json
{
  "id": "string",
  "studentID": "number",
  "type": "Event | Result | Placement",
  "message": "string",
  "timestamp": "ISO date string",
  "isRead": "boolean"
}
```

---

# Stage 2: Database Design

## Database Choice: PostgreSQL

### Why PostgreSQL?

- Good for complex queries
- Handles large amounts of data efficiently
- Supports indexing for faster searching

---

## Database Schema

```sql
create table notifications (
  id uuid primary key,
  student_id integer not null,
  type varchar(50) check (type in ('Event', 'Result', 'Placement')),
  message text not null,
  timestamp timestamp not null,
  is_read boolean default false
);

create index idx_student_id
on notifications(student_id);

create index idx_timestamp
on notifications(timestamp desc);

create index idx_unread
on notifications(student_id, is_read);
```

---

# Problems & Solutions

## Problem 1: Database Size Increases

### Solution

- Delete notifications older than 90 days automatically

---

## Problem 2: Slow Queries with Large Data

### Solution

- Use indexes on frequently searched columns
- Use pagination with `limit`

Example:

```sql
limit 20;
```

---

## Problem 3: Too Many Writes at Once

### Solution

- Use batch inserts instead of inserting one row at a time

---

# Stage 3: Query Optimization

## Original Query

```sql
select *
from notifications
where student_id = 1042
  and is_read = false
order by timestamp asc;
```

---

## Problems in Original Query

- `select *` fetches unnecessary columns
- `asc` shows oldest notifications first
- No `limit` can return too many rows

---

## Optimized Query

```sql
select id, type, message, timestamp
from notifications
where student_id = 1042
  and is_read = false
order by timestamp desc
limit 50;
```

---

## Why the Optimized Query is Better

- Fetches only required columns
- Shows latest notifications first
- Limits returned rows for better performance

---

# Find Recent Placement Notifications

```sql
select student_id, message, timestamp
from notifications
where type = 'Placement'
  and timestamp >= now() - interval '7 days'
order by timestamp desc;
```