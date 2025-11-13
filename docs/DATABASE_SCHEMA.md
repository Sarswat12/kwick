# KWICK EV Rental Platform - Database Schema

## Overview
KWICK is an EV (Electric Vehicle) rental platform for India. Users can rent electric scooters/vehicles, track deliveries, manage payments, and earn money. Admins manage users, KYC verification, payments, and platform content.

---

## Core Tables

### 1. **USERS** (User Accounts)
Stores user account information including personal details and authentication data.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| user_id | UUID/INT | NO | PRIMARY KEY | Unique identifier |
| name | VARCHAR(255) | NO | - | Full name of user |
| email | VARCHAR(255) | NO | UNIQUE | Email address |
| phone | VARCHAR(20) | NO | UNIQUE | Phone number (with country code) |
| password_hash | VARCHAR(255) | NO | - | Hashed password |
| role | ENUM('user', 'admin') | NO | DEFAULT 'user' | User role |
| status | ENUM('active', 'inactive', 'suspended') | NO | DEFAULT 'active' | Account status |
| tier | ENUM('bronze', 'silver', 'gold', 'platinum') | NO | DEFAULT 'bronze' | Membership tier |
| kyc_status | ENUM('incomplete', 'pending', 'approved', 'rejected') | NO | DEFAULT 'incomplete' | KYC verification status |
| kyc_reject_reason | TEXT | YES | - | Reason for KYC rejection |
| kyc_submitted_at | TIMESTAMP | YES | - | When KYC was submitted |
| kyc_approved_at | TIMESTAMP | YES | - | When KYC was approved |
| profile_photo_url | VARCHAR(500) | YES | - | URL to profile photo/selfie |
| total_spent | DECIMAL(10, 2) | NO | DEFAULT 0 | Total amount spent |
| total_rides | INT | NO | DEFAULT 0 | Total number of rides/rentals |
| total_earnings | DECIMAL(10, 2) | NO | DEFAULT 0 | Total earnings for riders |
| average_rating | DECIMAL(3, 2) | YES | DEFAULT 0 | Average rating (1-5) |
| created_at | TIMESTAMP | NO | DEFAULT CURRENT_TIMESTAMP | Account creation date |
| updated_at | TIMESTAMP | NO | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update |
| last_login | TIMESTAMP | YES | - | Last login timestamp |

**Indexes:**
- INDEX(email)
- INDEX(phone)
- INDEX(status)
- INDEX(kyc_status)
- INDEX(role)

---

### 2. **KYC_VERIFICATION** (Know Your Customer)
Stores KYC document details for user verification.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| kyc_id | UUID/INT | NO | PRIMARY KEY | Unique identifier |
| user_id | UUID/INT | NO | FOREIGN KEY (USERS) | Reference to user |
| aadhaar_number | VARCHAR(12) | NO | ENCRYPTED | Aadhaar ID number |
| driving_license_number | VARCHAR(50) | NO | ENCRYPTED | Driving license number |
| license_expiry_date | DATE | NO | - | License expiry date |
| street_address | VARCHAR(255) | NO | - | Street address |
| city | VARCHAR(100) | NO | - | City |
| state | VARCHAR(100) | NO | - | State |
| pincode | VARCHAR(10) | NO | - | Postal code |
| aadhaar_front_url | VARCHAR(500) | YES | - | Aadhaar card front side image |
| aadhaar_back_url | VARCHAR(500) | YES | - | Aadhaar card back side image |
| license_front_url | VARCHAR(500) | YES | - | Driving license front image |
| license_back_url | VARCHAR(500) | YES | - | Driving license back image |
| selfie_url | VARCHAR(500) | YES | - | User selfie photo |
| verification_status | ENUM('pending', 'approved', 'rejected') | NO | DEFAULT 'pending' | Verification status |
| rejection_reason | TEXT | YES | - | Reason for rejection |
| verified_by_admin | UUID/INT | YES | FOREIGN KEY (USERS) | Admin who verified |
| verified_at | TIMESTAMP | YES | - | Verification timestamp |
| created_at | TIMESTAMP | NO | DEFAULT CURRENT_TIMESTAMP | Submission date |
| updated_at | TIMESTAMP | NO | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update |

