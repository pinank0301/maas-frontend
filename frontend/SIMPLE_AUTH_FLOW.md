# Simplified Authentication Flow

## Overview
The authentication system now works with a simple token-based approach:

1. **Sign In**: Save userDetails and accessToken in localStorage
2. **Page Check**: On every page, check if accessToken exists in localStorage
3. **Redirect**: If no accessToken, redirect to signin page and clear storage

## How It Works

### 1. Sign In Process
```javascript
// When user signs in successfully:
localStorage.setItem('authToken', accessToken);
localStorage.setItem('userData', JSON.stringify(userDetails));
```

### 2. Authentication Check (on every page load)
```javascript
// Check if access token exists
const token = localStorage.getItem('authToken');
const userData = localStorage.getItem('userData');

if (token && userData) {
  // User is authenticated, set user state
  setUser(JSON.parse(userData));
} else {
  // No token, redirect to login
  navigate('/login');
}
```

### 3. Logout Process
```javascript
// Clear storage and redirect
localStorage.removeItem('authToken');
localStorage.removeItem('userData');
navigate('/login');
```

## Key Features

- **Simple Token Check**: Only checks for presence of `authToken` in localStorage
- **Automatic Redirect**: No token = automatic redirect to `/login`
- **No API Verification**: No backend calls to verify token validity
- **Global Protection**: All pages are protected by default
- **Clean Storage**: Invalid or missing tokens are cleared automatically

## Files Modified

- `AuthContext.tsx`: Simplified to only check localStorage
- `App.tsx`: Removed individual authentication checks
- `LoginPage.tsx`: Simplified structure
- `login-form.tsx`: Already handles redirect after login

## Flow Summary

1. User visits any page → Check localStorage for `authToken`
2. If token exists → User is authenticated, show page
3. If no token → Clear storage, redirect to `/login`
4. User signs in → Save token and user data, redirect to home
5. User logs out → Clear storage, redirect to `/login`
