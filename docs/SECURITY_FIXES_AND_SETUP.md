# Frontend Security Fixes & Pre-Backend Setup Guide

**Last Updated:** November 12, 2025  
**Status:** ✅ Ready for Backend Development

---

## What Was Fixed

### 1. ✅ Dev Auto-Login Gated by Environment Variable
**What was done:**
- Removed hard-coded dev auto-login and mock admin credentials from production code.
- Wrapped all dev login logic in `VITE_ALLOW_DEV_AUTOLOGIN === 'true'` check.
- File: `src/contexts/AuthContext.jsx`

**Impact:**
- Dev login only works locally when you explicitly set `VITE_ALLOW_DEV_AUTOLOGIN=true` in `.env`.
- Production builds will have dev login disabled (safer).
- Credentials no longer leak in public code.

**To enable dev login locally:**
```bash
# Edit .env (DO NOT commit this)
VITE_ALLOW_DEV_AUTOLOGIN=true
VITE_API_BASE_URL=http://localhost:5000/api
```

---

### 2. ✅ Centralized API Client Created
**What was done:**
- Created `src/utils/apiClient.js` — a centralized axios wrapper.
- Handles JWT token injection automatically.
- Implements token refresh flow on 401 response (required for backend integration).
- All API calls now go through one client for consistency.

**Key features:**
- Automatic access token injection from localStorage or `kwick_token`.
- Refresh token rotation on 401 with retry logic.
- Configurable base URL via `VITE_API_BASE_URL`.
- Credentials support (for HttpOnly cookies if backend uses them).

**Usage (example):**
```js
import api from '@/utils/apiClient';

const resp = await api.post('/auth/login', { email, password });
const data = resp.data; // Returns response body
```

---

### 3. ✅ Auth & KYC Utils Refactored to Use API Client
**What was done:**
- `src/utils/auth.js` — now uses centralized api client instead of fetch.
- `src/utils/kyc.js` — refactored all KYC endpoints to use api client with proper multipart/form-data support.
- Consistent error handling and token management.

**File:** `src/utils/auth.js` and `src/utils/kyc.js`

---

### 4. ✅ Environment Configuration Created
**What was done:**
- Created `.env.example` with all required environment variables (template).
- Updated `.gitignore` to exclude `.env` (secrets not committed).
- Documentation shows which env vars are needed.

**File:** `.env.example`
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_ALLOW_DEV_AUTOLOGIN=false
VITE_RAZORPAY_KEY=
```

**To set up locally:**
```bash
cp .env.example .env
# Edit .env with your values
# .env is automatically ignored by git
```

---

### 5. ✅ Documentation Updated (Secrets Removed)
**What was done:**
- `API_ENDPOINTS.md` — redacted plain-text admin password.
- `SCHEMA_SUMMARY.md` — updated credentials section with security note.
- Clear instructions on how to manage secrets.

---

### 6. ✅ Dependencies Added
**What was done:**
- Added `axios@^1.4.0` to `package.json` for API client.
- Ran `npm install` to lock dependency.

---

## Files Modified

| File | Change | Why |
|------|--------|-----|
| `src/contexts/AuthContext.jsx` | Gated dev login by env var | Security: no hardcoded creds |
| `src/utils/apiClient.js` | ✨ NEW | Centralized API calls + token refresh |
| `src/utils/auth.js` | Refactored to use api client | Consistency + refresh flow |
| `src/utils/kyc.js` | Refactored to use api client | Multipart uploads via api client |
| `.env.example` | ✨ NEW | Template for local env vars |
| `.gitignore` | Added `.env` | Secrets not committed |
| `package.json` | Added axios | Support for api client |
| `API_ENDPOINTS.md` | Redacted admin password | Security: no plaintext secrets |
| `SCHEMA_SUMMARY.md` | Redacted credentials section | Documentation safety |

---

## Environment Setup for Local Development

### Step 1: Create Local `.env` File
```bash
cd c:\xampp\htdocs\kwick\kwickrs\app
cp .env.example .env
```

### Step 2: Configure for Local Backend
Edit `.env`:
```bash
VITE_API_BASE_URL=http://localhost:5000/api
VITE_ALLOW_DEV_AUTOLOGIN=true     # only for local dev
VITE_RAZORPAY_KEY=<your_sandbox_key>
```

### Step 3: Install & Run
```bash
npm install
npm run dev
# Opens http://localhost:3001
```

### Step 4: Test API Client
When backend is running on port 5000, frontend will automatically use `http://localhost:5000/api` for all requests.

---

## Backend Team Setup Instructions

### Requirements
Your backend **MUST** provide:

1. **Auth Endpoints** (from `API_ENDPOINTS.md`):
   - `POST /auth/login` — returns `{ body: { user, token, refreshToken } }`
   - `POST /auth/signup` — user registration
   - `POST /auth/refresh` — refresh access token (required for frontend token refresh flow)
   - `POST /auth/logout`

2. **Token Format & Headers**:
   - Access tokens: JWT format, short-lived (10–15 min recommended)
   - Refresh tokens: long-lived (7–30 days recommended)
   - Refresh endpoint must return new tokens in same shape as login response
   - Frontend automatically sends: `Authorization: Bearer {token}`

