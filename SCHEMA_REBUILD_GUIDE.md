# 🔄 Complete Schema Rebuild Guide

## 🎯 **What This Does**
This script completely drops and rebuilds your Supabase schema to fix the RLS recursion issues.

## ⚠️ **Important Warning**
This will **DELETE ALL EXISTING DATA** in your database. Only run this if you're okay with losing current data.

## 📋 **Step-by-Step Instructions**

### 1. **Backup Your Data (Optional)**
If you have important data, export it first:
```sql
-- In Supabase SQL Editor, run this to backup data
SELECT * FROM messages;
SELECT * FROM rooms;
SELECT * FROM members;
-- Save the results
```

### 2. **Run the Rebuild Script**
1. **Go to your Supabase project dashboard**
2. **Navigate to SQL Editor**
3. **Copy the entire contents** of `supabase-schema-rebuild.sql`
4. **Paste it into the SQL Editor**
5. **Click "Run"** to execute the complete rebuild

### 3. **Verify the Rebuild**
After running, you should see:
- ✅ **"Schema rebuild completed successfully!"** message
- ✅ **4 tables created**: rooms, members, messages, message_reads
- ✅ **Multiple policies created** for each table
- ✅ **Indexes created** for performance
- ✅ **Realtime enabled** for all tables

### 4. **Test Your Application**
1. **Refresh your browser** (http://localhost:3000)
2. **Login to your account** in the Supabase Test component
3. **Click "Test Connection"** - should work without errors
4. **Check browser console** for success messages

## 🔧 **What the Script Does**

### **Step 1: Complete Cleanup**
- Drops all triggers, functions, policies, and tables
- Ensures no leftover objects cause conflicts

### **Step 2: Create Tables**
- Creates tables in correct dependency order
- Includes all necessary constraints and checks

### **Step 3: Create Indexes**
- Optimizes queries for chat performance
- Includes compound indexes for common queries

### **Step 4: Enable RLS**
- Enables Row Level Security on all tables
- Prepares for policy creation

### **Step 5: Create RLS Policies**
- Uses `EXISTS` clauses to avoid recursion
- Implements proper security for all operations
- Allows users to see their own data and room data

### **Step 6: Enable Realtime**
- Adds all tables to realtime publication
- Enables live updates for chat functionality

### **Step 7: Create Functions & Triggers**
- Message notification system
- Automatic room update triggers

### **Step 8: Sample Data**
- Creates a sample "General Chat" room for testing

## 🎯 **Expected Results**

After running the script:
- ✅ **No more recursion errors**
- ✅ **All API calls work**
- ✅ **Authentication flows properly**
- ✅ **Realtime subscriptions work**
- ✅ **Database is optimized for chat**

## 🚀 **Next Steps**

Once the rebuild is complete:
1. **Test all functionality** in your app
2. **Verify authentication** works
3. **Test API connections**
4. **Proceed with Phase 2** development

## 🔍 **Troubleshooting**

### **If the script fails:**
1. **Check for syntax errors** in the SQL
2. **Ensure you have admin privileges** in Supabase
3. **Try running sections individually** if needed

### **If you still get errors:**
1. **Check the Supabase logs** for detailed error messages
2. **Verify your environment variables** are correct
3. **Restart your development server**

The rebuild script is comprehensive and should resolve all RLS recursion issues!
