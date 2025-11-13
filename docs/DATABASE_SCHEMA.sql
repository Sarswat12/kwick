-- ============================================================================
-- KWICK EV Rental Platform - Complete Database Schema
-- ============================================================================
-- Database Name: kwick_rental_db
-- Created: November 2025
-- Description: Complete SQL schema for KWICK EV rental platform
-- ============================================================================

-- Create Database
CREATE DATABASE IF NOT EXISTS kwick_rental_db;
USE kwick_rental_db;

-- ============================================================================
-- TABLE 1: USERS (User Accounts)
-- ============================================================================
CREATE TABLE IF NOT EXISTS USERS (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    status ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
    tier ENUM('bronze', 'silver', 'gold', 'platinum') NOT NULL DEFAULT 'bronze',
    kyc_status ENUM('incomplete', 'pending', 'approved', 'rejected') NOT NULL DEFAULT 'incomplete',
    kyc_reject_reason TEXT,
    kyc_submitted_at TIMESTAMP NULL,
    kyc_approved_at TIMESTAMP NULL,
    profile_photo_url VARCHAR(500),
    total_spent DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total_rides INT NOT NULL DEFAULT 0,
    total_earnings DECIMAL(10, 2) NOT NULL DEFAULT 0,
    average_rating DECIMAL(3, 2) DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    
    INDEX idx_email (email),
    INDEX idx_phone (phone),
    INDEX idx_status (status),
    INDEX idx_kyc_status (kyc_status),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 2: KYC_VERIFICATION
-- ============================================================================
CREATE TABLE IF NOT EXISTS KYC_VERIFICATION (
    kyc_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    aadhaar_number VARCHAR(12) NOT NULL,
    driving_license_number VARCHAR(50) NOT NULL,
    license_expiry_date DATE NOT NULL,
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    aadhaar_front_url VARCHAR(500),
    aadhaar_back_url VARCHAR(500),
    license_front_url VARCHAR(500),
    license_back_url VARCHAR(500),
    selfie_url VARCHAR(500),
    verification_status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    rejection_reason TEXT,
    verified_by_admin INT,
    verified_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by_admin) REFERENCES USERS(user_id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_verification_status (verification_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 3: SUBSCRIPTION_PLANS
-- ============================================================================
CREATE TABLE IF NOT EXISTS SUBSCRIPTION_PLANS (
    plan_id INT AUTO_INCREMENT PRIMARY KEY,
    plan_name VARCHAR(100) NOT NULL,
    plan_type ENUM('daily', 'weekly', 'monthly') NOT NULL,
    duration_days INT NOT NULL,
    price DECIMAL(8, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    description TEXT,
    features JSON,
    max_km_limit INT,
    max_trips_limit INT,
    discount_percentage DECIMAL(5, 2) NOT NULL DEFAULT 0,
    is_popular BOOLEAN NOT NULL DEFAULT FALSE,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_plan_type (plan_type),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 4: VEHICLES
-- ============================================================================
CREATE TABLE IF NOT EXISTS VEHICLES (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    registration_number VARCHAR(50) NOT NULL UNIQUE,
    controller_id VARCHAR(100),
    vehicle_type ENUM('scooter', 'bike', 'delivery-bike') NOT NULL DEFAULT 'scooter',
    purchase_date DATE NOT NULL,
    status ENUM('active', 'maintenance', 'inactive', 'retired') NOT NULL DEFAULT 'active',
    battery_capacity_kwh DECIMAL(5, 2) NOT NULL,
    current_battery_level INT NOT NULL,
    last_battery_check TIMESTAMP NULL,
    current_location_latitude DECIMAL(10, 8),
    current_location_longitude DECIMAL(11, 8),
    last_location_update TIMESTAMP NULL,
    total_distance_km DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total_trips INT NOT NULL DEFAULT 0,
    total_earnings DECIMAL(10, 2) NOT NULL DEFAULT 0,
    cost_price DECIMAL(8, 2) NOT NULL,
    maintenance_cost DECIMAL(8, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_registration_number (registration_number),
    INDEX idx_status (status),
    INDEX idx_controller_id (controller_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 5: RENTALS
-- ============================================================================
CREATE TABLE IF NOT EXISTS RENTALS (
    rental_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    rental_type ENUM('daily', 'weekly', 'monthly', 'delivery') NOT NULL,
    rental_plan VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    expected_end_date DATE,
    actual_end_date DATE,
    status ENUM('active', 'completed', 'cancelled', 'on-hold') NOT NULL DEFAULT 'active',
    rental_cost DECIMAL(8, 2) NOT NULL,
    security_deposit DECIMAL(8, 2) NOT NULL DEFAULT 0,
    odometer_start_km DECIMAL(10, 2) NOT NULL,
    odometer_end_km DECIMAL(10, 2),
    total_distance_km DECIMAL(10, 2),
    fuel_charges DECIMAL(8, 2) NOT NULL DEFAULT 0,
    damage_charges DECIMAL(8, 2) NOT NULL DEFAULT 0,
    late_return_charges DECIMAL(8, 2) NOT NULL DEFAULT 0,
    total_amount_due DECIMAL(8, 2) NOT NULL,
    payment_status ENUM('pending', 'partial', 'completed', 'refunded') NOT NULL DEFAULT 'pending',
    cancellation_reason TEXT,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES VEHICLES(vehicle_id) ON DELETE RESTRICT,
    INDEX idx_user_id (user_id),
    INDEX idx_vehicle_id (vehicle_id),
    INDEX idx_status (status),
    INDEX idx_rental_type (rental_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 6: PAYMENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS PAYMENTS (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    rental_id INT,
    plan_id INT,
    amount DECIMAL(8, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    payment_method ENUM('upi', 'credit_card', 'debit_card', 'bank_transfer', 'wallet') NOT NULL,
    utr_number VARCHAR(50),
    payment_gateway VARCHAR(50),
    gateway_transaction_id VARCHAR(100),
    status ENUM('pending', 'processing', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    failure_reason TEXT,
    proof_image_url VARCHAR(500),
    payment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP NULL,
    verified_by_admin INT,
    refund_status ENUM('none', 'pending', 'completed') NOT NULL DEFAULT 'none',
    refund_amount DECIMAL(8, 2),
    refund_date TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE,
    FOREIGN KEY (rental_id) REFERENCES RENTALS(rental_id) ON DELETE SET NULL,
    FOREIGN KEY (plan_id) REFERENCES SUBSCRIPTION_PLANS(plan_id) ON DELETE SET NULL,
    FOREIGN KEY (verified_by_admin) REFERENCES USERS(user_id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_rental_id (rental_id),
    INDEX idx_status (status),
    INDEX idx_payment_method (payment_method)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 7: TRIPS
-- ============================================================================
CREATE TABLE IF NOT EXISTS TRIPS (
    trip_id INT AUTO_INCREMENT PRIMARY KEY,
    rental_id INT NOT NULL,
    user_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    trip_type ENUM('delivery', 'personal-use', 'charging') NOT NULL DEFAULT 'delivery',
    start_location_latitude DECIMAL(10, 8) NOT NULL,
    start_location_longitude DECIMAL(11, 8) NOT NULL,
    end_location_latitude DECIMAL(10, 8),
    end_location_longitude DECIMAL(11, 8),
    distance_km DECIMAL(10, 2),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    duration_minutes INT,
    battery_start_level INT,
    battery_end_level INT,
    battery_consumed_percent INT,
    earnings DECIMAL(8, 2) DEFAULT 0,
    rating_given DECIMAL(3, 2),
    rating_notes TEXT,
    status ENUM('in-progress', 'completed', 'cancelled') NOT NULL DEFAULT 'in-progress',
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (rental_id) REFERENCES RENTALS(rental_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES VEHICLES(vehicle_id) ON DELETE RESTRICT,
    INDEX idx_rental_id (rental_id),
    INDEX idx_user_id (user_id),
    INDEX idx_vehicle_id (vehicle_id),
    INDEX idx_status (status),
    INDEX idx_trip_type (trip_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 8: BATTERY_STATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS BATTERY_STATIONS (
    station_id INT AUTO_INCREMENT PRIMARY KEY,
    station_name VARCHAR(255) NOT NULL,
    location_latitude DECIMAL(10, 8) NOT NULL,
    location_longitude DECIMAL(11, 8) NOT NULL,
    address VARCHAR(500) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    contact_person VARCHAR(255),
    contact_phone VARCHAR(20),
    station_type ENUM('swap', 'charging', 'both') NOT NULL,
    available_batteries INT NOT NULL DEFAULT 0,
    charging_ports INT NOT NULL DEFAULT 0,
    operating_hours_start TIME,
    operating_hours_end TIME,
    swap_fee DECIMAL(5, 2),
    charging_fee_per_hour DECIMAL(5, 2),
    status ENUM('active', 'maintenance', 'closed') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_city (city),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 9: BATTERY_INVENTORY
-- ============================================================================
CREATE TABLE IF NOT EXISTS BATTERY_INVENTORY (
    battery_id INT AUTO_INCREMENT PRIMARY KEY,
    station_id INT NOT NULL,
    battery_model VARCHAR(100) NOT NULL,
    capacity_kwh DECIMAL(5, 2) NOT NULL,
    serial_number VARCHAR(100) NOT NULL UNIQUE,
    health_percentage INT NOT NULL,
    charge_cycles INT NOT NULL DEFAULT 0,
    current_charge_level INT NOT NULL,
    status ENUM('available', 'charging', 'in-use', 'faulty', 'retired') NOT NULL,
    last_charged_at TIMESTAMP NULL,
    last_used_at TIMESTAMP NULL,
    purchase_date DATE NOT NULL,
    warranty_expiry_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (station_id) REFERENCES BATTERY_STATIONS(station_id) ON DELETE CASCADE,
    INDEX idx_station_id (station_id),
    INDEX idx_status (status),
    INDEX idx_serial_number (serial_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 10: BLOG_POSTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS BLOG_POSTS (
    blog_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL UNIQUE,
    excerpt TEXT NOT NULL,
    content LONGTEXT NOT NULL,
    author_id INT NOT NULL,
    author_name VARCHAR(255),
    category VARCHAR(100) NOT NULL,
    tags JSON,
    featured_image_url VARCHAR(500),
    read_time_minutes INT,
    status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    view_count INT NOT NULL DEFAULT 0,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (author_id) REFERENCES USERS(user_id) ON DELETE CASCADE,
    INDEX idx_slug (slug),
    INDEX idx_status (status),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 11: CAREER_POSTINGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS CAREER_POSTINGS (
    job_id INT AUTO_INCREMENT PRIMARY KEY,
    job_title VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    job_type ENUM('full-time', 'part-time', 'contract', 'internship') NOT NULL,
    location VARCHAR(255) NOT NULL,
    salary_range_min DECIMAL(10, 2),
    salary_range_max DECIMAL(10, 2),
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    description LONGTEXT NOT NULL,
    requirements JSON,
    benefits JSON,
    application_deadline DATE NOT NULL,
    status ENUM('open', 'closed', 'filled') NOT NULL DEFAULT 'open',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_status (status),
    INDEX idx_department (department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 12: JOB_APPLICATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS JOB_APPLICATIONS (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    applicant_name VARCHAR(255) NOT NULL,
    applicant_email VARCHAR(255) NOT NULL,
    applicant_phone VARCHAR(20) NOT NULL,
    resume_url VARCHAR(500) NOT NULL,
    cover_letter TEXT,
    status ENUM('submitted', 'reviewing', 'shortlisted', 'rejected', 'hired') NOT NULL DEFAULT 'submitted',
    notes TEXT,
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (job_id) REFERENCES CAREER_POSTINGS(job_id) ON DELETE CASCADE,
    INDEX idx_job_id (job_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 13: NOTIFICATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS NOTIFICATIONS (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    notification_type ENUM('payment', 'rental', 'kyc', 'system', 'promotion', 'alert') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    related_entity_type VARCHAR(50),
    related_entity_id VARCHAR(100),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    action_url VARCHAR(500),
    priority ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'medium',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_notification_type (notification_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 14: DISPUTES
-- ============================================================================
CREATE TABLE IF NOT EXISTS DISPUTES (
    dispute_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    rental_id INT,
    trip_id INT,
    payment_id INT,
    dispute_type ENUM('damage', 'loss', 'payment-issue', 'billing-error', 'service-quality', 'other') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    evidence_urls JSON,
    amount_disputed DECIMAL(8, 2),
    status ENUM('open', 'in-review', 'resolved', 'rejected', 'escalated') NOT NULL DEFAULT 'open',
    assigned_to_admin INT,
    resolution TEXT,
    resolved_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE,
    FOREIGN KEY (rental_id) REFERENCES RENTALS(rental_id) ON DELETE SET NULL,
    FOREIGN KEY (trip_id) REFERENCES TRIPS(trip_id) ON DELETE SET NULL,
    FOREIGN KEY (payment_id) REFERENCES PAYMENTS(payment_id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to_admin) REFERENCES USERS(user_id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_rental_id (rental_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 15: VEHICLE_MAINTENANCE
-- ============================================================================
CREATE TABLE IF NOT EXISTS VEHICLE_MAINTENANCE (
    maintenance_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    maintenance_type ENUM('routine', 'battery-check', 'repair', 'inspection', 'cleaning') NOT NULL,
    description TEXT NOT NULL,
    cost DECIMAL(8, 2) NOT NULL,
    parts_replaced JSON,
    service_provider VARCHAR(255),
    start_date DATE NOT NULL,
    completion_date DATE,
    status ENUM('scheduled', 'in-progress', 'completed', 'pending') NOT NULL DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (vehicle_id) REFERENCES VEHICLES(vehicle_id) ON DELETE CASCADE,
    INDEX idx_vehicle_id (vehicle_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 16: ADMIN_LOGS (Audit Trail)
-- ============================================================================
CREATE TABLE IF NOT EXISTS ADMIN_LOGS (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    action_type ENUM('create', 'update', 'delete', 'approve', 'reject', 'block', 'unblock') NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    old_values JSON,
    new_values JSON,
    reason TEXT,
    ip_address VARCHAR(50),
    user_agent VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (admin_id) REFERENCES USERS(user_id) ON DELETE RESTRICT,
    INDEX idx_admin_id (admin_id),
    INDEX idx_action_type (action_type),
    INDEX idx_entity_type (entity_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- COMPOSITE INDEXES
-- ============================================================================
CREATE INDEX idx_rentals_user_status ON RENTALS(user_id, status);
CREATE INDEX idx_payments_user_status ON PAYMENTS(user_id, status);
CREATE INDEX idx_trips_user_vehicle ON TRIPS(user_id, vehicle_id);
CREATE INDEX idx_notifications_user_read ON NOTIFICATIONS(user_id, is_read);

-- ============================================================================
-- SAMPLE DATA INSERTS (Optional - for testing)
-- ============================================================================

-- Insert sample subscription plans
INSERT INTO SUBSCRIPTION_PLANS (plan_name, plan_type, duration_days, price, description, discount_percentage, is_popular, status)
VALUES
    ('Daily Plan', 'daily', 1, 199, 'Perfect for short rides', 0, FALSE, 'active'),
    ('Weekly Plan', 'weekly', 7, 999, 'Great for regular users', 5, TRUE, 'active'),
    ('Monthly Plan', 'monthly', 30, 3499, 'Best value for heavy users', 10, TRUE, 'active');

-- Insert sample battery stations
INSERT INTO BATTERY_STATIONS (station_name, location_latitude, location_longitude, address, city, state, pincode, station_type, available_batteries, charging_ports, swap_fee, status)
VALUES
    ('KWICK Battery Hub - Delhi Central', 28.6139, 77.2090, 'Connaught Place, New Delhi', 'New Delhi', 'Delhi', '110001', 'both', 15, 8, 50, 'active'),
    ('KWICK Battery Hub - Gurgaon', 28.4595, 77.0266, 'Sector 31, Gurgaon', 'Gurgaon', 'Haryana', '122001', 'both', 20, 10, 50, 'active'),
    ('KWICK Battery Hub - Noida', 28.5921, 77.2064, 'Sector 62, Noida', 'Noida', 'Uttar Pradesh', '201301', 'both', 18, 9, 50, 'active');

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
