# KWICK EV Rental Platform - Complete Documentation Summary

## Project Overview

**KWICK** is an innovative EV (Electric Vehicle) rental platform designed for India's urban mobility market. The platform enables:

- **Users/Drivers:** Rent electric scooters/vehicles, earn money through delivery services, track trips, manage fleet
- **Admins:** Manage users, KYC verification, payments, vehicles, and platform content
- **Platform Features:** Real-time tracking, battery management, payment processing, content management

---

## Technology Stack

### Frontend (Current)
- **React 18** - UI framework
- **Vite 6.3.5** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Styling
- **Radix UI** - Component library
- **Framer Motion / Motion React** - Animations
- **Lucide React** - Icons
- **Recharts** - Data visualization
- **React Hook Form** - Form handling
- **Sonner** - Toast notifications
- **Embla Carousel** - Carousel component

### Backend (To Be Built)
- **Node.js + Express.js** (Recommended)
- **MySQL 8.0+** or **PostgreSQL 13+**
- **JWT Authentication**
- **AWS S3** for file storage
- **Razorpay** for payments

---

## Database Schema

### 16 Core Tables

1. **USERS** - User accounts and profiles
2. **KYC_VERIFICATION** - Identity verification documents
3. **SUBSCRIPTION_PLANS** - Rental plan templates
4. **VEHICLES** - EV fleet inventory
5. **RENTALS** - Active rental contracts
6. **PAYMENTS** - Transaction records
7. **TRIPS** - Trip/delivery history
8. **BATTERY_STATIONS** - Charging/swap station locations
9. **BATTERY_INVENTORY** - Individual battery packs
10. **BLOG_POSTS** - Content management
11. **CAREER_POSTINGS** - Job listings
12. **JOB_APPLICATIONS** - Applications
13. **NOTIFICATIONS** - User alerts
14. **DISPUTES** - Customer complaints
15. **VEHICLE_MAINTENANCE** - Service records
16. **ADMIN_LOGS** - Audit trail

**Files:**
- `DATABASE_SCHEMA.md` - Detailed schema documentation
- `DATABASE_SCHEMA.sql` - Ready-to-execute SQL script

---

## API Endpoints

### 11 API Categories

1. **Authentication** (Signup, Login, Logout, Token Refresh)
2. **User Management** (Profile, User List, Photo Upload)
3. **KYC Verification** (Submit, Check Status, Admin Approval)
4. **Vehicle Management** (List, Details, Fleet, CRUD)
5. **Rentals** (Plans, Create, Active, Cancel, Complete)
6. **Payments** (Methods, Create, Verify, Status, Admin Approval)
7. **Trips** (Trip History, Earnings)
8. **Battery Stations** (Locations, Availability)
9. **Blog** (List, Read, Create, Update, Delete)
10. **Career/Jobs** (Listings, Apply, Applications)
11. **Notifications** (List, Mark Read)

**File:** `API_ENDPOINTS.md` - Complete endpoint documentation with examples

---

## Frontend Architecture

### Page Components
```
Public Pages:
├── NewLandingPage - Home page
├── NewAboutPage - About KWICK
├── EnhancedVehiclesPage - Browse vehicles
├── PricingPage - Pricing plans
├── BatteryStationsPage - Station locator
├── BlogPage - Blog listing
├── BlogDetailPage - Blog article
├── CareersPage - Job listings
├── EnhancedContactPage - Contact form

User Pages (Protected):
├── EnhancedUserDashboard - Dashboard
├── EnhancedKYCPageWithLanguage - KYC form
├── EnhancedRentVehiclePage - Rent vehicle
├── MyFleetPage - User's vehicles
├── MyPaymentPage - Payment history
├── BatterySwapPage - Battery swap
├── IoTTrackingPage - GPS tracking
├── SupportPage - Help/support

Admin Pages (Admin-only):
├── EnhancedAdminDashboard - Admin dashboard
├── UserManagementPanel - User management
├── KYCManagementPanel - KYC approval
├── PaymentManagementPanel - Payment review
├── FleetManagementPanel - Vehicle fleet
├── BlogCMSPanel - Blog management
├── CareerCMSPanel - Job management
├── NotificationsPanel - Alert management
```

### Context Providers
- **AuthContext** - Authentication & user state
- **BlogContext** - Blog posts management
- **LanguageContext** - Multi-language support (EN/HI)

