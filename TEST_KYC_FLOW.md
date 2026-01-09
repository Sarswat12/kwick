# KYC Flow Testing Guide

## Issue Found
The KYC data wasn't being saved to the `kyc_verification` table because:
1. Missing console logs made debugging difficult
2. Error handling wasn't showing the actual API errors

## Fixes Applied
1. **Added logging to kyc.js**: Now logs the payload before sending and response after receiving
2. **Improved error handling**: Shows detailed error response from backend
3. **Added Content-Type header**: Ensures proper JSON parsing

## Testing Steps

### 1. Start Backend
```powershell
cd "c:\Users\shank\Desktop\kwickrs\backend"
.\mvnw.cmd spring-boot:run
```

### 2. Start Frontend  
```powershell
cd "c:\Users\shank\Desktop\kwickrs\frontend"
npm run dev
```

### 3. Test KYC Submission

1. **Login** to the application
2. **Navigate** to KYC page
3. **Open browser console** (F12) to see logs
4. **Fill in all KYC fields**:
   - Personal info (step 1)
   - Address (step 2)
   - Document numbers (step 3)
   - Upload files (step 4)
5. **Submit** and watch console for:
   ```
   Submitting KYC details: {address, city, state, pincode, aadhaarNumber, licenseNumber}
   KYC submit response: {ok: true, body: {message: "...", kycId: 123}}
   ```

### 4. Verify Database

Check if data is saved:
```sql
SELECT * FROM kyc_verification WHERE user_id = YOUR_USER_ID;
```

Should show:
- `aadhaar_number`
- `driving_license_number`
- `street_address`
- `city`
- `state`
- `pincode`
- `verification_status` = 'pending'
- Document URLs (aadhaar_front_url, license_front_url, etc.)

### 5. Check User Table
```sql
SELECT user_id, email, kyc_status FROM users WHERE user_id = YOUR_USER_ID;
```

Should show `kyc_status` = 'pending'

## Common Issues

### Issue: 401 Unauthorized
**Cause**: JWT token expired or missing
**Fix**: Re-login to get fresh token

### Issue: 500 Internal Server Error  
**Cause**: Backend not running or database connection failed
**Fix**: Check backend console logs, verify MySQL is accessible

### Issue: Files uploaded but no data in kyc_verification
**Cause**: `/kyc/submit` endpoint not being called or failing
**Fix**: Check browser console for errors, verify payload structure

### Issue: Data saves but PDF not generated
**Cause**: PdfGenerationService error (non-critical)
**Fix**: Check backend logs for PDF generation warnings

## Expected Flow

1. **File Uploads** (individual API calls):
   - POST `/api/kyc/upload/aadhaar-front` → saves file URL to DB
   - POST `/api/kyc/upload/aadhaar-back` → saves file URL to DB
   - POST `/api/kyc/upload/license-front` → saves file URL to DB
   - POST `/api/kyc/upload/license-back` → saves file URL to DB (optional)
   - POST `/api/kyc/upload/selfie` → saves file URL to DB (optional)

2. **Submit KYC Details**:
   - POST `/api/kyc/submit` with JSON payload
   - Backend updates kyc_verification table with personal details
   - Backend updates user table kyc_status to 'pending'
   - Backend generates PDF (optional, may fail but doesn't block)
   - Backend sends email notification (optional)

3. **Success Response**:
   ```json
   {
     "ok": true,
     "body": {
       "message": "KYC submitted for verification",
       "kycId": 123
     },
     "error": null
   }
   ```

## API Endpoints Reference

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/kyc/upload/aadhaar-front` | POST | JWT | Upload Aadhaar front |
| `/api/kyc/upload/aadhaar-back` | POST | JWT | Upload Aadhaar back |
| `/api/kyc/upload/license-front` | POST | JWT | Upload License front |
| `/api/kyc/upload/license-back` | POST | JWT | Upload License back |
| `/api/kyc/upload/selfie` | POST | JWT | Upload selfie |
| `/api/kyc/submit` | POST | JWT | Submit KYC details |
| `/api/kyc/status` | GET | JWT | Get KYC status |
| `/api/kyc/download-pdf` | GET | JWT | Download KYC PDF |

## Next Steps

After testing:
1. Remove console.log statements from production code (or use conditional logging)
2. Add proper form validation on frontend
3. Show upload progress indicators
4. Handle partial failures (e.g., some files uploaded, submit fails)
5. Add retry mechanism for failed uploads

---

**Status**: Fixes applied, ready for testing  
**Date**: January 8, 2026
