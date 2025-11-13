# KWICK EV Rental Platform - Complete Database & Backend Specification

## 📋 Project Summary

KWICK is an innovative **EV (Electric Vehicle) rental platform** designed for India's urban mobility and delivery market. The platform connects users who want to rent electric scooters/vehicles with platform operators who manage the fleet, KYC verification, and payments.

### Key Features
- 🚗 **Vehicle Rental** - Daily, weekly, monthly plans
- 💰 **Earnings** - Users earn money through delivery services
- 🔋 **Battery Management** - 50+ battery swap stations
- 📊 **Real-time Tracking** - GPS tracking and IoT telemetry
- ✅ **KYC Verification** - Automated document verification
- 💳 **Payment Processing** - Multiple payment methods
- 📱 **Multi-language** - English & Hindi support
- 👨‍💼 **Admin Dashboard** - Comprehensive platform management

---

## 📚 Documentation Files

This repository includes comprehensive documentation for both database schema and API implementation:

### 1. **DATABASE_SCHEMA.md** 
Complete database specification with:
- 16 core tables with detailed column definitions
- Data types, constraints, and indexes
- Business rules and validation requirements
- ER relationships and foreign keys
- Performance considerations
- Migration strategy by phases

**Use this for:** Understanding the complete data model

---

### 2. **DATABASE_SCHEMA.sql**
Ready-to-execute SQL script containing:
- Complete CREATE TABLE statements
- All indexes and constraints
- Sample data for testing
- Database initialization

**Use this for:** Setting up the database immediately
```bash
mysql -u root -p < DATABASE_SCHEMA.sql
```

---

### 3. **API_ENDPOINTS.md**
Complete REST API specification with:
- 11 API categories (Auth, Users, KYC, Vehicles, Rentals, Payments, etc.)
- Request/response examples for each endpoint
- Error codes and handling
- Authentication requirements
- Rate limiting details
- Implementation recommendations

**Use this for:** Backend API development

---

### 4. **SCHEMA_SUMMARY.md**
Executive summary including:
- Technology stack overview
- Frontend architecture and routing
- Database table list and relationships
- Feature checklist
- Getting started guide
- Security considerations
- Scalability strategy

**Use this for:** Project overview and quick reference

---

### 5. **IMPLEMENTATION_CHECKLIST.md**
Detailed checklist for implementation including:
- Database setup phases
- Backend API implementation phases with priorities
- Frontend integration checklist
- Testing strategy (unit, integration, E2E)
- Deployment checklist
- Success metrics
- Timeline estimates

**Use this for:** Project planning and tracking progress

---

## 🗄️ Database Overview

### 16 Core Tables

| # | Table | Purpose | Records |
|---|-------|---------|---------|
| 1 | **USERS** | User accounts and profiles | 1M+ expected |
| 2 | **KYC_VERIFICATION** | Identity verification documents | 1M+ expected |
| 3 | **SUBSCRIPTION_PLANS** | Rental plan templates | 10-20 |
| 4 | **VEHICLES** | EV fleet inventory | 10K+ |
| 5 | **RENTALS** | Active rental contracts | 100K+ |
| 6 | **PAYMENTS** | Transaction records | 500K+ |
| 7 | **TRIPS** | Trip/delivery history | 5M+ |
| 8 | **BATTERY_STATIONS** | Charging/swap locations | 50-100 |
| 9 | **BATTERY_INVENTORY** | Individual battery packs | 1K+ |
| 10 | **BLOG_POSTS** | Content management | 100+ |
| 11 | **CAREER_POSTINGS** | Job listings | 50+ |
| 12 | **JOB_APPLICATIONS** | Job applications | 1K+ |
| 13 | **NOTIFICATIONS** | User alerts | 10M+ |
| 14 | **DISPUTES** | Customer complaints | 100K+ |
| 15 | **VEHICLE_MAINTENANCE** | Service records | 100K+ |
| 16 | **ADMIN_LOGS** | Audit trail | 10M+ |

### Key Relationships

```
USERS
├── (1:1) KYC_VERIFICATION
├── (1:N) RENTALS
├── (1:N) PAYMENTS
├── (1:N) TRIPS
├── (1:N) NOTIFICATIONS
├── (1:N) DISPUTES
└── (1:N) BLOG_POSTS (as author)

VEHICLES
├── (1:N) RENTALS
├── (1:N) TRIPS
└── (1:N) VEHICLE_MAINTENANCE

RENTALS → (1:N) PAYMENTS
RENTALS → (1:N) TRIPS
SUBSCRIPTIONS_PLANS → (1:N) PAYMENTS

BATTERY_STATIONS → (1:N) BATTERY_INVENTORY

CAREER_POSTINGS → (1:N) JOB_APPLICATIONS
```

---

## 🔌 API Overview

### 11 API Categories