**Indexes:**
- FOREIGN KEY(user_id)
- INDEX(verification_status)

---

### 3. **VEHICLES** (EV Fleet)
Stores vehicle information including registration and status.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| vehicle_id | UUID/INT | NO | PRIMARY KEY | Unique identifier |
| name | VARCHAR(100) | NO | - | Vehicle name/model (e.g., "KWICK Elite") |
| model | VARCHAR(100) | NO | - | Model name |
| registration_number | VARCHAR(50) | NO | UNIQUE | Vehicle registration number |
| controller_id | VARCHAR(100) | YES | - | Vehicle controller ID for tracking |
| vehicle_type | ENUM('scooter', 'bike', 'delivery-bike') | NO | DEFAULT 'scooter' | Type of vehicle |
| purchase_date | DATE | NO | - | Date of purchase |
| status | ENUM('active', 'maintenance', 'inactive', 'retired') | NO | DEFAULT 'active' | Current status |
| battery_capacity_kwh | DECIMAL(5, 2) | NO | - | Battery capacity in kWh |
| current_battery_level | INT | NO | - | Current battery percentage (0-100) |
| last_battery_check | TIMESTAMP | YES | - | Last battery check time |
| current_location_latitude | DECIMAL(10, 8) | YES | - | Current GPS latitude |
| current_location_longitude | DECIMAL(11, 8) | YES | - | Current GPS longitude |
| last_location_update | TIMESTAMP | YES | - | Last GPS update time |
| total_distance_km | DECIMAL(10, 2) | NO | DEFAULT 0 | Total kilometers traveled |
| total_trips | INT | NO | DEFAULT 0 | Total number of trips |
| total_earnings | DECIMAL(10, 2) | NO | DEFAULT 0 | Total earnings generated |
| cost_price | DECIMAL(8, 2) | NO | - | Purchase cost |
| maintenance_cost | DECIMAL(8, 2) | NO | DEFAULT 0 | Total maintenance cost |
| created_at | TIMESTAMP | NO | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | NO | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update |

**Indexes:**
- INDEX(registration_number)
- INDEX(status)
- INDEX(controller_id)

---

### 4. **RENTALS** (Vehicle Rentals)
Stores rental/lease information for users renting vehicles.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| rental_id | UUID/INT | NO | PRIMARY KEY | Unique identifier |
| user_id | UUID/INT | NO | FOREIGN KEY (USERS) | User renting vehicle |
| vehicle_id | UUID/INT | NO | FOREIGN KEY (VEHICLES) | Vehicle being rented |
| rental_type | ENUM('daily', 'weekly', 'monthly', 'delivery') | NO | - | Rental type/plan |
| rental_plan | VARCHAR(100) | YES | - | Plan name (e.g., "Weekly Plan") |
| start_date | DATE | NO | - | Rental start date |
| end_date | DATE | NO | - | Rental end date |
| expected_end_date | DATE | YES | - | Expected end date |
| actual_end_date | DATE | YES | - | Actual end date (if completed) |
| status | ENUM('active', 'completed', 'cancelled', 'on-hold') | NO | DEFAULT 'active' | Rental status |
| rental_cost | DECIMAL(8, 2) | NO | - | Total rental cost |
| security_deposit | DECIMAL(8, 2) | NO | DEFAULT 0 | Security deposit amount |
| odometer_start_km | DECIMAL(10, 2) | NO | - | Starting odometer reading |
| odometer_end_km | DECIMAL(10, 2) | YES | - | Ending odometer reading |
| total_distance_km | DECIMAL(10, 2) | YES | - | Total distance traveled |
| fuel_charges | DECIMAL(8, 2) | NO | DEFAULT 0 | Electricity/charging charges |
| damage_charges | DECIMAL(8, 2) | NO | DEFAULT 0 | Damage charges |
| late_return_charges | DECIMAL(8, 2) | NO | DEFAULT 0 | Late return charges |
| total_amount_due | DECIMAL(8, 2) | NO | - | Total amount due |
| payment_status | ENUM('pending', 'partial', 'completed', 'refunded') | NO | DEFAULT 'pending' | Payment status |
| cancellation_reason | TEXT | YES | - | Reason for cancellation |
| notes | TEXT | YES | - | Additional notes |
| created_at | TIMESTAMP | NO | DEFAULT CURRENT_TIMESTAMP | Rental creation date |
| updated_at | TIMESTAMP | NO | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update |

