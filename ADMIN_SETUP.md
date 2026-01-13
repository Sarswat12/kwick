# Admin Dashboard Setup & Access Guide

## Quick Start

### 1. Start Backend
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

The backend will automatically create an admin user on startup:
- **Email**: `admin@kwick.in`
- **Password**: `admin123`
- **User ID**: Will be auto-assigned (usually 15 or 16 in dev)

### 2. Start Frontend
```powershell
cd frontend
npm run dev
```

### 3. Access Admin Dashboard

#### Option A: Emergency Admin Access (Offline Mode)
Use this if backend is down or for quick testing:

1. Navigate to: `http://localhost:5173/admin-secret-login`
2. **Admin ID**: `Shankra@25`
3. **Password**: `Shankra@18`

⚠️ **Note**: This creates an offline admin session. API calls may fail without real backend token.

#### Option B: Full Backend-Connected Access (Recommended)
Use this for full functionality with real API access:

1. Navigate to: `http://localhost:5173/admin-secret-login`
2. **Admin ID**: `Shankra@25`
3. **Password**: `Shankra@18`

The system will automatically:
- Try to authenticate with backend using `admin@kwick.in / admin123`
- Get a real JWT token
- Set up admin session with full API access

## Troubleshooting

### Issue: Admin dashboard redirects to home page

**Causes:**
1. Not logged in as admin
2. ViewMode not set to 'admin'
3. Token expired or invalid
4. Backend not running

**Solutions:**

1. **Check localStorage (DevTools → Application → Local Storage)**:
   ```javascript
   // Should see:
   kwick_user: {"role":"admin",...}
   kwick_view_mode: "admin"
   kwick_token: "<valid-jwt-token>"
   ```

2. **Clear and re-login**:
   ```javascript
   localStorage.clear();
   // Then login again at /admin-secret-login
   ```

3. **Verify backend is running**:
   ```powershell
   # Should see "Started KwickBackendApplication"
   curl http://localhost:5000/api/health
   ```

4. **Check console logs**:
   - Look for `[ProtectedRoute]` logs showing authentication checks
   - Look for `[AdminLogin]` logs showing login flow
   - Look for `[AuthContext]` logs showing state updates

### Issue: 403 Forbidden on admin API calls

**Causes:**
1. Token doesn't have admin role
2. Backend security config issue
3. User role not set to 'admin' in database

**Solutions:**

1. **Check user role in database**:
   ```sql
   SELECT user_id, email, role FROM users WHERE email = 'admin@kwick.in';
   ```

2. **Manually promote user to admin**:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'admin@kwick.in';
   -- or by user_id
   UPDATE users SET role = 'admin' WHERE user_id = 15;
   ```

3. **Verify JWT contains ROLE_ADMIN**:
   - Decode token at jwt.io
   - Check SecurityContext has ROLE_ADMIN authority

4. **Restart backend** after any database changes

### Issue: Backend not starting / Port 5000 in use

**Solution:**
```powershell
# Find and kill process on port 5000
Get-NetTCPConnection -LocalPort 5000 | Select-Object OwningProcess
Stop-Process -Id <PID> -Force

# Or use a different port
$env:PORT=5001
.\mvnw.cmd spring-boot:run
```

## Admin Routes

All admin routes are protected and require:
- `role: 'admin'` in user object
- `viewMode: 'admin'` in AuthContext
- Valid JWT token with `ROLE_ADMIN` authority

Available routes:
- `/admin` - Dashboard overview
- `/admin/users` - User management
- `/admin/kyc` - KYC verification
- `/admin/payments` - Payment tracking
- `/admin/fleet` - Vehicle fleet management
- `/admin/blog` - Blog CMS
- `/admin/careers` - Careers CMS
- `/admin/notifications` - Notifications center
- `/admin/callback-requests` - Callback requests

## Security Notes

1. **Emergency credentials** (`Shankra@25`) are for development only
2. **Production**: Remove hardcoded credentials and use real admin accounts
3. **JWT tokens** expire after 1 hour by default
4. **All admin API calls** require `Authorization: Bearer <token>` header
5. **CORS** is configured for localhost:5173 and production domains

## Creating Additional Admin Users

### Via Database:
```sql
-- Create new user with admin role
INSERT INTO users (email, name, phone, password_hash, role, kyc_status) 
VALUES ('newadmin@kwick.in', 'New Admin', '+919999999999', 
        '$2a$10$<bcrypt-hash>', 'admin', 'approved');
```

### Via API (as existing admin):
```javascript
// Update existing user to admin
await apiClient.put(`/admin/users/${userId}/role`, { role: 'admin' });
```

## Development Tips

1. **Keep backend logs visible** to see authentication flow
2. **Use Chrome DevTools** → Network tab to inspect failed API calls
3. **Check Redux DevTools** if using state management
4. **Clear localStorage** between tests to ensure clean state
5. **Use incognito mode** for isolated testing sessions

## Files Modified for Admin Fix

**Backend:**
- `SecurityConfig.java` - Added @EnableMethodSecurity, proper 401/403 handling
- `JwtAuthenticationFilter.java` - Returns 401 for invalid tokens
- `AdminKycController.java` - Added @PreAuthorize at class level
- `AdminUsersController.java` - Removed manual admin checks, rely on Spring Security
- `KwickBackendApplication.java` - Auto-creates admin user on startup

**Frontend:**
- `App.jsx` - Wrapped admin routes with ProtectedRoute
- `AuthContext.jsx` - Enhanced adminLogin to use backend API
- `AdminLogin.jsx` - Added error handling and state delay
- `apiClient.js` - Improved 401/403 handling
- `AdminSidebar.jsx` - Uses apiClient for badge counts
- `UserManagementPanel.jsx` - Uses apiClient for user fetching

## Next Steps

1. ✅ Backend creates admin on startup
2. ✅ Admin routes protected with ProtectedRoute
3. ✅ JWT filter returns 401 for invalid tokens
4. ✅ Frontend intercepts 401/403 properly
5. ✅ Admin components use centralized API client
6. 🔄 Test full flow: login → admin dashboard → API calls
7. 🔄 Verify no more redirects to home page
8. 🔄 Confirm badge counts load correctly