3. **CORS Setup**:
   - Allow frontend origin (dev: `http://localhost:3001`, prod: your domain)
   - Allow credentials header
   - Example (Express):
     ```js
     cors({
       origin: 'http://localhost:3001',
       credentials: true,
       allowedHeaders: ['Content-Type', 'Authorization']
     })
     ```

4. **File Uploads** (for KYC & payments):
   - Support multipart/form-data at `/kyc/submit`, `/kyc/upload`, etc.
   - Return `{ ok: true, body: { url, ... } }` for success
   - Store files in S3 or local storage; return public URLs

5. **Error Response Format**:
   - Success: `{ ok: true, body: { ... } }`
   - Error: `{ ok: false, error: "message" }` or `{ ok: false, body: { error } }`
   - HTTP status codes: 200, 201, 400, 401, 403, 404, 500 as appropriate

---

## Security Best Practices Checklist

- [x] Dev credentials gated by env var
- [x] No plaintext secrets in code
- [x] .env in .gitignore
- [ ] **Backend:** Implement HTTPS and set Secure flag on cookies
- [ ] **Backend:** Use HttpOnly flag on refresh token cookies
- [ ] **Backend:** Validate all inputs server-side (Joi/Zod)
- [ ] **Backend:** Implement rate limiting on auth endpoints
- [ ] **Backend:** Use strong password hashing (bcrypt, 10+ rounds)
- [ ] **Backend:** Encrypt PII at rest (Aadhaar, license numbers)
- [ ] **Backend:** Implement CSRF protection if needed
- [ ] **Backend:** Add audit logging for admin actions
- [ ] Production: Use secret manager (AWS Secrets Manager, etc.)
- [ ] Production: Set `VITE_ALLOW_DEV_AUTOLOGIN=false`

---

## Next Steps for Backend Team

1. **Read:** `API_ENDPOINTS.md` and `DATABASE_SCHEMA.sql`
2. **Setup:** Run `DATABASE_SCHEMA.sql` to create DB structure
3. **Implement:**
   - Week 1: Auth endpoints (login/signup/refresh)
   - Week 1–2: User, KYC endpoints
   - Week 2–3: Vehicles, rentals, payments
4. **Test:** Use Postman/Insomnia to test endpoints per `API_ENDPOINTS.md`
5. **Integrate:** Frontend will auto-connect when backend is ready

---

## Testing the Setup

### 1. Verify API Client Works
Open DevTools console on http://localhost:3001 and run:
```js
import api from './src/utils/apiClient.js';
console.log(api.defaults.baseURL); // Should be http://localhost:5000/api (or your VITE_API_BASE_URL)
```

### 2. Verify Dev Login Disabled
In `.env`, ensure:
```
VITE_ALLOW_DEV_AUTOLOGIN=false
```
Refresh page. You should see login screen (no auto-login).

### 3. Verify Dev Login Enabled
Change `.env` to:
```
VITE_ALLOW_DEV_AUTOLOGIN=true
```
Refresh page. You should auto-login as admin (dev only).

---

## Common Issues & Troubleshooting

**Q: "Failed to resolve import 'axios'"**
- A: Run `npm install axios`

**Q: Dev login not working even with `VITE_ALLOW_DEV_AUTOLOGIN=true`**
- A: Restart dev server after editing `.env` (`npm run dev`)

**Q: Frontend can't connect to backend**
- A: Check `VITE_API_BASE_URL` in `.env` matches backend URL/port
- A: Ensure backend CORS allows frontend origin

**Q: Token refresh failing**
- A: Verify backend `POST /auth/refresh` returns `{ body: { token, refreshToken } }`
- A: Check refresh token is being stored in localStorage

---

## Production Deployment Checklist

Before deploying to production:

- [ ] Set `VITE_ALLOW_DEV_AUTOLOGIN=false` (disable dev login)
- [ ] Set `VITE_API_BASE_URL=https://api.production.com/api` (your production backend)
- [ ] Remove `.env` from repository (only `.env.example` committed)
- [ ] Set all secrets in production environment (secret manager)
- [ ] Backend CORS locked to production frontend domain only
- [ ] Backend uses HTTPS, HttpOnly cookies, Secure flag
- [ ] Run `npm run build` and test production bundle
- [ ] Enable Content Security Policy headers

---

## Reference Documentation

Inside this folder:
- `API_ENDPOINTS.md` — All 50+ endpoints with examples
- `DATABASE_SCHEMA.md` — Full DB design and relationships
- `DATABASE_SCHEMA.sql` — Ready-to-run SQL (MySQL)
- `SCHEMA_SUMMARY.md` — Project overview
- `IMPLEMENTATION_CHECKLIST.md` — Step-by-step implementation guide

---

## Ready to Start Backend Development! 🚀

Your frontend is now:
✅ Secure (no hardcoded secrets)  
✅ Centralized (one API client)  
✅ Token-refresh ready  
✅ Environment-configured  

Backend team can now start implementation using `API_ENDPOINTS.md` as the contract. 

**Questions?** Reference the docs above or check the example env in `.env.example`.
