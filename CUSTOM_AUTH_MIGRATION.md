# Custom Authentication System Migration Guide

## Overview
This migration guide will help you replace the existing Supabase authentication with a custom authentication system that includes email verification using your n8n workflow.

## Database Setup

### 1. Execute the Custom Authentication Database Schema

Run the following SQL script in your Supabase SQL Editor:

```bash
# Navigate to your Supabase project dashboard
# Go to SQL Editor
# Execute the custom-auth-database.sql file
```

The script will create:
- `users` table (replaces `auth.users`)
- `email_verifications` table for email verification codes
- `user_sessions` table for session management
- `password_resets` table for password reset functionality
- Database functions for authentication operations
- Row Level Security (RLS) policies

### 2. Verify Database Functions

After running the script, verify these functions exist:
- `register_user(email, password, name)`
- `verify_email(email, verification_code)`
- `login_user(email, password)`
- `request_password_reset(email)`
- `reset_password(email, verification_code, new_password)`
- `invalidate_session(session_token)`
- `validate_session(session_token)`

## Email Service Configuration

### 1. Verify n8n Webhook
Ensure your n8n workflow is running at: `https://n8n-k6lq.onrender.com/webhook/send-email`

Test the webhook with:
```bash
curl -X POST https://n8n-k6lq.onrender.com/webhook/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "html": "<p>Test email content</p>"
  }'
```

## Application Updates

### 1. Update Environment Variables (if needed)
Add to your `.env` file if you need custom configurations:
```env
VITE_CUSTOM_AUTH_ENABLED=true
VITE_N8N_EMAIL_WEBHOOK=https://n8n-k6lq.onrender.com/webhook/send-email
```

### 2. File Structure Updates

The following files have been created/updated:

#### New Files:
- `src/services/emailService.ts` - n8n email integration
- `src/services/customAuthService.ts` - Core authentication logic
- `src/hooks/useCustomAuth.tsx` - React context provider
- `src/components/auth/CustomLogin.tsx` - Login component
- `src/components/auth/CustomRegistration.tsx` - Registration with email verification
- `src/components/auth/CustomForgotPassword.tsx` - Password reset workflow
- `src/components/auth/CustomAuthRouter.tsx` - Navigation between auth states
- `src/components/NewAuthPage.tsx` - Main authentication page

#### Updated Files:
- `src/App.tsx` - Added CustomAuthProvider and new routes
- `src/pages/Index.tsx` - Updated to use useCustomAuth
- `src/components/AuthenticatedApp.tsx` - Updated to use useCustomAuth

## Authentication Workflow

### Registration Flow:
1. User enters email, password, name
2. System creates unverified user account
3. Email verification code sent via n8n
4. User enters verification code
5. Account activated, user logged in

### Login Flow:
1. User enters email and password
2. System validates credentials
3. Session token created
4. User redirected to main app

### Password Reset Flow:
1. User enters email address
2. Reset code sent via n8n
3. User enters verification code
4. User sets new password
5. Password updated, user can login

## Testing Steps

### 1. Test Database Setup
```sql
-- Test user registration
SELECT register_user('test@example.com', 'Test123!@#', 'Test User');

-- Test email verification
SELECT verify_email('test@example.com', '123456');

-- Test login
SELECT login_user('test@example.com', 'Test123!@#');
```

### 2. Test Email Service
Run the application and test:
1. Registration with email verification
2. Password reset with email verification
3. Welcome email after successful verification

### 3. Test Frontend Integration
1. Navigate to `/auth`
2. Test registration flow
3. Test login flow
4. Test password reset flow
5. Verify session persistence

## Migration Checklist

- [ ] Execute custom-auth-database.sql in Supabase SQL Editor
- [ ] Verify all database functions are created
- [ ] Test n8n email webhook
- [ ] Update application dependencies if needed
- [ ] Test registration flow end-to-end
- [ ] Test login flow
- [ ] Test password reset flow
- [ ] Test session management
- [ ] Verify RLS policies are working
- [ ] Test error handling scenarios

## Rollback Plan

If you need to rollback to Supabase auth:

1. Revert `src/App.tsx` to use original auth
2. Revert `src/pages/Index.tsx` to use `useAuth`
3. Revert `src/components/AuthenticatedApp.tsx` to use `useAuth`
4. Remove custom auth components
5. Keep database tables for data preservation

## Security Considerations

1. **Session Management**: Sessions expire after 7 days
2. **Email Verification**: Codes expire after 1 hour
3. **Password Reset**: Codes expire after 1 hour, single use only
4. **Rate Limiting**: Consider implementing rate limiting on registration/login
5. **RLS Policies**: All tables have proper Row Level Security

## Support

If you encounter issues:

1. Check Supabase logs for database errors
2. Check browser console for frontend errors
3. Verify n8n webhook is responding
4. Test database functions manually in SQL Editor
5. Check email delivery in n8n workflow logs

## Next Steps

After successful migration:

1. Remove old Supabase auth dependencies if not needed elsewhere
2. Add additional user profile fields if needed
3. Implement user roles/permissions if required
4. Add audit logging for security events
5. Consider implementing 2FA for enhanced security