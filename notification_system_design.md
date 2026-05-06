# Stage 1: Notification System Design

## REST API Endpoints

---

## 1. Create Notification

- **Endpoint:** `POST /api/notifications`

### Request Body

```json
{
  "studentID": 1042,
  "type": "Result",
  "message": "Your exam results are available",
  "timestamp": "2024-05-06T10:30:00Z"
}
```

### Response — `201 Created`

```json
{
  "id": "notif_123",
  "message": "Notification created successfully"
}
```

---

## 2. Get All Notifications

- **Endpoint:** `GET /api/notifications`

### Query Parameters

| Parameter   | Type    | Required | Description                    |
|------------|---------|----------|--------------------------------|
| studentID  | Integer | Yes      | Student identifier             |
| isRead     | Boolean | No       | Filter read/unread notifications |

### Example Request

```http
GET /api/notifications?studentID=1042&isRead=false
```

### Response — `200 OK`

```json
{
  "notifications": [
    {
      "id": "notif_123",
      "studentID": 1042,
      "type": "Result",
      "message": "Your exam results are available",
      "timestamp": "2024-05-06T10:30:00Z",
      "isRead": false
    }
  ]
}
```

---

## 3. Get Single Notification

- **Endpoint:** `GET /api/notifications/:id`

### Example Request

```http
GET /api/notifications/notif_123
```

### Response — `200 OK`

```json
{
  "id": "notif_123",
  "studentID": 1042,
  "type": "Result",
  "message": "Your exam results are available",
  "timestamp": "2024-05-06T10:30:00Z",
  "isRead": false
}
```

---

## 4. Mark Notification as Read

- **Endpoint:** `PATCH /api/notifications/:id/read`

### Example Request

```http
PATCH /api/notifications/notif_123/read
```

### Response — `200 OK`

```json
{
  "message": "Notification marked as read"
}
```

---

## 5. Delete Notification

- **Endpoint:** `DELETE /api/notifications/:id`

### Example Request

```http
DELETE /api/notifications/notif_123
```

### Response — `204 No Content`

---

# Headers Structure

All requests must include:

```http
Content-Type: application/json
Authorization: Bearer <token>
X-Request-ID: <unique_id>
```

---

# JSON Schema

## Notification Object Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": [
    "studentID",
    "type",
    "message",
    "timestamp"
  ],
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique notification identifier"
    },
    "studentID": {
      "type": "integer",
      "description": "Student identifier"
    },
    "type": {
      "type": "string",
      "enum": [
        "Event",
        "Result",
        "Placement"
      ],
      "description": "Notification category"
    },
    "message": {
      "type": "string",
      "description": "Notification content"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 timestamp"
    },
    "isRead": {
      "type": "boolean",
      "default": false,
      "description": "Read status"
    }
  }
}
```