| # | Category | Endpoints | Priority |
|---|----------|-----------|----------|
| 1 | **Authentication** | Signup, Login, Logout, Refresh | P1 |
| 2 | **Users** | Profile, List, Photo Upload | P1 |
| 3 | **KYC** | Submit, Status, Approve, Reject | P1 |
| 4 | **Vehicles** | List, Details, Fleet, CRUD | P2 |
| 5 | **Rentals** | Plans, Create, Cancel, Complete | P2 |
| 6 | **Payments** | Methods, Create, Verify, Approve | P2 |
| 7 | **Trips** | History, Earnings, Analytics | P3 |
| 8 | **Battery Stations** | List, Locations, Availability | P3 |
| 9 | **Blog** | List, Read, Create, Update | P3 |
| 10 | **Careers/Jobs** | List, Apply, Applications | P3 |
| 11 | **Notifications** | List, Mark Read | P3 |

### Sample Request/Response

```bash
# Login Example
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}

Response (200 OK):
{
  "ok": true,
  "body": {
    "user": {
      "userId": 1,
      "name": "John Doe",
      "role": "user",
      "kycStatus": "approved"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

## 🚀 Quick Start

### 1. Setup Database

```bash
# Login to MySQL
mysql -u root -p

# Execute the schema script
mysql -u root -p < DATABASE_SCHEMA.sql

# Verify tables created
mysql -u root -p kwick_rental_db -e "SHOW TABLES;"
```

### 2. Create Backend

```bash
# Initialize Node.js project
mkdir kwick-backend
cd kwick-backend
npm init -y

# Install dependencies
npm install express cors dotenv mysql2 jsonwebtoken bcryptjs multer

# Create project structure
mkdir config controllers routes middleware models utils

# Create .env file
cat > .env << EOF
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=kwick_rental_db
JWT_SECRET=your_secret_key
PORT=5000
EOF

# Create basic server
cat > server.js << 'EOF'
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes will go here

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
EOF

npm start
```

### 3. Implement APIs

Refer to `API_ENDPOINTS.md` for detailed specifications of each endpoint.

Start with Priority 1 endpoints:
- POST `/auth/signup`
- POST `/auth/login`
- GET `/users/me`
- POST `/kyc/submit`
- GET `/kyc/status`

### 4. Connect Frontend

Update the frontend API calls to point to your backend:

```javascript
// In frontend config
const API_BASE_URL = 'http://localhost:5000/api';

// Example API call
async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
}
```

---

## 📊 Database Performance Tips

### Indexing Strategy
```sql
-- Critical indexes for common queries
CREATE INDEX idx_users_email ON USERS(email);
CREATE INDEX idx_rentals_user_id ON RENTALS(user_id);
CREATE INDEX idx_payments_status ON PAYMENTS(status);
CREATE INDEX idx_trips_user_id ON TRIPS(user_id);

-- Composite indexes for complex queries
CREATE INDEX idx_rentals_user_status ON RENTALS(user_id, status);
CREATE INDEX idx_payments_user_status ON PAYMENTS(user_id, status);
CREATE INDEX idx_notifications_user_read ON NOTIFICATIONS(user_id, is_read);
```

### Query Examples
```sql
-- Get user's active rentals
SELECT * FROM RENTALS 
WHERE user_id = 1 AND status = 'active'
ORDER BY start_date DESC;

-- Calculate daily revenue
SELECT 
  DATE(payment_date) as date,
  SUM(amount) as revenue,
  COUNT(*) as transactions
FROM PAYMENTS
WHERE status = 'completed'
GROUP BY DATE(payment_date);

-- Get top earners
SELECT 
  u.user_id,
  u.name,
  COUNT(t.trip_id) as trips,
  SUM(t.earnings) as total_earnings