**Indexes:**
- FOREIGN KEY(user_id)
- FOREIGN KEY(vehicle_id)
- INDEX(status)
- INDEX(rental_type)

---

### 5. **PAYMENTS** (Payment Transactions)
Stores payment and transaction information.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| payment_id | UUID/INT | NO | PRIMARY KEY | Unique identifier |
| user_id | UUID/INT | NO | FOREIGN KEY (USERS) | User making payment |
| rental_id | UUID/INT | YES | FOREIGN KEY (RENTALS) | Associated rental |
| plan_id | UUID/INT | YES | FOREIGN KEY (SUBSCRIPTION_PLANS) | Associated plan |
| amount | DECIMAL(8, 2) | NO | - | Payment amount |
| currency | VARCHAR(3) | NO | DEFAULT 'INR' | Currency code |
| payment_method | ENUM('upi', 'credit_card', 'debit_card', 'bank_transfer', 'wallet') | NO | - | Payment method |
| utr_number | VARCHAR(50) | YES | - | UTR/Transaction reference number |
| payment_gateway | VARCHAR(50) | YES | - | Payment gateway used (e.g., "Razorpay") |
| gateway_transaction_id | VARCHAR(100) | YES | - | External gateway transaction ID |
| status | ENUM('pending', 'processing', 'completed', 'failed', 'refunded') | NO | DEFAULT 'pending' | Payment status |
| failure_reason | TEXT | YES | - | Reason for payment failure |
| proof_image_url | VARCHAR(500) | YES | - | Payment proof/screenshot URL |
| payment_date | TIMESTAMP | NO | DEFAULT CURRENT_TIMESTAMP | Payment timestamp |
| verified_at | TIMESTAMP | YES | - | When payment was verified |
| verified_by_admin | UUID/INT | YES | FOREIGN KEY (USERS) | Admin who verified |
| refund_status | ENUM('none', 'pending', 'completed') | NO | DEFAULT 'none' | Refund status |
| refund_amount | DECIMAL(8, 2) | YES | - | Refund amount |
| refund_date | TIMESTAMP | YES | - | Refund date |
| notes | TEXT | YES | - | Payment notes |
| created_at | TIMESTAMP | NO | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | NO | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update |

**Indexes:**
- FOREIGN KEY(user_id)
- FOREIGN KEY(rental_id)
- FOREIGN KEY(plan_id)
- INDEX(status)
- INDEX(payment_method)

---

### 6. **SUBSCRIPTION_PLANS** (Rental Plans)
Stores subscription/rental plan templates.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| plan_id | UUID/INT | NO | PRIMARY KEY | Unique identifier |
| plan_name | VARCHAR(100) | NO | - | Plan name (e.g., "Weekly Plan") |
| plan_type | ENUM('daily', 'weekly', 'monthly') | NO | - | Plan duration type |
| duration_days | INT | NO | - | Number of days in plan |
| price | DECIMAL(8, 2) | NO | - | Plan price |
| currency | VARCHAR(3) | NO | DEFAULT 'INR' | Currency code |
| description | TEXT | YES | - | Plan description |
| features | JSON | YES | - | Plan features as JSON array |
| max_km_limit | INT | YES | - | Maximum km limit per month (NULL = unlimited) |
| max_trips_limit | INT | YES | - | Maximum trips limit (NULL = unlimited) |
| discount_percentage | DECIMAL(5, 2) | NO | DEFAULT 0 | Discount percentage |
| is_popular | BOOLEAN | NO | DEFAULT FALSE | Mark as popular plan |
| status | ENUM('active', 'inactive') | NO | DEFAULT 'active' | Plan status |
| created_at | TIMESTAMP | NO | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | NO | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update |

**Indexes:**
- INDEX(plan_type)
- INDEX(status)

