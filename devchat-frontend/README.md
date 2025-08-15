# DevChat Frontend

A modern React.js frontend application for a developer chat platform with JWT authentication and role-based access control.

## Features

- **Authentication System**: Login/Register with JWT tokens
- **Role-Based Access Control**: USER, DEV, ADMIN, SUPERADMIN roles
- **Thread Management**: Create, view, and search discussion threads
- **Message System**: Reply to threads (DEV role)
- **Admin Dashboard**: User verification and management
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Auto-refresh functionality
- **Toast Notifications**: Success/error message system

## Tech Stack

- React 18.2.0
- React Router 6.11.0
- React Hook Form 7.45.0
- Axios for API calls
- React Toastify for notifications
- CSS3 with modern styling

## User Roles & Permissions

### USER Role
- Create new discussion threads
- View all threads
- Search threads
- Read-only access to messages

### DEV Role  
- View all threads
- Reply to threads with helpful messages
- Search threads
- Cannot create new threads

### ADMIN/SUPERADMIN Roles
- Admin dashboard access
- Verify pending users
- View all users
- Full platform oversight

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Backend API running on localhost:8080

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

### Backend Requirements

Ensure your Spring Boot backend is running on `http://localhost:8080` with the following endpoints:

#### Authentication
- `POST /api/auth/login`
- `POST /api/auth/register`

#### Threads
- `GET /api/threads`
- `GET /api/threads/{id}`
- `GET /api/threads/search?keyword={keyword}`
- `POST /api/threads`

#### Messages
- `GET /api/messages/thread/{threadId}`
- `POST /api/messages`

#### Admin
- `GET /api/admin/pending-users`
- `POST /api/admin/verify-user/{userId}`
- `GET /api/admin/all-users`
