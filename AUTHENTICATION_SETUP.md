# 🔐 Authentication Setup Guide

## 🎯 What You Need to Do

The "Not authenticated. Please login to test Supabase" message means your Supabase integration is working correctly, but you need to set up authentication.

## 📋 Step-by-Step Setup

### 1. **Configure Supabase Authentication**
In your Supabase dashboard:

1. **Go to Authentication → Settings**
2. **Enable Email Authentication**:
   - ✅ Enable email confirmations (optional for testing)
   - ✅ Enable email change confirmations (optional)
3. **Set Site URL**: `http://localhost:3000`
4. **Add Redirect URLs**: `http://localhost:3000/**`

### 2. **Test Authentication Flow**

Now you can test the authentication:

1. **Click "Login / Sign Up"** button in the Supabase Test component
2. **Create a new account**:
   - Enter any email (e.g., `test@example.com`)
   - Enter a password (min 6 characters)
   - Click "Sign Up"
3. **Check your email** for confirmation (if enabled)
4. **Login with your credentials**

### 3. **Test Supabase Connection**

Once authenticated:
1. **Click "Test Connection"** to verify API calls work
2. **Check browser console** for success messages
3. **Verify database operations** are working

## 🧪 **What Each Component Does**

### **LoginForm Component**
- Handles user login with email/password
- Shows error messages for failed attempts
- Calls `supabase.auth.signInWithPassword()`

### **SignupForm Component**
- Handles new user registration
- Validates password length (min 6 characters)
- Calls `supabase.auth.signUp()`
- Shows success message for email confirmation

### **SupabaseTest Component**
- Shows authentication status
- Provides login/signup interface
- Tests API connection when authenticated
- Handles logout functionality

## 🔧 **Troubleshooting**

### **"Invalid login credentials" Error**
- Check if email confirmation is required
- Verify password meets requirements
- Try creating a new account

### **"Email not confirmed" Error**
- Check your email for confirmation link
- Or disable email confirmation in Supabase settings

### **"Test Connection" Fails**
- Verify database schema is set up correctly
- Check RLS policies are enabled
- Ensure user has proper permissions

### **Environment Variables Issues**
- Restart development server after adding `.env.local`
- Verify variable names start with `NEXT_PUBLIC_`
- Check for typos in Supabase URL/key

## 🎯 **Expected Flow**

1. **Initial State**: "Not authenticated. Please login to test Supabase."
2. **Click Login/Sign Up**: Shows authentication forms
3. **Create Account**: Enter email/password, click "Sign Up"
4. **Email Confirmation**: Check email (if enabled) or proceed
5. **Login**: Use credentials to authenticate
6. **Success**: Shows "✅ Authenticated as: your@email.com"
7. **Test Connection**: Click to verify API calls work
8. **Logout**: Click to sign out and return to initial state

## 🚀 **Next Steps**

Once authentication is working:
- **Phase 2**: Core Data Layer implementation
- **Real-time messaging** with live updates
- **User profiles** and room management
- **Offline-first synchronization**

The authentication system is now fully functional and ready for testing!