---

### 7. **TRIPS/DELIVERIES** (Ride History)
Stores trip/delivery information for tracking and earnings.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| trip_id | UUID/INT | NO | PRIMARY KEY | Unique identifier |
| rental_id | UUID/INT | NO | FOREIGN KEY (RENTALS) | Associated rental |
| user_id | UUID/INT | NO | FOREIGN KEY (USERS) | User who made trip |
| vehicle_id | UUID/INT | NO | FOREIGN KEY (VEHICLES) | Vehicle used |
| trip_type | ENUM('delivery', 'personal-use', 'charging') | NO | DEFAULT 'delivery' | Type of trip |
| start_location_latitude | DECIMAL(10, 8) | NO | - | Start GPS latitude |
| start_location_longitude | DECIMAL(11, 8) | NO | - | Start GPS longitude |
| end_location_latitude | DECIMAL(10, 8) | YES | - | End GPS latitude |
| end_location_longitude | DECIMAL(11, 8) | YES | - | End GPS longitude |
| distance_km | DECIMAL(10, 2) | YES | - | Distance traveled in km |
| start_time | TIMESTAMP | NO | - | Trip start time |
| end_time | TIMESTAMP | YES | - | Trip end time |
| duration_minutes | INT | YES | - | Trip duration in minutes |
| battery_start_level | INT | YES | - | Battery level at start (%) |
| battery_end_level | INT | YES | - | Battery level at end (%) |
| battery_consumed_percent | INT | YES | - | Battery percentage consumed |
| earnings | DECIMAL(8, 2) | YES | DEFAULT 0 | Earnings from this trip |
| rating_given | DECIMAL(3, 2) | YES | - | Rating given by user (1-5) |
| rating_notes | TEXT | YES | - | Rating comments |
| status | ENUM('in-progress', 'completed', 'cancelled') | NO | DEFAULT 'in-progress' | Trip status |
| notes | TEXT | YES | - | Trip notes |
| created_at | TIMESTAMP | NO | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | NO | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update |

**Indexes:**
- FOREIGN KEY(rental_id)
- FOREIGN KEY(user_id)
- FOREIGN KEY(vehicle_id)
- INDEX(status)
- INDEX(trip_type)

---

### 8. **BATTERY_STATIONS** (Charging Stations)
Stores information about battery swap/charging stations.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| station_id | UUID/INT | NO | PRIMARY KEY | Unique identifier |
| station_name | VARCHAR(255) | NO | - | Station name |
| location_latitude | DECIMAL(10, 8) | NO | - | Station GPS latitude |
| location_longitude | DECIMAL(11, 8) | NO | - | Station GPS longitude |
| address | VARCHAR(500) | NO | - | Full address |
| city | VARCHAR(100) | NO | - | City |
| state | VARCHAR(100) | NO | - | State |
| pincode | VARCHAR(10) | NO | - | Postal code |
| contact_person | VARCHAR(255) | YES | - | Contact person name |
| contact_phone | VARCHAR(20) | YES | - | Contact phone |
| station_type | ENUM('swap', 'charging', 'both') | NO | - | Type of station |
| available_batteries | INT | NO | DEFAULT 0 | Number of available batteries |
| charging_ports | INT | NO | DEFAULT 0 | Number of charging ports |
| operating_hours_start | TIME | YES | - | Opening time |
| operating_hours_end | TIME | YES | - | Closing time |
| swap_fee | DECIMAL(5, 2) | YES | - | Battery swap fee |
| charging_fee_per_hour | DECIMAL(5, 2) | YES | - | Charging fee per hour |
| status | ENUM('active', 'maintenance', 'closed') | NO | DEFAULT 'active' | Station status |
| created_at | TIMESTAMP | NO | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | NO | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update |

**Indexes:**
- INDEX(city)
- INDEX(status)

---

