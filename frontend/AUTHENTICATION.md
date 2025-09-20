# Authentication Setup

This document describes the authentication system implemented in the frontend application.

## Features

- **User Sign In**: Users can sign in with email and password
- **Protected Routes**: Chat functionality is protected and requires authentication
- **Persistent Sessions**: User sessions are maintained using localStorage
- **Automatic Redirects**: Unauthenticated users are redirected to login when trying to access protected features
- **Toast Notifications**: Success and error messages are shown using toast notifications

## API Integration

The authentication system integrates with the backend API at:
- **Base URL**: `https://mock-api-2p6p.onrender.com/v1/api`
- **Sign In Endpoint**: `POST /auth/signin`

## Authentication Logic

- **Token Storage**: Access token is stored in localStorage as `authToken`
- **User Data Storage**: User information is stored in localStorage as `userData`
- **Authentication Check**: Simply checks for the presence of both `authToken` and `userData` in localStorage
- **No Token Verification**: No backend verification calls are made - authentication is based purely on localStorage presence

## Environment Variables

Set the following environment variable:
```
VITE_BASE_URL=https://mock-api-2p6p.onrender.com/v1/api
```

## Components

### AuthContext
- Manages global authentication state
- Provides login/logout functionality
- Handles token persistence and verification

### LoginForm
- Handles user input for email and password
- Shows loading states during authentication
- Displays success/error messages

### ProtectedApp
- Wraps the main application
- Checks authentication status before allowing chat functionality
- Redirects unauthenticated users to login page

## Usage

1. **Sign In**: Users can click "Sign in" in the header or be redirected when trying to use protected features
2. **Chat Protection**: When users try to generate mock APIs without being signed in, they'll see an error message and be redirected to login
3. **Session Management**: Once signed in, users can use all features and their session persists across browser refreshes
4. **Sign Out**: Users can sign out using the button in the header

## Error Handling

- Network errors are caught and displayed as user-friendly messages
- Invalid credentials show appropriate error messages
- Token expiration automatically logs out the user