### Routing Structure
```
/                    - Home (public)
/about               - About (public)
/vehicles            - Browse vehicles (public)
/pricing             - Pricing (public)
/battery-stations    - Stations (public)
/blog                - Blog list (public)
/blog/:id            - Blog detail (public)
/careers             - Careers (public)
/contact             - Contact (public)

/user/dashboard      - User dashboard (protected)
/user/kyc            - KYC form (protected)
/user/rent           - Rent vehicle (protected)
/user/fleet          - My fleet (protected)
/user/payments       - Payments (protected)
/user/battery-swap   - Battery swap (protected)
/user/iot-tracking   - GPS tracking (protected)
/user/support        - Support (protected)

/admin-secret-login  - Admin login (public secret)
/admin               - Admin dashboard (admin-only)
/admin/users         - User mgmt (admin-only)
/admin/kyc           - KYC approval (admin-only)
/admin/payments      - Payment review (admin-only)
/admin/fleet         - Fleet mgmt (admin-only)
/admin/blog          - Blog CMS (admin-only)
/admin/careers       - Career CMS (admin-only)
/admin/notifications - Notifications (admin-only)
```

### Features
- ✅ Role-based access control (User/Admin)
- ✅ Protected routes
- ✅ Admin view switching
- ✅ Responsive design
- ✅ Real-time notifications
- ✅ Multi-language support (English/Hindi)
- ✅ Dark/Light theme support
- ✅ Mobile-first approach

---

## Current Issues & Resolutions

### Issue: Missing Component Imports
**Status:** ✅ FIXED

When the app tried to render routes with components that weren't imported, it threw:
```
Uncaught ReferenceError: MyFleetPage is not defined
```

**Solution:** Added all missing component imports to `src/App.jsx`:
- MyFleetPage, MyPaymentPage, BatterySwapPage, IoTTrackingPage, SupportPage
- EnhancedAdminDashboard, UserManagementPanel, KYCManagementPanel, PaymentManagementPanel
- FleetManagementPanel, BlogCMSPanel, CareerCMSPanel, NotificationsPanel

### App Status
- ✅ **Vite Dev Server:** Running on http://localhost:3001/
- ✅ **All Routes:** Accessible
- ✅ **Auth System:** Implemented with dev auto-login
- ✅ **Role-Based Access:** Working (user vs admin)

---

## Getting Started

### Prerequisites
```bash
Node.js 18+
npm or yarn
```

### Installation
```bash
cd c:\xampp\htdocs\kwick\kwickrs\app
npm install
```

### Development
```bash
npm run dev
# Opens browser to http://localhost:3001/
```

### Build
```bash
npm run build
# Builds optimized production bundle to ./build/
```

### Credentials (Development)

> Note: Development/admin credentials MUST NOT be committed to source control. Use `.env` or a secrets manager.

Create local credentials via your backend seed script or set an admin password in a secure place. Example placeholder:

```
Admin Email: admin@kwick.in
Admin Password: <ADMIN_PASSWORD_REDACTED>
```

---

## Documentation Files

### In Repository
| File | Description |
|------|-------------|
| `DATABASE_SCHEMA.md` | Complete database schema with tables, relationships, and constraints |
| `DATABASE_SCHEMA.sql` | SQL script to create all tables (ready to execute) |
| `API_ENDPOINTS.md` | Complete REST API documentation with curl examples |
| `SCHEMA_SUMMARY.md` | This file |

### Recommended Backend Setup

1. **Create Node.js backend:**
   ```bash
   mkdir kwick-backend
   cd kwick-backend
   npm init -y
   npm install express cors dotenv mysql2 jsonwebtoken bcryptjs multer
   ```

2. **Set up MySQL database:**
   ```bash
   mysql -u root -p < DATABASE_SCHEMA.sql
   ```

3. **Create backend routes** matching `API_ENDPOINTS.md`

4. **Connect frontend to backend:**
   - Update API base URL in frontend env/config
   - Implement API call functions
   - Add error handling and loading states

---

## Key Business Rules

### User Management
- Users start with `tier: 'bronze'`
- Tier upgrades: silver (10 rentals), gold (30 rentals), platinum (50+ rentals)
- KYC must be 'approved' before renting vehicles