### 9. **BATTERY_INVENTORY** (Battery Management)
Stores individual battery pack information and status.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| battery_id | UUID/INT | NO | PRIMARY KEY | Unique identifier |
| station_id | UUID/INT | NO | FOREIGN KEY (BATTERY_STATIONS) | Station where battery is |
| battery_model | VARCHAR(100) | NO | - | Battery model/manufacturer |
| capacity_kwh | DECIMAL(5, 2) | NO | - | Battery capacity in kWh |
| serial_number | VARCHAR(100) | NO | UNIQUE | Battery serial number |
| health_percentage | INT | NO | - | Battery health (0-100%) |
| charge_cycles | INT | NO | DEFAULT 0 | Number of charge cycles |
| current_charge_level | INT | NO | - | Current charge percentage |
| status | ENUM('available', 'charging', 'in-use', 'faulty', 'retired') | NO | - | Battery status |
| last_charged_at | TIMESTAMP | YES | - | Last charging time |
| last_used_at | TIMESTAMP | YES | - | Last usage time |
| purchase_date | DATE | NO | - | Purchase date |
| warranty_expiry_date | DATE | YES | - | Warranty expiry |
| created_at | TIMESTAMP | NO | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | NO | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update |

**Indexes:**
- FOREIGN KEY(station_id)
- INDEX(status)
- INDEX(serial_number)

---

### 10. **BLOG_POSTS** (Content Management)
Stores blog posts and content for the platform.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| blog_id | UUID/INT | NO | PRIMARY KEY | Unique identifier |
| title | VARCHAR(500) | NO | - | Blog post title |
| slug | VARCHAR(500) | NO | UNIQUE | URL-friendly slug |
| excerpt | TEXT | NO | - | Short excerpt |
| content | LONGTEXT | NO | - | Full blog content (HTML) |
| author_id | UUID/INT | NO | FOREIGN KEY (USERS) | Author user ID |
| author_name | VARCHAR(255) | YES | - | Author display name |
| category | VARCHAR(100) | NO | - | Blog category |
| tags | JSON | YES | - | Tags as JSON array |
| featured_image_url | VARCHAR(500) | YES | - | Featured image URL |
| read_time_minutes | INT | YES | - | Estimated read time |
| status | ENUM('draft', 'published', 'archived') | NO | DEFAULT 'draft' | Publication status |
| is_featured | BOOLEAN | NO | DEFAULT FALSE | Feature on homepage |
| view_count | INT | NO | DEFAULT 0 | Number of views |
| published_at | TIMESTAMP | YES | - | Publication timestamp |
| created_at | TIMESTAMP | NO | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | NO | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update |

**Indexes:**
- FOREIGN KEY(author_id)
- INDEX(slug)
- INDEX(status)
- INDEX(category)

---

### 11. **CAREER_POSTINGS** (Job Listings)
Stores job postings and recruitment information.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| job_id | UUID/INT | NO | PRIMARY KEY | Unique identifier |
| job_title | VARCHAR(255) | NO | - | Job title |
| department | VARCHAR(100) | NO | - | Department |
| job_type | ENUM('full-time', 'part-time', 'contract', 'internship') | NO | - | Employment type |
| location | VARCHAR(255) | NO | - | Job location |
| salary_range_min | DECIMAL(10, 2) | YES | - | Minimum salary |
| salary_range_max | DECIMAL(10, 2) | YES | - | Maximum salary |
| currency | VARCHAR(3) | NO | DEFAULT 'INR' | Currency code |
| description | LONGTEXT | NO | - | Job description |
| requirements | JSON | YES | - | Requirements as JSON array |
| benefits | JSON | YES | - | Benefits as JSON array |
| application_deadline | DATE | NO | - | Application deadline |
| status | ENUM('open', 'closed', 'filled') | NO | DEFAULT 'open' | Job status |
| created_at | TIMESTAMP | NO | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | NO | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update |

**Indexes:**
- INDEX(status)
- INDEX(department)

---

