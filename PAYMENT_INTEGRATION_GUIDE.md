# Event Registration with Payment Integration - Setup Guide

## Overview
The registration system has been successfully integrated with Razorpay payment gateway for ₹200 event registrations.

## Features Implemented
✅ **Registration Modal**: Multi-step form with user details collection
✅ **Payment Integration**: Razorpay payment gateway integration
✅ **Event Integration**: Registration available on both events listing and detail pages
✅ **Form Validation**: Comprehensive client-side validation
✅ **Backend API**: Payment order creation and verification endpoints

## Setup Instructions

### 1. Install Backend Dependencies
```bash
cd backend
npm install razorpay @types/razorpay
```

### 2. Environment Variables
Add these to your backend `.env` file:
```env
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Add this to your frontend `.env` file:
```env
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 3. Backend Routes Added
- `POST /api/create-payment-order` - Creates Razorpay order
- `POST /api/verify-payment` - Verifies payment and completes registration

### 4. Frontend Components Added
- `EventRegistrationModal.tsx` - Complete registration flow
- Updated `UtilityViews.tsx` - Event listing with registration buttons
- Updated `EventDetailView.tsx` - Detail page with registration

## Registration Flow

### Step 1: User Information
- Full Name (required)
- Email Address (required)
- Phone Number (required)
- Institution/Organization (required)
- Debate Experience (dropdown)

### Step 2: Payment Summary
- Event details display
- Price: ₹200 (fixed for all events)
- User information review
- Payment button

### Step 3: Razorpay Payment
- Opens Razorpay checkout
- Handles payment success/failure
- Backend verification

### Step 4: Success Confirmation
- Success message display
- Next steps instructions
- Email confirmation (to be implemented)

## How to Test

1. **Start Backend**: 
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend**: 
   ```bash
   npm run dev
   ```

3. **Test Registration**:
   - Go to Events page
   - Click "Register ₹200" on any event
   - Fill out the form
   - Test payment with Razorpay test credentials

## Integration Points

### Events Page (`UtilityViews.tsx`)
- Each event card has a "Register ₹200" button
- Button opens registration modal with event data

### Event Detail Page (`EventDetailView.tsx`)
- "Register Now - ₹200" button in detail view
- Same registration flow as events listing

### Registration Modal (`EventRegistrationModal.tsx`)
- Three-step registration process
- Form validation and error handling
- Razorpay payment integration
- Success/failure handling

## Backend Implementation

### Payment Order Creation
- Creates secure Razorpay order
- Stores user data in order notes
- Returns order details for frontend

### Payment Verification
- Verifies Razorpay signature
- Confirms payment status
- Logs successful registrations
- Returns registration confirmation

## Security Features
- Payment signature verification
- Secure API endpoints
- Form validation
- Error handling

## Next Steps (Optional)
1. **Database Integration**: Save registrations to database
2. **Email Notifications**: Send confirmation emails
3. **Admin Dashboard**: View and manage registrations
4. **Certificate Generation**: Auto-generate participation certificates
5. **WhatsApp Integration**: Add users to event groups

## Pricing
- All events are set to ₹200
- Price is dynamically added to event data
- Can be easily modified in the registration handlers

The system is now fully functional and ready for event registrations with payment processing!