# API Reference Guide

## Authentication

### POST /api/signIn
**Description**: Authenticate user with username/email and password

**Request Body**:
```json
{
  "identifier": "string", // username or email
  "password": "string"
}
```

**Response (200)**:
```json
{
  "message": "Login successful",
  "user": {
    "_id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "role": "admin" | "employee",
    "designation": "string",
    "department": "string",
    "status": "string"
  }
}
```

---

### POST /api/logout
**Description**: Logout current user and clear authentication token

**Response (200)**:
```json
{
  "message": "Logout successful"
}
```

---

### GET /api/current-user
**Description**: Get current authenticated user information

**Headers**: `Authorization: Bearer <token>` (or cookie)

**Response (200)**:
```json
{
  "message": "Current user fetched successfully",
  "user": {
    "_id": "string",
    "username": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "role": "admin" | "employee",
    "designation": "string",
    "department": "string",
    "status": "string"
  }
}
```

---

## Employee Management (Admin Only)

### POST /api/admin/create-employee
**Description**: Create a new employee

**Authentication**: Admin role required

**Request Body**:
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "username": "string",
  "password": "string",
  "phone": "string",
  "designation": "string",
  "department": "string",
  "department_code": "string",
  "level": "string",
  "level_code": "string",
  "age": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "country": "string",
  "zip": "string",
  "dateOfBirth": "string",
  "dateOfJoining": "string",
  "workingHours": "string",
  "bloodGroup": "string"
}
```

**Response (201)**:
```json
{
  "message": "Employee created successfully",
  "employee": {
    "_id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "designation": "string",
    "department": "string",
    "status": "string"
  }
}
```

---

### GET /api/admin/get-all-employees
**Description**: Get all employees with pagination and filtering

**Authentication**: Admin role required

**Query Parameters**:
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `status`: "active" | "inactive" | "on_leave" | "all"
- `department`: string | "all"
- `level`: string | "all"
- `role`: "admin" | "employee" | "all"

**Response (200)**:
```json
{
  "message": "Employees fetched successfully",
  "employees": {
    "docs": [
      {
        "_id": "string",
        "firstName": "string",
        "lastName": "string",
        "email": "string",
        "role": "string",
        "designation": "string",
        "department": "string",
        "status": "string",
        "createdAt": "string"
      }
    ],
    "totalDocs": 0,
    "limit": 10,
    "page": 1,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

---

### GET /api/admin/get-employee
**Description**: Get single employee by ID

**Authentication**: Admin role required

**Query Parameters**:
- `id`: string (employee ID)

**Response (200)**:
```json
{
  "message": "Employee fetched successfully",
  "employee": {
    "_id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "username": "string",
    "role": "string",
    "designation": "string",
    "department": "string",
    "level": "string",
    "age": "string",
    "phone": "string",
    "address": "string",
    "city": "string",
    "state": "string",
    "country": "string",
    "zip": "string",
    "status": "string",
    "dateOfBirth": "string",
    "dateOfJoining": "string",
    "workingHours": "string",
    "bloodGroup": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

---

### PATCH /api/admin/update-employee-by-admin
**Description**: Update employee information

**Authentication**: Admin role required

**Request Body**:
```json
{
  "employeeId": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "role": "admin" | "employee",
  "designation": "string",
  "department": "string",
  "level": "string",
  "status": "active" | "inactive" | "on_leave",
  "age": "string",
  "phone": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "country": "string",
  "zip": "string",
  "dateOfJoining": "string",
  "workingHours": "string",
  "bloodGroup": "string"
}
```

**Response (200)**:
```json
{
  "message": "Employee updated successfully",
  "employee": {
    "_id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "role": "string",
    "designation": "string",
    "department": "string",
    "level": "string",
    "status": "string"
  }
}
```

---

### DELETE /api/admin/delete-employee
**Description**: Delete an employee

**Authentication**: Admin role required

**Request Body**:
```json
{
  "employeeId": "string"
}
```

**Response (200)**:
```json
{
  "message": "Employee deleted successfully",
  "deletedEmployee": {
    "_id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string"
  }
}
```

---

### PATCH /api/admin/promote-to-admin
**Description**: Promote employee to admin role

**Authentication**: Admin role required

**Request Body**:
```json
{
  "userId": "string"
}
```

**Response (200)**:
```json
{
  "message": "User promoted to admin"
}
```

---

### PATCH /api/admin/remove-admin
**Description**: Remove admin privileges from user

**Authentication**: Admin role required

**Request Body**:
```json
{
  "userId": "string"
}
```

**Response (200)**:
```json
{
  "message": "Admin privileges removed successfully"
}
```

---

## Attendance Management

### POST /api/attendance/mark-attendance
**Description**: Mark attendance for a user

**Request Body**:
```json
{
  "userId": "string",
  "dateOfWorking": "string", // YYYY-MM-DD format
  "dayOfWeek": "string",
  "loginTime": "string", // ISO timestamp
  "startLatitude": "number",
  "startLongitude": "number",
  "status": "present" | "absent" | "on_leave"
}
```

**Response (201)**:
```json
{
  "message": "Attendance marked successfully",
  "attendance": {
    "_id": "string",
    "user": "string",
    "dateOfWorking": "string",
    "dayOfWeek": "string",
    "loginTime": "string",
    "status": "string"
  }
}
```

---

### POST /api/attendance/logout-attendance
**Description**: Mark logout for a user

**Request Body**:
```json
{
  "userId": "string",
  "dateOfWorking": "string",
  "logoutTime": "string", // ISO timestamp
  "endLatitude": "number",
  "endLongitude": "number"
}
```

**Response (200)**:
```json
{
  "message": "Logout marked successfully",
  "attendance": {
    "_id": "string",
    "user": "string",
    "dateOfWorking": "string",
    "logoutTime": "string",
    "workingHoursCompleted": "boolean"
  }
}
```

---

### POST /api/attendance/start-break
**Description**: Start break for a user

**Request Body**:
```json
{
  "userId": "string",
  "dateOfWorking": "string",
  "breakStartTime": "string" // ISO timestamp
}
```

**Response (200)**:
```json
{
  "message": "Break started successfully",
  "attendance": {
    "_id": "string",
    "breakStartTime": "string"
  }
}
```

---

### POST /api/attendance/end-break
**Description**: End break for a user

**Request Body**:
```json
{
  "userId": "string",
  "dateOfWorking": "string",
  "breakEndTime": "string" // ISO timestamp
}
```

**Response (200)**:
```json
{
  "message": "Break ended successfully",
  "attendance": {
    "_id": "string",
    "breakEndTime": "string",
    "breakDuration": "number" // in milliseconds
  }
}
```

---

### GET /api/attendance/get-all-attendance
**Description**: Get attendance records with filtering

**Query Parameters**:
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `userId`: string | "all"
- `date`: string (YYYY-MM-DD) | "all"
- `status`: "present" | "absent" | "on_leave" | "all"
- `department`: string | "all"
- `sort`: "dateOfWorking" | "loginTime" | "user"

**Response (200)**:
```json
{
  "message": "Attendance records fetched successfully",
  "attendance": {
    "docs": [
      {
        "_id": "string",
        "user": {
          "_id": "string",
          "firstName": "string",
          "lastName": "string",
          "email": "string",
          "department": "string"
        },
        "dateOfWorking": "string",
        "dayOfWeek": "string",
        "loginTime": "string",
        "logoutTime": "string",
        "breakStartTime": "string",
        "breakEndTime": "string",
        "breakDuration": "number",
        "workingHoursCompleted": "boolean",
        "status": "string"
      }
    ],
    "totalDocs": 0,
    "limit": 10,
    "page": 1,
    "totalPages": 1
  }
}
```

---

### GET /api/attendance/get-attendance/[attendanceId]
**Description**: Get single attendance record by ID

**URL Parameters**:
- `attendanceId`: string

**Response (200)**:
```json
{
  "message": "Attendance record fetched successfully",
  "attendance": {
    "_id": "string",
    "user": {
      "_id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string"
    },
    "dateOfWorking": "string",
    "dayOfWeek": "string",
    "loginTime": "string",
    "logoutTime": "string",
    "breakStartTime": "string",
    "breakEndTime": "string",
    "breakDuration": "number",
    "workingHoursCompleted": "boolean",
    "status": "string"
  }
}
```

---

### PUT /api/admin/update-attendance
**Description**: Update attendance record (Admin only)

**Authentication**: Admin role required

**Request Body**:
```json
{
  "attendanceId": "string",
  "loginTime": "string", // ISO timestamp
  "logoutTime": "string", // ISO timestamp
  "breakStartTime": "string", // ISO timestamp
  "breakEndTime": "string", // ISO timestamp
  "breakDuration": "number", // in milliseconds
  "status": "present" | "absent" | "on_leave",
  "workingHoursCompleted": "boolean"
}
```

**Response (200)**:
```json
{
  "message": "Attendance updated successfully",
  "attendance": {
    "_id": "string",
    "user": {
      "_id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string"
    },
    "dateOfWorking": "string",
    "loginTime": "string",
    "logoutTime": "string",
    "status": "string",
    "workingHoursCompleted": "boolean"
  }
}
```

---

## Profile Management

### PATCH /api/employee/update-employee-by-self
**Description**: Update own profile information

**Authentication**: Required (any role)

**Request Body**:
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "age": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "country": "string",
  "zip": "string",
  "designation": "string"
}
```

**Response (200)**:
```json
{
  "message": "Profile updated successfully",
  "user": {
    "_id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "age": "string",
    "address": "string",
    "city": "string",
    "state": "string",
    "country": "string",
    "zip": "string",
    "designation": "string"
  }
}
```

---

### PATCH /api/admin/edit-admin-profile
**Description**: Update admin profile information

**Authentication**: Admin role required

**Request Body**:
```json
{
  "username": "string",
  "email": "string",
  "designation": "string"
}
```

**Response (200)**:
```json
{
  "message": "Admin profile updated successfully",
  "admin": {
    "_id": "string",
    "username": "string",
    "email": "string",
    "role": "admin",
    "designation": "string"
  }
}
```

---

## Password Management

### POST /api/forgot-password
**Description**: Request password reset email

**Request Body**:
```json
{
  "email": "string"
}
```

**Response (200)**:
```json
{
  "message": "If an account with that email exists, we've sent a password reset link to it."
}
```

---

### POST /api/reset-password/validate
**Description**: Validate password reset token

**Request Body**:
```json
{
  "token": "string"
}
```

**Response (200)**:
```json
{
  "message": "Token is valid",
  "userId": "string"
}
```

---

### POST /api/reset-password
**Description**: Reset password with valid token

**Request Body**:
```json
{
  "token": "string",
  "password": "string"
}
```

**Response (200)**:
```json
{
  "message": "Password has been successfully reset. You can now sign in with your new password."
}
```

---

### POST /api/change-password
**Description**: Change current user's password

**Authentication**: Required

**Request Body**:
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Response (200)**:
```json
{
  "message": "Password changed successfully"
}
```

---

## Error Responses

### Common Error Formats

**400 Bad Request**:
```json
{
  "error": "Validation error message"
}
```

**401 Unauthorized**:
```json
{
  "error": "Unauthorized access"
}
```

**403 Forbidden**:
```json
{
  "error": "Access denied. Admin privileges required."
}
```

**404 Not Found**:
```json
{
  "error": "Resource not found"
}
```

**409 Conflict**:
```json
{
  "error": "Resource already exists"
}
```

**500 Internal Server Error**:
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

- **Authentication endpoints**: 10 requests per minute per IP
- **General API endpoints**: 100 requests per minute per user
- **File upload endpoints**: 5 requests per minute per user

---

## Data Validation

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Email Validation
- Valid email format
- Maximum 254 characters

### Phone Validation
- Minimum 10 digits
- International format supported (+country code)

### Date Validation
- ISO 8601 format (YYYY-MM-DD)
- Date of birth: Must be at least 18 years old
- Date of joining: Cannot be in the future

---

## Pagination

All paginated endpoints return the following structure:

```json
{
  "docs": [], // Array of documents
  "totalDocs": 0, // Total number of documents
  "limit": 10, // Number of documents per page
  "page": 1, // Current page number
  "totalPages": 1, // Total number of pages
  "hasNextPage": false, // Whether there's a next page
  "hasPrevPage": false, // Whether there's a previous page
  "nextPage": null, // Next page number (if exists)
  "prevPage": null // Previous page number (if exists)
}
```

---

## Authentication Headers

### JWT Token
Include the JWT token in requests using one of these methods:

**Cookie (Recommended)**:
```
Cookie: accessToken=<jwt_token>
```

**Authorization Header**:
```
Authorization: Bearer <jwt_token>
```

### Token Expiration
- Default expiration: 7 days
- Refresh: Re-authenticate to get new token
- Auto-logout: Client should handle token expiration

---

*Last updated: January 2024*