### 12. **JOB_APPLICATIONS** (Career Applications)
Stores job applications from candidates.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| application_id | UUID/INT | NO | PRIMARY KEY | Unique identifier |
| job_id | UUID/INT | NO | FOREIGN KEY (CAREER_POSTINGS) | Job applied for |
| applicant_name | VARCHAR(255) | NO | - | Applicant name |
| applicant_email | VARCHAR(255) | NO | - | Applicant email |
| applicant_phone | VARCHAR(20) | NO | - | Applicant phone |
| resume_url | VARCHAR(500) | NO | - | Resume file URL |
| cover_letter | TEXT | YES | - | Cover letter text |
| status | ENUM('submitted', 'reviewing', 'shortlisted', 'rejected', 'hired') | NO | DEFAULT 'submitted' | Application status |
| notes | TEXT | YES | - | Internal notes |
| applied_at | TIMESTAMP | NO | DEFAULT CURRENT_TIMESTAMP | Application date |
| reviewed_at | TIMESTAMP | YES | - | Review date |
| created_at | TIMESTAMP | NO | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | NO | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update |

**Indexes:**
- FOREIGN KEY(job_id)
- INDEX(status)

---

### 13. **NOTIFICATIONS** (User Notifications)
Stores system notifications and alerts for users.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| notification_id | UUID/INT | NO | PRIMARY KEY | Unique identifier |
| user_id | UUID/INT | NO | FOREIGN KEY (USERS) | Recipient user |
| notification_type | ENUM('payment', 'rental', 'kyc', 'system', 'promotion', 'alert') | NO | - | Notification type |
| title | VARCHAR(255) | NO | - | Notification title |
| message | TEXT | NO | - | Notification message |
| related_entity_type | VARCHAR(50) | YES | - | Entity type (e.g., 'rental', 'payment') |
| related_entity_id | VARCHAR(100) | YES | - | Related entity ID |
| is_read | BOOLEAN | NO | DEFAULT FALSE | Read status |
| read_at | TIMESTAMP | YES | - | When notification was read |
| action_url | VARCHAR(500) | YES | - | URL to related action |
| priority | ENUM('low', 'medium', 'high', 'critical') | NO | DEFAULT 'medium' | Priority level |
| created_at | TIMESTAMP | NO | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | NO | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update |

**Indexes:**
- FOREIGN KEY(user_id)
- INDEX(is_read)
- INDEX(notification_type)

---

### 14. **ADMIN_LOGS** (Audit Trail)
Stores admin actions for audit and compliance.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| log_id | UUID/INT | NO | PRIMARY KEY | Unique identifier |
| admin_id | UUID/INT | NO | FOREIGN KEY (USERS) | Admin who performed action |
| action_type | ENUM('create', 'update', 'delete', 'approve', 'reject', 'block', 'unblock') | NO | - | Type of action |
| entity_type | VARCHAR(50) | NO | - | Entity type (e.g., 'user', 'kyc', 'payment') |
| entity_id | VARCHAR(100) | NO | - | Entity ID |
| old_values | JSON | YES | - | Old values (for updates) |
| new_values | JSON | YES | - | New values (for updates) |
| reason | TEXT | YES | - | Reason for action |
| ip_address | VARCHAR(50) | YES | - | Admin's IP address |
| user_agent | VARCHAR(500) | YES | - | Browser user agent |
| created_at | TIMESTAMP | NO | DEFAULT CURRENT_TIMESTAMP | Action timestamp |

**Indexes:**
- FOREIGN KEY(admin_id)
- INDEX(action_type)
- INDEX(entity_type)
- INDEX(created_at)

---

### 15. **DISPUTES** (Customer Support)
Stores dispute/complaint information.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| dispute_id | UUID/INT | NO | PRIMARY KEY | Unique identifier |
| user_id | UUID/INT | NO | FOREIGN KEY (USERS) | User filing dispute |
| rental_id | UUID/INT | YES | FOREIGN KEY (RENTALS) | Associated rental |
| trip_id | UUID/INT | YES | FOREIGN KEY (TRIPS) | Associated trip |
| payment_id | UUID/INT | YES | FOREIGN KEY (PAYMENTS) | Associated payment |
| dispute_type | ENUM('damage', 'loss', 'payment-issue', 'billing-error', 'service-quality', 'other') | NO | - | Dispute type |
| title | VARCHAR(255) | NO | - | Dispute title |
| description | TEXT | NO | - | Detailed description |
| evidence_urls | JSON | YES | - | Evidence files/photos as JSON array |
| amount_disputed | DECIMAL(8, 2) | YES | - | Disputed amount |
| status | ENUM('open', 'in-review', 'resolved', 'rejected', 'escalated') | NO | DEFAULT 'open' | Dispute status |
| assigned_to_admin | UUID/INT | YES | FOREIGN KEY (USERS) | Assigned admin |
| resolution | TEXT | YES | - | Resolution details |
| resolved_at | TIMESTAMP | YES | - | Resolution timestamp |
| created_at | TIMESTAMP | NO | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | NO | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update |

