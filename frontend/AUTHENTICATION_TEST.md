# Authentication Test Guide

## Testing the Authentication Flow

### 1. **Initial State (Not Authenticated)**
- Open the application
- You should see the "Sign in" button in the header
- Try clicking "Generate Now" on the chat input
- Expected: Toast error "Please sign in to use the chat feature" and redirect to login page

### 2. **Sign In Process**
- Go to `/login` page
- Enter valid email and password
- Click "Sign in"
- Expected: 
  - Loading spinner appears
  - Success toast "Sign in successful!"
  - Redirect to home page
  - Header shows user email and "Sign out" button

### 3. **Authenticated State**
- You should now see your email in the header
- Try using the chat feature
- Expected: Chat works normally without any redirects

### 4. **Session Persistence**
- Refresh the page
- Expected: You remain signed in (no redirect to login)
- Check localStorage: Should contain `authToken` and `userData`

### 5. **Sign Out**
- Click "Sign out" button in header
- Expected: 
  - Success toast "Signed out successfully"
  - Redirect to home page
  - Header shows "Sign in" button again
  - localStorage is cleared

### 6. **Token-Based Authentication**
- Sign in again
- Check localStorage for `authToken` and `userData`
- Expected: Both should be present
- The presence of these tokens determines authentication status (no API verification)

## Local Storage Structure

When authenticated, localStorage should contain:
```json
{
  "authToken": "your-access-token-here",
  "userData": "{\"id\":\"user-id\",\"email\":\"user@example.com\",\"name\":\"User Name\"}"
}
```

## Key Points

- **No Backend Verification**: Authentication is purely based on localStorage presence
- **Token Storage**: Access token is stored as `authToken`
- **User Data**: User information is stored as `userData` (JSON string)
- **Automatic Cleanup**: Both tokens are cleared on logout or 401 errors