### Rentals
- Plans: Daily (₹199), Weekly (₹999 | -5%), Monthly (₹3499 | -10%)
- End date must be after start date
- Security deposit: ₹2000 standard

### Payments
- Status flow: pending → processing → completed
- Multiple payment methods supported: UPI, Credit Card, Bank Transfer
- Admin approval required for manual payments

### Ratings
- Scale: 1-5 stars
- Applicable after trip completion
- Used for user reputation

### KYC Documents Required
1. Aadhaar Card (front & back)
2. Driving License (front & back)
3. Selfie photo

---

## Performance Optimizations

### Recommended
1. **Database Partitioning:** Partition TRIPS and PAYMENTS by date (monthly)
2. **Caching:** Redis cache for:
   - Active rentals
   - Vehicle status
   - Battery levels
   - Frequently accessed blog posts
3. **Indexing:** Composite indexes on common query patterns
4. **CDN:** CloudFront for static assets
5. **Image Optimization:** WebP format, lazy loading
6. **Code Splitting:** React.lazy() for route-based splitting

---

## Security Considerations

1. **Authentication:** JWT with expiry (15 min) + refresh tokens (7 days)
2. **HTTPS:** Required for all API calls
3. **Encryption:** AES-256 for sensitive data (Aadhaar, License)
4. **Rate Limiting:** 100 requests/minute per user
5. **Input Validation:** All inputs validated server-side
6. **CORS:** Whitelist allowed origins
7. **SQL Injection:** Use parameterized queries
8. **XSS Protection:** Sanitize all user inputs

---

## Scalability Strategy

### Phase 1: MVP (Current)
- Single Node.js server
- Single MySQL database
- File uploads to local storage

### Phase 2: Growth (1M+ users)
- Load balancing (Nginx/HAProxy)
- Database read replicas
- AWS S3 for file storage
- Redis for caching
- Message queue (RabbitMQ/Redis) for async jobs

### Phase 3: Scale (10M+ users)
- Microservices architecture
- Kubernetes orchestration
- Database sharding by user_id
- ElasticSearch for full-text search
- Event streaming (Kafka)
- Data warehouse (BigQuery/Snowflake)

---

## Future Enhancements

1. **Map Integration:** Google Maps API for real-time tracking
2. **Push Notifications:** Firebase Cloud Messaging
3. **In-App Chat:** WebSocket support for support tickets
4. **Analytics Dashboard:** User behavior, earnings trends
5. **Referral System:** User referral bonuses
6. **Subscription Management:** Auto-renewal, cancellation flow
7. **Vehicle IoT Integration:** Real-time telemetry, remote locking
8. **Insurance Integration:** Automatic insurance selection
9. **Compliance:** GDPR, Data Protection Act compliance
10. **Internationalization:** Support for multiple countries/languages

---

## Support & Development

### Frontend Issues
- Check browser console for errors
- Clear browser cache (Ctrl+Shift+Delete)
- Ensure `npm install` completed successfully
- Check that all environment variables are set

### Backend Development
- Refer to `API_ENDPOINTS.md` for specification
- Use `DATABASE_SCHEMA.sql` for database setup
- Follow REST conventions
- Implement proper error handling
- Add request/response validation

### Testing Recommendations
- **Unit Tests:** Jest for backend, Vitest for frontend
- **Integration Tests:** Supertest for API, React Testing Library for UI
- **E2E Tests:** Cypress or Playwright
- **Load Testing:** Apache JMeter

---

## Deployment Checklist

- [ ] Database backed up
- [ ] API keys and secrets in .env
- [ ] Frontend environment variables configured
- [ ] SSL certificates installed
- [ ] Email service configured
- [ ] Payment gateway live keys set
- [ ] File storage configured (S3)
- [ ] CDN configured for assets
- [ ] Monitoring and logging setup
- [ ] Error tracking (Sentry) configured
- [ ] Database migrations run
- [ ] Performance optimizations verified
- [ ] Security audit completed
- [ ] Documentation updated

---

## Contact & Support

**Project:** KWICK EV Rental Platform  
**Repository:** Sruwat/Kwick  
**Current Version:** 1.0 (Development)  
**Last Updated:** November 2025

---

**Note:** This is a comprehensive specification document. Please follow the detailed schema and API documentation for implementation. All database tables, relationships, and API endpoints are fully specified and ready for backend development.