**Indexes:**
- FOREIGN KEY(user_id)
- FOREIGN KEY(rental_id)
- INDEX(status)

---

### 16. **VEHICLE_MAINTENANCE** (Maintenance Records)
Stores vehicle maintenance and service records.

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| maintenance_id | UUID/INT | NO | PRIMARY KEY | Unique identifier |
| vehicle_id | UUID/INT | NO | FOREIGN KEY (VEHICLES) | Vehicle being maintained |
| maintenance_type | ENUM('routine', 'battery-check', 'repair', 'inspection', 'cleaning') | NO | - | Type of maintenance |
| description | TEXT | NO | - | Maintenance description |
| cost | DECIMAL(8, 2) | NO | - | Maintenance cost |
| parts_replaced | JSON | YES | - | Parts replaced as JSON array |
| service_provider | VARCHAR(255) | YES | - | Service provider name |
| start_date | DATE | NO | - | Maintenance start date |
| completion_date | DATE | YES | - | Completion date |
| status | ENUM('scheduled', 'in-progress', 'completed', 'pending') | NO | DEFAULT 'scheduled' | Status |
| notes | TEXT | YES | - | Additional notes |
| created_at | TIMESTAMP | NO | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | NO | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update |

**Indexes:**
- FOREIGN KEY(vehicle_id)
- INDEX(status)

---

## Relationships Diagram

```
USERS
├── KYC_VERIFICATION (1:1)
├── RENTALS (1:N)
├── PAYMENTS (1:N)
├── TRIPS (1:N)
├── BLOG_POSTS (1:N as author)
├── JOB_APPLICATIONS (1:N)
├── NOTIFICATIONS (1:N)
├── ADMIN_LOGS (1:N)
├── DISPUTES (1:N)
└── BATTERY_STATIONS (1:N as contact)

VEHICLES
├── RENTALS (1:N)
├── TRIPS (1:N)
├── VEHICLE_MAINTENANCE (1:N)
└── BATTERY_INVENTORY (via BATTERY_STATIONS)

RENTALS
├── PAYMENTS (1:N)
├── TRIPS (1:N)
└── DISPUTES (1:N)

SUBSCRIPTION_PLANS
└── PAYMENTS (1:N)

BATTERY_STATIONS
└── BATTERY_INVENTORY (1:N)

CAREER_POSTINGS
└── JOB_APPLICATIONS (1:N)
```

---

## Key Constraints & Rules

### Data Integrity
1. **User Deletion**: Soft delete recommended. Keep historical records for auditing.
2. **KYC Verification**: Cannot be modified after approval (creates new record if changes needed).
3. **Payment Records**: Immutable once completed. Changes logged to ADMIN_LOGS.
4. **Vehicle Status**: Cannot be deleted; only status changes to 'retired'.

### Business Rules
1. **Rental Period**: End date must be after start date.
2. **Payment Status**: Follows sequence: pending → processing → completed (or failed).
3. **KYC Status**: Must be 'approved' before user can rent vehicles.
4. **Battery Level**: Must be 0-100%. Alerts when below 20%.
5. **Tier Upgrade**: Based on total_spent or total_rides thresholds.
6. **Trip Duration**: Must be positive integer.

### Encryption Requirements
- Aadhaar number (sensitive PII)
- Driving license number (sensitive PII)
- Password hash (already hashed, never stored as plaintext)
- Proof images should be encrypted in storage

---

## Indexing Strategy