FROM USERS u
LEFT JOIN TRIPS t ON u.user_id = t.user_id
GROUP BY u.user_id
ORDER BY total_earnings DESC
LIMIT 10;
```

---

## 🔐 Security Checklist

- [ ] Use JWT with expiry times (15 min access token, 7 day refresh token)
- [ ] Hash passwords with bcrypt (minimum 10 rounds)
- [ ] Encrypt sensitive data (Aadhaar, License numbers)
- [ ] Use HTTPS for all API calls
- [ ] Implement rate limiting (100 req/min per user)
- [ ] Validate all inputs server-side
- [ ] Use parameterized queries to prevent SQL injection
- [ ] Sanitize all output to prevent XSS
- [ ] Implement CORS properly (whitelist origins)
- [ ] Set secure HTTP headers
- [ ] Log security events for audit trail
- [ ] Implement 2FA for admin accounts

---

## 📈 Scalability Milestones

### Phase 1: MVP (Current - 100K users)
- Single Node.js server
- Single MySQL database
- Local file storage or S3

### Phase 2: Growth (1M users)
- Load balancer (Nginx)
- Database read replicas
- Redis caching layer
- AWS S3 for files
- Message queue (RabbitMQ)

### Phase 3: Scale (10M+ users)
- Microservices architecture
- Kubernetes orchestration
- Database sharding
- ElasticSearch for search
- Event streaming (Kafka)
- Data warehouse

---

## 🧪 Testing Strategy

### Unit Tests (80% coverage target)
```bash
npm install --save-dev jest
npm test
```

### Integration Tests
Test complete flows:
- Signup → KYC → Rental → Payment
- Admin: Login → Approve KYC → Approve Payment

### E2E Tests
```bash
npm install --save-dev cypress
npx cypress open
```

### Load Testing
```bash
# Using Apache JMeter or similar
# Target: 1000 concurrent users
# Response time: < 500ms p95
```

---

## 📝 Business Metrics to Track

### User Metrics
- Active users (DAU/MAU)
- Signup rate
- KYC completion rate
- First rental conversion
- User retention (7d, 30d, 90d)

### Revenue Metrics
- Total revenue
- Average revenue per user (ARPU)
- Lifetime value (LTV)
- Payment success rate
- Refund rate

### Vehicle Metrics
- Vehicle utilization rate
- Average kilometers per day
- Battery efficiency
- Maintenance costs
- Revenue per vehicle

### Platform Metrics
- API response time (p50, p95, p99)
- Error rate
- Uptime percentage
- Database query time
- Cache hit rate

---

## 🛠️ Development Tools

### Recommended Stack
- **Backend:** Node.js + Express.js
- **Database:** MySQL 8.0+
- **Frontend:** React 18 + Vite (already setup)
- **API Testing:** Postman/Insomnia
- **Database:** MySQL Workbench / TablePlus
- **Monitoring:** New Relic / DataDog
- **Error Tracking:** Sentry
- **Logging:** ELK Stack / Loki

### Setup Commands
```bash
# Backend setup
npm install
npm run dev        # Development
npm start          # Production
npm test           # Run tests

# Database
mysql -u root -p < DATABASE_SCHEMA.sql
mysql -u root -p kwick_rental_db        # Connect to DB

# Frontend (already running)
npm run dev        # http://localhost:3001
npm run build      # Production build
```

---

## 📞 Support & Questions

### Common Issues

**Issue:** "Unknown column in field list"
```sql
-- Solution: Check table/column names match schema
DESCRIBE USERS;  -- View table structure
```

**Issue:** "Access denied for user"
```bash
# Solution: Check credentials in .env
mysql -u root -p -e "SHOW GRANTS FOR 'kwick_user'@'localhost';"
```

**Issue:** "Foreign key constraint fails"
```sql
-- Solution: Ensure parent record exists before inserting
-- Check: INSERT INTO RENTALS must have existing vehicle_id in VEHICLES
```

---

## 📚 Additional Resources

### Documentation Files in Repository
- `DATABASE_SCHEMA.md` - Detailed schema specification
- `DATABASE_SCHEMA.sql` - SQL creation script
- `API_ENDPOINTS.md` - REST API specifications
- `SCHEMA_SUMMARY.md` - Executive summary
- `IMPLEMENTATION_CHECKLIST.md` - Implementation tracking

### External Resources
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [JWT Introduction](https://jwt.io/introduction)
- [REST API Best Practices](https://restfulapi.net/)

---

## ✅ Implementation Status

- [x] Frontend application (React + Vite)
- [x] Routing system implemented
- [x] Auth context created
- [x] UI components completed
- [ ] Database schema (READY - See DATABASE_SCHEMA.sql)
- [ ] Backend API (TO DO - See API_ENDPOINTS.md)
- [ ] Payment integration (TO DO)
- [ ] Email notifications (TO DO)
- [ ] SMS notifications (TO DO)

---

## 🎯 Next Steps

1. **Database Setup** (Day 1)
   - Execute `DATABASE_SCHEMA.sql`
   - Verify all tables created
   - Insert sample data

2. **Backend Development** (Days 2-7)
   - Set up Node.js/Express project
   - Implement authentication endpoints
   - Implement user management
   - Implement KYC management

3. **API Integration** (Days 8-14)
   - Connect frontend to backend
   - Implement vehicle rentals
   - Implement payments
   - Test complete flows

4. **Testing & Deployment** (Days 15-21)
   - Write and run tests
   - Performance optimization
   - Security audit
   - Deploy to production

---

## 📝 Project Information

**Project Name:** KWICK EV Rental Platform  
**Repository:** Sruwat/Kwick  
**Version:** 1.0 (Development)  
**Created:** November 2025  
**Database Tables:** 16  
**API Endpoints:** 50+  
**Estimated Dev Time:** 6-8 weeks  

---

## 📄 License

[Add your license information here]

---

## 👥 Team

**Frontend:** Completed ✅  
**Database Design:** Completed ✅  
**Backend API:** In Progress 🔄  
**DevOps:** In Progress 🔄  
**QA:** Pending ⏳  

---

**Ready to build something amazing? Let's go! 🚀**
