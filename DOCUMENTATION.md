# Austrange Employee Management System - Complete Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Getting Started](#getting-started)
5. [Features & Modules](#features--modules)
6. [API Documentation](#api-documentation)
7. [Database Schema](#database-schema)
8. [Authentication & Authorization](#authentication--authorization)
9. [User Interface & Components](#user-interface--components)
10. [Deployment Guide](#deployment-guide)
11. [Development Guidelines](#development-guidelines)
12. [Troubleshooting](#troubleshooting)

---

## Project Overview

The **Austrange Employee Management System** is a comprehensive web application designed to manage employee data, attendance tracking, and administrative tasks for Austrange Solutions. The system provides role-based access control with separate interfaces for administrators and employees.

### Key Features
- **Role-based Dashboard**: Separate interfaces for admins and employees
- **Employee Management**: Complete CRUD operations for employee data
- **Attendance Tracking**: Real-time attendance marking with geolocation
- **ID Card Generation**: Digital employee ID cards with print functionality
- **Password Management**: Secure password reset and change functionality
- **Responsive Design**: Works across desktop and mobile devices

### Project Structure
```
austrange-employee-management/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── signin/            # Authentication pages
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Shadcn/UI components
│   │   ├── Attendance/       # Attendance-specific components
│   │   └── auth/             # Authentication components
│   ├── helpers/              # Utility functions
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Library configurations
│   ├── models/               # MongoDB models
│   ├── schema/               # Zod validation schemas
│   ├── store/                # Zustand state management
│   └── utils/                # Utility functions
├── public/                   # Static assets
├── package.json             # Dependencies and scripts
└── README.md               # Basic project information
```

---

## Technology Stack

### Frontend
- **Next.js 15.3.3**: React framework with App Router
- **React 19.0.0**: UI library with latest features
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/UI**: Modern component library
- **Lucide React**: Icon library

### Backend
- **Next.js API Routes**: Server-side API endpoints
- **Node.js**: Runtime environment
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB

### State Management & Forms
- **Zustand**: Lightweight state management
- **React Hook Form**: Form state management
- **Zod**: Schema validation

### Authentication & Security
- **JSON Web Tokens (JWT)**: Authentication tokens
- **bcryptjs**: Password hashing
- **Middleware**: Route protection

### Email & Communication
- **Resend**: Email service provider
- **HTML Email Templates**: Custom email designs

### Development Tools
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Turbopack**: Fast bundler (development)

---

## System Architecture

### Architecture Overview
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (API Routes)  │◄──►│   (MongoDB)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌─────────────┐    ┌─────────────────┐    ┌─────────────────┐
    │   UI        │    │   Middleware    │    │   Models        │
    │   Components│    │   & Helpers     │    │   & Schemas     │
    └─────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Flow
1. **User Authentication**: JWT-based authentication with role-based access
2. **API Layer**: RESTful APIs for all CRUD operations
3. **Database Layer**: MongoDB with Mongoose ODM
4. **State Management**: Zustand for global state, React Hook Form for form state

---

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sahil1330/austrange-employee-management.git
   cd austrange-employee-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/austrange-employee-management
   TOKEN_SECRET=your-secret-key-here
   RESEND_API_KEY=your-resend-api-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Sign in with your credentials or create an admin account

### Scripts
- `npm run dev`: Start development server with Turbopack
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

---

## Features & Modules

### 1. Authentication System
- **Unified Sign-in**: Single login for both admin and employee
- **Role-based Redirects**: Automatic dashboard routing based on user role
- **Password Reset**: Email-based password recovery
- **Session Management**: JWT-based authentication with 7-day expiry

### 2. Admin Dashboard
- **Employee Overview**: Total, active, inactive employees
- **Department Statistics**: Employee distribution across departments
- **Recent Activity**: Latest employee additions and updates
- **Quick Actions**: Direct access to common admin tasks

### 3. Employee Dashboard
- **Personal Information**: Profile overview and work details
- **Attendance Summary**: Working hours, tenure, and status
- **Quick Actions**: Profile editing and password change

### 4. Employee Management (Admin Only)
- **Add Employee**: Complete employee onboarding form
- **Edit Employee**: Update employee information
- **Delete Employee**: Remove employee records
- **Bulk Operations**: Filter and manage multiple employees
- **Role Management**: Promote/demote admin privileges

### 5. Attendance System
- **Real-time Tracking**: Mark attendance with geolocation
- **Break Management**: Track break times and duration
- **Working Hours**: Monitor daily working hours completion
- **Attendance History**: View past attendance records
- **Admin Editing**: Admins can edit attendance records

### 6. Profile Management
- **Personal Information**: Update contact details and address
- **ID Card Generation**: Digital employee ID cards
- **Profile Pictures**: Avatar system with initials fallback
- **Password Change**: Secure password update functionality

### 7. Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Responsive layouts for tablets
- **Desktop Enhancement**: Full-featured desktop experience

---

## API Documentation

### Authentication Endpoints

#### POST /api/signIn
Sign in user with username/email and password.

**Request Body:**
```json
{
  "identifier": "username or email",
  "password": "password"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

#### POST /api/logout
Log out current user.

**Response:**
```json
{
  "message": "Logout successful"
}
```

#### GET /api/current-user
Get current authenticated user details.

**Response:**
```json
{
  "message": "Current user fetched successfully",
  "user": {
    "_id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

### Employee Management Endpoints

#### POST /api/admin/create-employee
Create a new employee (Admin only).

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "password123",
  "phone": "1234567890",
  "designation": "Developer",
  "department": "Engineering",
  "level": "Senior",
  "workingHours": "8:00"
}
```

#### GET /api/admin/get-all-employees
Get all employees with pagination and filtering.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status
- `department`: Filter by department
- `level`: Filter by level

#### PATCH /api/admin/update-employee-by-admin
Update employee information (Admin only).

**Request Body:**
```json
{
  "employeeId": "employee_id",
  "firstName": "Updated Name",
  "status": "active"
}
```

#### DELETE /api/admin/delete-employee
Delete an employee (Admin only).

**Request Body:**
```json
{
  "employeeId": "employee_id"
}
```

### Attendance Endpoints

#### POST /api/attendance/mark-attendance
Mark attendance for an employee.

**Request Body:**
```json
{
  "userId": "user_id",
  "dateOfWorking": "2024-01-15",
  "dayOfWeek": "Monday",
  "loginTime": "2024-01-15T09:00:00Z",
  "startLatitude": 12.9716,
  "startLongitude": 77.5946,
  "status": "present"
}
```

#### POST /api/attendance/logout-attendance
Mark logout for an employee.

**Request Body:**
```json
{
  "userId": "user_id",
  "dateOfWorking": "2024-01-15",
  "logoutTime": "2024-01-15T18:00:00Z",
  "endLatitude": 12.9716,
  "endLongitude": 77.5946
}
```

#### GET /api/attendance/get-all-attendance
Get attendance records with filtering.

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `userId`: Filter by user ID
- `date`: Filter by date
- `status`: Filter by status

#### PUT /api/admin/update-attendance
Update attendance record (Admin only).

**Request Body:**
```json
{
  "attendanceId": "attendance_id",
  "loginTime": "2024-01-15T09:00:00Z",
  "logoutTime": "2024-01-15T18:00:00Z",
  "status": "present",
  "workingHoursCompleted": true
}
```

### Password Management Endpoints

#### POST /api/forgot-password
Request password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

#### POST /api/reset-password
Reset password with token.

**Request Body:**
```json
{
  "token": "reset_token",
  "password": "new_password"
}
```

#### POST /api/change-password
Change current user's password.

**Request Body:**
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
```

---

## Database Schema

### User Model
```typescript
interface TUser {
  _id?: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'admin' | 'employee';
  designation?: string;
  department?: string;
  department_code?: string;
  level?: string;
  level_code?: string;
  age?: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  dateOfBirth?: string;
  dateOfJoining?: string;
  dateOfLeaving?: string;
  profilePicture?: string;
  bloodGroup?: string;
  workingHours?: string;
  status: 'active' | 'inactive' | 'on_leave' | 'on_break';
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
```

### Attendance Model
```typescript
interface TAttendance {
  _id?: string;
  user: TUser;
  dateOfWorking: Date;
  dayOfWeek: string;
  loginTime: Date;
  logoutTime?: Date;
  breakStartTime?: Date;
  breakEndTime?: Date;
  breakDuration?: number;
  startLatitude?: number;
  startLongitude?: number;
  endLatitude?: number;
  endLongitude?: number;
  workingHoursCompleted?: boolean;
  status?: 'present' | 'absent' | 'on_leave';
  createdAt?: Date;
  updatedAt?: Date;
}
```

### Database Indexes
- User email (unique)
- User username (unique)
- Attendance user + dateOfWorking (compound, unique)

---

## Authentication & Authorization

### JWT Token Structure
```json
{
  "_id": "user_id",
  "username": "johndoe",
  "role": "admin",
  "exp": 1640995200
}
```

### Role-based Access Control
- **Admin**: Full access to all features
- **Employee**: Limited access to personal data and attendance

### Middleware Protection
Protected routes automatically redirect unauthenticated users to signin page.

### Password Security
- Passwords hashed with bcryptjs (salt rounds: 10)
- Password strength validation
- Secure password reset with expiring tokens

---

## User Interface & Components

### Core Components

#### Layout Components
- **DashboardLayout**: Main dashboard wrapper with navigation
- **UnifiedLayout**: Shared layout for authentication pages
- **Sidebar**: Navigation sidebar with role-based menu items

#### Form Components
- **Form Controls**: Input, Select, Textarea with validation
- **Employee Forms**: Add/Edit employee with comprehensive validation
- **Attendance Forms**: Mark attendance with geolocation

#### Data Display
- **AttendanceTable**: Sortable attendance records with actions
- **EmployeeTable**: Employee list with search and filtering
- **DataTable**: Reusable table component with pagination

#### Specialized Components
- **EmployeeIdCard**: Digital ID card with print functionality
- **Dashboard Cards**: Statistics and quick action cards
- **Profile Components**: User profile display and editing

### Design System
- **Color Palette**: Blue-purple gradient theme
- **Typography**: Geist Sans font family
- **Spacing**: Consistent 4px grid system
- **Responsive**: Mobile-first design approach

---

## Deployment Guide

### Environment Variables
```env
# Database
MONGODB_URI=mongodb://localhost:27017/austrange-employee-management

# Authentication
TOKEN_SECRET=your-secret-key-here

# Email Service
RESEND_API_KEY=your-resend-api-key

# Application
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Build Process
1. Install dependencies: `npm install`
2. Build application: `npm run build`
3. Start production server: `npm run start`

### Deployment Platforms
- **Vercel**: Automatic deployment from Git repository
- **Netlify**: Static site hosting with serverless functions
- **Digital Ocean**: VPS with PM2 process manager
- **AWS**: EC2 with Load Balancer and RDS

### Database Deployment
- **MongoDB Atlas**: Cloud MongoDB service
- **Local MongoDB**: Self-hosted database
- **Docker**: Containerized database deployment

---

## Development Guidelines

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with custom rules
- **Prettier**: Code formatting (recommended)
- **Naming Conventions**: camelCase for variables, PascalCase for components

### Component Structure
```typescript
// Component Template
import React from 'react';
import { ComponentProps } from './types';

interface Props extends ComponentProps {
  customProp: string;
}

const MyComponent: React.FC<Props> = ({ customProp, ...props }) => {
  return (
    <div {...props}>
      {/* Component content */}
    </div>
  );
};

export default MyComponent;
```

### API Route Structure
```typescript
// API Route Template
import { NextRequest, NextResponse } from 'next/server';
import { getDataFromToken } from '@/helpers/getDataFromToken';

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const token = await getDataFromToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Business logic
    const data = await request.json();
    
    return NextResponse.json({ message: 'Success', data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Git Workflow
1. **Feature Branches**: Create feature branches from main
2. **Commit Messages**: Use conventional commit format
3. **Pull Requests**: Code review before merging
4. **Testing**: Test thoroughly before deployment

---

## Troubleshooting

### Common Issues

#### Database Connection
**Problem**: MongoDB connection failed
**Solution**: 
- Check MONGODB_URI in environment variables
- Ensure MongoDB service is running
- Verify network connectivity

#### Authentication Issues
**Problem**: JWT token invalid or expired
**Solution**:
- Check TOKEN_SECRET configuration
- Verify token expiration time
- Clear browser cookies and re-login

#### Build Errors
**Problem**: TypeScript compilation errors
**Solution**:
- Run `npm run lint` to check for errors
- Fix type mismatches
- Update dependencies if needed

#### Email Service
**Problem**: Password reset emails not sending
**Solution**:
- Verify RESEND_API_KEY
- Check email template formatting
- Ensure sender email is verified

### Performance Optimization
- **Image Optimization**: Use Next.js Image component
- **Bundle Analysis**: Use bundle analyzer to identify large dependencies
- **Caching**: Implement proper caching strategies
- **Database Indexing**: Add indexes for frequently queried fields

### Security Considerations
- **Input Validation**: Always validate user inputs
- **SQL Injection**: Use parameterized queries
- **XSS Prevention**: Sanitize user content
- **HTTPS**: Always use HTTPS in production

---

## Support & Contact

For technical support or questions about this documentation:

- **Email**: support@austrange.com
- **Documentation**: This file (DOCUMENTATION.md)
- **Issues**: Create GitHub issues for bug reports
- **Feature Requests**: Submit via GitHub discussions

---

## License

This project is proprietary software owned by Austrange Solutions. All rights reserved.

---

*Last updated: January 2024*
*Version: 1.0.0*