### High-Priority Indexes
```sql
-- For frequent queries
CREATE INDEX idx_users_email ON USERS(email);
CREATE INDEX idx_users_status ON USERS(status);
CREATE INDEX idx_rentals_user_id ON RENTALS(user_id);
CREATE INDEX idx_rentals_vehicle_id ON RENTALS(vehicle_id);
CREATE INDEX idx_rentals_status ON RENTALS(status);
CREATE INDEX idx_payments_user_id ON PAYMENTS(user_id);
CREATE INDEX idx_payments_status ON PAYMENTS(status);
CREATE INDEX idx_trips_user_id ON TRIPS(user_id);
CREATE INDEX idx_trips_status ON TRIPS(status);
CREATE INDEX idx_kyc_user_id ON KYC_VERIFICATION(user_id);
CREATE INDEX idx_kyc_status ON KYC_VERIFICATION(verification_status);
CREATE INDEX idx_blog_status ON BLOG_POSTS(status);
```

### Composite Indexes
```sql
CREATE INDEX idx_rentals_user_status ON RENTALS(user_id, status);
CREATE INDEX idx_payments_user_status ON PAYMENTS(user_id, status);
CREATE INDEX idx_trips_user_vehicle ON TRIPS(user_id, vehicle_id);
CREATE INDEX idx_notifications_user_read ON NOTIFICATIONS(user_id, is_read);
```

---

## Sample SQL Queries

### Dashboard Stats
```sql
-- User statistics
SELECT 
    COUNT(*) as total_users,
    SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_users,
    SUM(CASE WHEN kyc_status = 'approved' THEN 1 ELSE 0 END) as kyc_approved,
    AVG(average_rating) as avg_rating
FROM USERS;

-- Revenue statistics
SELECT 
    DATE(payment_date) as date,
    SUM(amount) as daily_revenue,
    COUNT(*) as transaction_count
FROM PAYMENTS
WHERE status = 'completed'
GROUP BY DATE(payment_date)
ORDER BY date DESC;

-- Active rentals
SELECT 
    r.rental_id,
    u.name,
    v.registration_number,
    r.start_date,
    r.end_date,
    r.status
FROM RENTALS r
JOIN USERS u ON r.user_id = u.user_id
JOIN VEHICLES v ON r.vehicle_id = v.vehicle_id
WHERE r.status = 'active'
ORDER BY r.start_date;
```

---

## Migration Notes

### Phase 1: Core Tables (Week 1)
- USERS, KYC_VERIFICATION, VEHICLES

### Phase 2: Rental System (Week 2)
- RENTALS, PAYMENTS, SUBSCRIPTION_PLANS

### Phase 3: Trip Tracking (Week 3)
- TRIPS, BATTERY_STATIONS, BATTERY_INVENTORY

### Phase 4: Content & Support (Week 4)
- BLOG_POSTS, CAREER_POSTINGS, JOB_APPLICATIONS
- NOTIFICATIONS, DISPUTES, ADMIN_LOGS, VEHICLE_MAINTENANCE

---

## Performance Considerations

1. **Partitioning**: Partition TRIPS and PAYMENTS by date (monthly).
2. **Archiving**: Archive completed rentals older than 1 year to separate table.
3. **Caching**: Cache active rentals and vehicle status in Redis.
4. **Full-text Search**: Add full-text indexes on blog_posts.content and disputes.description.

---

## API Endpoints Map

| Endpoint | Method | Entity |
|----------|--------|--------|
| /api/users | GET, POST | USERS |
| /api/users/{id} | GET, PUT, DELETE | USERS |
| /api/kyc | POST, GET | KYC_VERIFICATION |
| /api/rentals | GET, POST | RENTALS |
| /api/rentals/{id} | GET, PUT | RENTALS |
| /api/payments | GET, POST | PAYMENTS |
| /api/vehicles | GET, POST | VEHICLES |
| /api/trips | GET, POST | TRIPS |
| /api/battery-stations | GET | BATTERY_STATIONS |
| /api/blog | GET, POST | BLOG_POSTS |
| /api/careers | GET | CAREER_POSTINGS |
| /api/notifications | GET | NOTIFICATIONS |

---

**Database Name:** `kwick_rental_db`  
**Created:** 2025  
**Version:** 1.0  
**Last Updated:** November 2025
