# TaskFlow Frontend

A complete React frontend for the TaskFlow task management application.

## Features

### Authentication

- User registration and login
- JWT token-based authentication
- Protected routes
- Automatic logout on token expiry

### Dashboard

- Overview of tasks and categories
- Statistics (total, completed, pending, overdue tasks)
- Recent tasks display
- Quick access to create new tasks/categories

### Task Management

- View all tasks with filtering and search
- Create, edit, and delete tasks
- Task completion toggle
- Priority levels (Low, Medium, High)
- Due dates
- Category assignment

### Category Management

- View all categories
- Create, edit, and delete categories
- Task count per category

## Tech Stack

- **React 19** - UI framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Styling framework
- **Lucide React** - Icon library
- **Context API** - State management for authentication

## Project Structure

```
frontend/
├── src/
│   ├── compoments/
│   │   ├── Header.jsx          # Navigation header with user info and logout
│   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   ├── TaskCard.jsx        # Individual task display component
│   │   └── ProtectedRoute.jsx  # Route protection wrapper
│   ├── context/
│   │   └── AuthContext.jsx     # Authentication context provider
│   ├── pages/
│   │   ├── Login.jsx           # Login page
│   │   ├── Register.jsx        # Registration page
│   │   ├── Dashboard.jsx       # Main dashboard
│   │   ├── Tasks.jsx           # Task listing page
│   │   ├── TaskForm.jsx        # Create/edit task form
│   │   ├── Categories.jsx      # Category listing page
│   │   └── CategoryForm.jsx    # Create/edit category form
│   ├── services/
│   │   └── api.js              # API service with interceptors
│   ├── App.jsx                 # Main app component with routing
│   └── main.jsx                # App entry point
```

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Build for production:

   ```bash
   npm run build
   ```

## API Integration

The frontend integrates with a Laravel Sanctum backend API. Key endpoints:

- `POST /api/login` - User login
- `POST /api/register` - User registration
- `POST /api/logout` - User logout
- `GET /api/user` - Get authenticated user
- `GET/POST/PUT/DELETE /api/tasks` - Task CRUD operations
- `GET/POST/PUT/DELETE /api/categories` - Category CRUD operations

## Authentication Flow

1. User registers or logs in
2. JWT token is stored in localStorage
3. API requests automatically include the token
4. Protected routes check authentication status
5. Token expiry triggers automatic logout

## Features Overview

- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Task completion and other changes reflect immediately
- **Form Validation**: Client-side validation for all forms
- **Error Handling**: Comprehensive error handling for API calls
- **Loading States**: Loading indicators during API operations
- **Search & Filter**: Advanced filtering options for tasks
- **Clean UI**: Modern, intuitive interface using Tailwind CSS
