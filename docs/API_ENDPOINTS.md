# KWICK EV Rental Platform - API Endpoints & Backend Implementation Guide

## Overview
This document outlines all required backend API endpoints for the KWICK EV rental platform frontend application.

---

## Base URL
```
http://api.kwick.local/api
or
http://localhost:5000/api (for local development)
```

---

## Authentication

### Headers
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

### Token Structure
JWT token should contain:
```json
{
  "user_id": 1,
  "email": "user@example.com",
  "role": "user",
  "iat": 1234567890,
  "exp": 1234571490
}
```

---

## API Endpoints

### 1. AUTHENTICATION ENDPOINTS

#### 1.1 User Signup
```
POST /auth/signup
Content-Type: application/json

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 9876543210",
  "password": "SecurePassword123"
}

Response (201 Created):
{
  "ok": true,
  "body": {
    "user": {
      "userId": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+91 9876543210",
      "role": "user",
      "kycStatus": "incomplete"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}

Response (400 Bad Request):
{
  "ok": false,
  "error": "Email already exists"
}
```

#### 1.2 User Login
```
POST /auth/login
Content-Type: application/json

Request Body:
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
      "email": "john@example.com",
      "phone": "+91 9876543210",
      "role": "user",
      "kycStatus": "approved"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### 1.3 Admin Login
```
POST /auth/admin-login
Content-Type: application/json

Request Body:
{
  "email": "admin@kwick.in",
  "password": "admin123"
}

Response (200 OK):
{
  "ok": true,
  "body": {
    "user": {
      "userId": 1,
      "name": "Admin User",
      "email": "admin@kwick.in",
      "role": "admin",
      "kycStatus": "approved"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### 1.4 Refresh Token
```
POST /auth/refresh
Content-Type: application/json

Request Body:
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

Response (200 OK):
{
  "ok": true,
  "body": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### 1.5 Logout
```
POST /auth/logout
Authorization: Bearer {JWT_TOKEN}

Response (200 OK):
{
  "ok": true,
  "message": "Logged out successfully"
}
```

---

### 2. USER ENDPOINTS

#### 2.1 Get Current User Profile
```
GET /users/me
Authorization: Bearer {JWT_TOKEN}

Response (200 OK):
{
  "ok": true,
  "body": {
    "userId": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 9876543210",
    "role": "user",
    "status": "active",
    "tier": "gold",
    "kycStatus": "approved",
    "profilePhotoUrl": "https://...",
    "totalSpent": 5000,
    "totalRides": 25,
    "totalEarnings": 0,
    "averageRating": 4.8,
    "createdAt": "2024-01-15T10:30:00Z",
    "lastLogin": "2024-01-20T14:22:00Z"
  }
}
```

#### 2.2 Update User Profile
```
PUT /users/me
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

Request Body:
{
  "name": "Jane Doe",
  "phone": "+91 9876543211"
}

Response (200 OK):
{
  "ok": true,
  "body": {
    "userId": 1,
    "name": "Jane Doe",
    "phone": "+91 9876543211",
    ...
  }
}
```

#### 2.3 Upload Profile Photo
```
POST /users/me/photo
Authorization: Bearer {JWT_TOKEN}
Content-Type: multipart/form-data

Request Body:
{
  "file": <image file>
}

Response (200 OK):
{
  "ok": true,
  "body": {
    "url": "https://kwick-cdn.s3.amazonaws.com/profiles/user_1.jpg"
  }
}
```

#### 2.4 Get All Users (Admin Only)
```
GET /users?page=1&limit=10&status=active&search=john
Authorization: Bearer {JWT_TOKEN}

Response (200 OK):
{
  "ok": true,
  "body": {
    "users": [
      {
        "userId": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "status": "active",
        "kycStatus": "approved",
        "tier": "gold",
        "totalSpent": 5000,
        "totalRides": 25,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 150,
      "totalPages": 15
    }
  }
}
```

#### 2.5 Get User by ID (Admin Only)
```
GET /users/{userId}
Authorization: Bearer {JWT_TOKEN}

Response (200 OK):
{
  "ok": true,
  "body": {
    "userId": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 9876543210",
    "status": "active",
    "kycStatus": "approved",
    "tier": "gold",
    "totalSpent": 5000,
    "totalRides": 25,
    "averageRating": 4.8,
    "vehicle": {
      "vehicleId": 5,
      "registrationNumber": "UP16 EV 1234",
      "model": "KWICK Elite",
      "batteryLevel": 85,
      "status": "active"
    },
    "payments": [
      {
        "paymentId": 1,
        "amount": 1000,
        "date": "2024-01-15",
        "status": "completed"
      }
    ]
  }
}
```

---

### 3. KYC ENDPOINTS

#### 3.1 Submit KYC
```
POST /kyc/submit
Authorization: Bearer {JWT_TOKEN}
Content-Type: multipart/form-data

Request Body:
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+91 9876543210",
  "address": "123 Main Street",
  "city": "Delhi",
  "state": "Delhi",
  "pincode": "110001",
  "aadhaarNumber": "123456789012",
  "licenseNumber": "DL0120190001234",
  "aadhaarFront": <file>,
  "aadhaarBack": <file>,
  "licenseFront": <file>,
  "licenseBack": <file>,
  "selfie": <file>
}

Response (201 Created):
{
  "ok": true,
  "body": {
    "kycId": 1,
    "userId": 1,
    "verificationStatus": "pending",
    "submittedAt": "2024-01-15T10:30:00Z",
    "message": "KYC submitted successfully. Verification typically takes 2-4 hours."
  }
}
```

#### 3.2 Get KYC Status
```
GET /kyc/status
Authorization: Bearer {JWT_TOKEN}

Response (200 OK):
{
  "ok": true,
  "body": {
    "kycId": 1,
    "userId": 1,
    "verificationStatus": "approved",
    "submittedAt": "2024-01-15T10:30:00Z",
    "approvedAt": "2024-01-15T12:45:00Z",
    "approvedByAdmin": "admin@kwick.in"
  }
}
```

#### 3.3 Get All KYC Submissions (Admin Only)
```
GET /kyc?page=1&limit=10&status=pending
Authorization: Bearer {JWT_TOKEN}

Response (200 OK):
{
  "ok": true,
  "body": {
    "kycs": [
      {
        "kycId": 1,
        "userId": 1,
        "userName": "John Doe",
        "email": "john@example.com",
        "verificationStatus": "pending",
        "submittedAt": "2024-01-15T10:30:00Z",
        "documents": {
          "aadhaarFront": "https://...",
          "aadhaarBack": "https://...",
          "licenseFront": "https://...",
          "licenseBack": "https://...",
          "selfie": "https://..."
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

#### 3.4 Approve KYC (Admin Only)
```
POST /kyc/{kycId}/approve
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

Request Body:
{
  "approvalNotes": "All documents verified successfully"
}

Response (200 OK):
{
  "ok": true,
  "body": {
    "kycId": 1,
    "verificationStatus": "approved",
    "approvedAt": "2024-01-15T12:45:00Z",
    "message": "KYC approved. User can now rent vehicles."
  }
}
```

#### 3.5 Reject KYC (Admin Only)
```
POST /kyc/{kycId}/reject
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

Request Body:
{
  "rejectionReason": "Aadhaar image is blurry. Please resubmit."
}

Response (200 OK):
{
  "ok": true,
  "body": {
    "kycId": 1,
    "verificationStatus": "rejected",
    "rejectionReason": "Aadhaar image is blurry. Please resubmit.",
    "message": "KYC rejected. User can resubmit."
  }
}
```

---

### 4. VEHICLE ENDPOINTS

#### 4.1 Get All Vehicles
```
GET /vehicles?status=active&type=scooter&city=Delhi
Authorization: Bearer {JWT_TOKEN}

Response (200 OK):
{
  "ok": true,
  "body": {
    "vehicles": [
      {
        "vehicleId": 1,
        "name": "KWICK Elite",
        "model": "SE-2024",
        "registrationNumber": "UP16 EV 1234",
        "vehicleType": "scooter",
        "status": "active",
        "batteryLevel": 85,
        "location": {
          "latitude": 28.6139,
          "longitude": 77.2090
        },
        "lastLocationUpdate": "2024-01-20T14:20:00Z",
        "totalDistance": 2847,
        "totalTrips": 120,
        "rating": 4.8,
        "costPerDay": 199,
        "costPerWeek": 999
      }
    ],
    "pagination": {
      "total": 250,
      "page": 1,
      "limit": 10
    }
  }
}
```

#### 4.2 Get Vehicle Details
```
GET /vehicles/{vehicleId}
Authorization: Bearer {JWT_TOKEN}

Response (200 OK):
{
  "ok": true,
  "body": {
    "vehicleId": 1,
    "name": "KWICK Elite",
    "model": "SE-2024",
    "registrationNumber": "UP16 EV 1234",
    "vehicleType": "scooter",
    "status": "active",
    "batteryLevel": 85,
    "batteryCapacity": 2.5,
    "location": {
      "latitude": 28.6139,
      "longitude": 77.2090,
      "address": "Connaught Place, New Delhi"
    },
    "totalDistance": 2847,
    "totalTrips": 120,
    "rating": 4.8,
    "specifications": {
      "maxSpeed": 65,
      "rangePerCharge": 65,
      "chargingTime": 4
    },
    "pricing": {
      "daily": 199,
      "weekly": 999,
      "monthly": 3499
    },
    "lastMaintenance": "2024-01-10T10:00:00Z",
    "nextMaintenance": "2024-02-10T10:00:00Z"
  }
}
```

#### 4.3 Get User's Vehicles (Fleet)
```
GET /user/vehicles
Authorization: Bearer {JWT_TOKEN}

Response (200 OK):
{
  "ok": true,
  "body": [
    {
      "vehicleId": 5,
      "registrationNumber": "UP16 EV 1234",
      "name": "KWICK Elite",
      "model": "SE-2024",
      "status": "active",
      "batteryLevel": 85,
      "totalDistance": 2847,
      "totalDeliveries": 120,
      "monthlyEarnings": 18500,
      "rentStartDate": "2024-01-01",
      "rentEndDate": "2024-02-01",
      "lastLocation": "Sector 31, Gurgaon"
    }
  ]
}
```

#### 4.4 Create Vehicle (Admin Only)
```
POST /vehicles
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

Request Body:
{
  "name": "KWICK Pro",
  "model": "SP-2024",
  "registrationNumber": "UP16 EV 5678",
  "vehicleType": "scooter",
  "batteryCapacity": 3.0,
  "costPrice": 75000
}

Response (201 Created):
{
  "ok": true,
  "body": {
    "vehicleId": 10,
    "name": "KWICK Pro",
    "registrationNumber": "UP16 EV 5678",
    "status": "active"
  }
}
```

#### 4.5 Update Vehicle (Admin Only)
```
PUT /vehicles/{vehicleId}
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

Request Body:
{
  "status": "maintenance",
  "batteryLevel": 45
}

Response (200 OK):
{
  "ok": true,
  "body": {
    "vehicleId": 1,
    "status": "maintenance",
    "batteryLevel": 45
  }
}
```

---

### 5. RENTAL ENDPOINTS

#### 5.1 Get Rental Plans
```
GET /rentals/plans
Response (200 OK):
{
  "ok": true,
  "body": [
    {
      "planId": 1,
      "planName": "Daily Plan",
      "duration": "1 day",
      "price": 199,
      "features": ["GPS Tracking", "Insurance", "24/7 Support"],
      "maxKmLimit": null,
      "popular": false
    },
    {
      "planId": 2,
      "planName": "Weekly Plan",
      "duration": "7 days",
      "price": 999,
      "features": ["GPS Tracking", "Insurance", "24/7 Support", "Free Battery Swap"],
      "maxKmLimit": null,
      "discount": 5,
      "popular": true
    },
    {
      "planId": 3,
      "planName": "Monthly Plan",
      "duration": "30 days",
      "price": 3499,
      "features": ["GPS Tracking", "Insurance", "24/7 Support", "Free Battery Swap", "Free Maintenance"],
      "maxKmLimit": null,
      "discount": 10,
      "popular": true
    }
  ]
}
```

#### 5.2 Create Rental
```
POST /rentals
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

Request Body:
{
  "vehicleId": 1,
  "planId": 2,
  "startDate": "2024-01-20",
  "endDate": "2024-01-27",
  "rentalType": "weekly"
}

Response (201 Created):
{
  "ok": true,
  "body": {
    "rentalId": 1,
    "vehicleId": 1,
    "startDate": "2024-01-20",
    "endDate": "2024-01-27",
    "status": "active",
    "rentalCost": 999,
    "securityDeposit": 2000,
    "totalAmountDue": 2999,
    "paymentStatus": "pending"
  }
}
```

#### 5.3 Get User's Active Rentals
```
GET /rentals/active
Authorization: Bearer {JWT_TOKEN}

Response (200 OK):
{
  "ok": true,
  "body": [
    {
      "rentalId": 1,
      "vehicleId": 1,
      "vehicleName": "KWICK Elite",
      "registrationNumber": "UP16 EV 1234",
      "startDate": "2024-01-20",
      "endDate": "2024-01-27",
      "status": "active",
      "odometerStart": 15000,
      "odometerCurrent": 15847,
      "batteryLevel": 85,
      "costRemaining": 200
    }
  ]
}
```

#### 5.4 Get All Rentals (Admin Only)
```
GET /rentals?page=1&limit=10&status=active
Authorization: Bearer {JWT_TOKEN}

Response (200 OK):
{
  "ok": true,
  "body": {
    "rentals": [
      {
        "rentalId": 1,
        "userId": 1,
        "userName": "John Doe",
        "vehicleId": 1,
        "registrationNumber": "UP16 EV 1234",
        "startDate": "2024-01-20",
        "endDate": "2024-01-27",
        "status": "active",
        "rentalCost": 999,
        "paymentStatus": "completed"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 240,
      "totalPages": 24
    }
  }
}
```

#### 5.5 Complete Rental
```
POST /rentals/{rentalId}/complete
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

Request Body:
{
  "odometerEnd": 15847,
  "fuelCharges": 100,
  "damageCharges": 0
}

Response (200 OK):
{
  "ok": true,
  "body": {
    "rentalId": 1,
    "status": "completed",
    "totalDistance": 847,
    "totalAmountDue": 1099,
    "paymentStatus": "pending"
  }
}
```

#### 5.6 Cancel Rental
```
POST /rentals/{rentalId}/cancel
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

Request Body:
{
  "reason": "Plans changed"
}

Response (200 OK):
{
  "ok": true,
  "body": {
    "rentalId": 1,
    "status": "cancelled",
    "refundAmount": 500,
    "message": "Rental cancelled. Refund will be processed within 3-5 days."
  }
}
```

---

### 6. PAYMENT ENDPOINTS

#### 6.1 Get Payment Methods
```
GET /payments/methods
Authorization: Bearer {JWT_TOKEN}

Response (200 OK):
{
  "ok": true,
  "body": [
    {
      "methodId": "upi",
      "name": "UPI",
      "icon": "📱",
      "enabled": true
    },
    {
      "methodId": "credit_card",
      "name": "Credit Card",
      "icon": "💳",
      "enabled": true
    },
    {
      "methodId": "bank_transfer",
      "name": "Bank Transfer",
      "icon": "🏦",
      "enabled": true
    }
  ]
}
```

#### 6.2 Create Payment
```
POST /payments
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

Request Body:
{
  "rentalId": 1,
  "amount": 2999,
  "paymentMethod": "upi",
  "utrNumber": "UTR123456789"
}

Response (201 Created):
{
  "ok": true,
  "body": {
    "paymentId": 1,
    "status": "pending",
    "amount": 2999,
    "paymentMethod": "upi",
    "utrNumber": "UTR123456789",
    "createdAt": "2024-01-20T14:30:00Z"
  }
}
```

#### 6.3 Verify Payment
```
POST /payments/{paymentId}/verify
Authorization: Bearer {JWT_TOKEN}
Content-Type: multipart/form-data

Request Body:
{
  "proof": <image file>
}

Response (200 OK):
{
  "ok": true,
  "body": {
    "paymentId": 1,
    "status": "completed",
    "verifiedAt": "2024-01-20T14:35:00Z",
    "message": "Payment verified successfully!"
  }
}
```

#### 6.4 Get User Payments
```
GET /payments?page=1&limit=10
Authorization: Bearer {JWT_TOKEN}

Response (200 OK):
{
  "ok": true,
  "body": {
    "payments": [
      {
        "paymentId": 1,
        "amount": 2999,
        "date": "2024-01-20",
        "method": "upi",
        "status": "completed",
        "rentalId": 1
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 15,
      "totalPages": 2
    }
  }
}
```

#### 6.5 Get All Payments (Admin Only)
```
GET /payments?page=1&limit=10&status=pending&search=raj
Authorization: Bearer {JWT_TOKEN}

Response (200 OK):
{
  "ok": true,
  "body": {
    "payments": [
      {
        "paymentId": 1,
        "userId": 1,
        "userName": "John Doe",
        "amount": 2999,
        "date": "2024-01-20",
        "method": "upi",
        "utr": "UTR123456789",
        "proof": "https://...",
        "status": "pending",
        "rentalId": 1
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "totalPages": 5
    }
  }
}
```

#### 6.6 Approve Payment (Admin Only)
```
POST /payments/{paymentId}/approve
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

Response (200 OK):
{
  "ok": true,
  "body": {
    "paymentId": 1,
    "status": "completed",
    "approvedAt": "2024-01-20T14:40:00Z"
  }
}
```

---

### 7. TRIPS ENDPOINT

#### 7.1 Get User Trips
```
GET /trips?page=1&limit=10
Authorization: Bearer {JWT_TOKEN}

Response (200 OK):
{
  "ok": true,
  "body": {
    "trips": [
      {
        "tripId": 1,
        "rentalId": 1,
        "vehicleId": 1,
        "startTime": "2024-01-20T08:00:00Z",
        "endTime": "2024-01-20T08:45:00Z",
        "distanceKm": 12.5,
        "batteryUsed": 15,
        "earnings": 125,
        "status": "completed"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 120,
      "totalPages": 12
    }
  }
}
```

---

### 8. BATTERY STATIONS ENDPOINTS

#### 8.1 Get All Battery Stations
```
GET /battery-stations?latitude=28.6139&longitude=77.2090&radius=5
Authorization: Bearer {JWT_TOKEN}

Response (200 OK):
{
  "ok": true,
  "body": [
    {
      "stationId": 1,
      "name": "KWICK Battery Hub - Delhi Central",
      "location": {
        "latitude": 28.6139,
        "longitude": 77.2090,
        "address": "Connaught Place, New Delhi"
      },
      "stationType": "both",
      "availableBatteries": 15,
      "chargingPorts": 8,
      "operatingHours": {
        "start": "06:00",
        "end": "23:00"
      },
      "swapFee": 50,
      "chargingFeePerHour": 20,
      "rating": 4.6,
      "distance": 0.5
    }
  ]
}
```

---

### 9. BLOG ENDPOINTS

#### 9.1 Get All Blog Posts
```
GET /blog?page=1&limit=10&category=Earnings&search=earn
Authorization: Bearer {JWT_TOKEN}

Response (200 OK):
{
  "ok": true,
  "body": {
    "blogs": [
      {
        "blogId": 1,
        "title": "How to Earn ₹50,000 Monthly with KWICK EV",
        "slug": "how-to-earn-50000-monthly",
        "excerpt": "Learn the strategies our top riders use to maximize their earnings...",
        "author": "KWICK Team",
        "category": "Earnings Guide",
        "date": "2024-01-15",
        "readTime": "5 min read",
        "image": "https://...",
        "featured": true,
        "views": 1250
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "totalPages": 5
    }
  }
}
```

#### 9.2 Get Blog Post Detail
```
GET /blog/{blogId}
Authorization: Bearer {JWT_TOKEN}

Response (200 OK):
{
  "ok": true,
  "body": {
    "blogId": 1,
    "title": "How to Earn ₹50,000 Monthly with KWICK EV",
    "slug": "how-to-earn-50000-monthly",
    "excerpt": "Learn the strategies our top riders use...",
    "content": "<h2>Introduction</h2><p>...</p>",
    "author": "KWICK Team",
    "category": "Earnings Guide",
    "tags": ["earnings", "tips", "guide"],
    "date": "2024-01-15",
    "readTime": "5 min read",
    "image": "https://...",
    "featured": true,
    "views": 1250
  }
}
```

#### 9.3 Create Blog Post (Admin Only)
```
POST /blog
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

Request Body:
{
  "title": "New Blog Post",
  "excerpt": "Short excerpt...",
  "content": "<h2>Content</h2>...",
  "category": "Tips & Tricks",
  "tags": ["tag1", "tag2"],
  "status": "published",
  "featured": false
}

Response (201 Created):
{
  "ok": true,
  "body": {
    "blogId": 50,
    "title": "New Blog Post",
    "slug": "new-blog-post",
    "status": "published"
  }
}
```

---

### 10. CAREER/JOBS ENDPOINTS

#### 10.1 Get Job Listings
```
GET /careers/jobs?location=Delhi&jobType=full-time
Authorization: Bearer {JWT_TOKEN}

Response (200 OK):
{
  "ok": true,
  "body": [
    {
      "jobId": 1,
      "jobTitle": "Senior Full Stack Developer",
      "department": "Engineering",
      "location": "Delhi",
      "jobType": "full-time",
      "salaryRange": {
        "min": 800000,
        "max": 1200000
      },
      "summary": "We are looking for an experienced full stack developer...",
      "deadline": "2024-02-01",
      "status": "open",
      "applicants": 24
    }
  ]
}
```

#### 10.2 Get Job Details
```
GET /careers/jobs/{jobId}

Response (200 OK):
{
  "ok": true,
  "body": {
    "jobId": 1,
    "jobTitle": "Senior Full Stack Developer",
    "department": "Engineering",
    "location": "Delhi",
    "jobType": "full-time",
    "salaryRange": {
      "min": 800000,
      "max": 1200000
    },
    "description": "Full job description HTML...",
    "requirements": ["5+ years experience", "React.js", "Node.js"],
    "benefits": ["Health Insurance", "Remote Work", "Stock Options"],
    "deadline": "2024-02-01",
    "status": "open"
  }
}
```

#### 10.3 Submit Job Application
```
POST /careers/apply
Authorization: Bearer {JWT_TOKEN}
Content-Type: multipart/form-data

Request Body:
{
  "jobId": 1,
  "resume": <pdf file>,
  "coverLetter": "I am interested in this position..."
}

Response (201 Created):
{
  "ok": true,
  "body": {
    "applicationId": 1,
    "jobId": 1,
    "status": "submitted",
    "appliedAt": "2024-01-20T14:50:00Z",
    "message": "Application submitted successfully! We will review and get back to you soon."
  }
}
```

---

### 11. NOTIFICATIONS ENDPOINTS

#### 11.1 Get User Notifications
```
GET /notifications?page=1&limit=10&isRead=false
Authorization: Bearer {JWT_TOKEN}

Response (200 OK):
{
  "ok": true,
  "body": {
    "notifications": [
      {
        "notificationId": 1,
        "type": "payment",
        "title": "Payment Pending",
        "message": "Your payment for rental #1 is pending verification.",
        "isRead": false,
        "actionUrl": "/payments/1",
        "createdAt": "2024-01-20T14:30:00Z"
      }
    ],
    "unreadCount": 5
  }
}
```

#### 11.2 Mark Notification as Read
```
PUT /notifications/{notificationId}/read
Authorization: Bearer {JWT_TOKEN}

Response (200 OK):
{
  "ok": true,
  "body": {
    "notificationId": 1,
    "isRead": true
  }
}
```

---

## Error Responses

### Standard Error Response Format
```json
{
  "ok": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| INVALID_REQUEST | 400 | Invalid request parameters |
| UNAUTHORIZED | 401 | Authentication failed or token expired |
| FORBIDDEN | 403 | User doesn't have permission |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource already exists or conflict |
| VALIDATION_ERROR | 400 | Validation failed |
| PAYMENT_FAILED | 400 | Payment processing failed |
| SERVER_ERROR | 500 | Internal server error |

---

## Rate Limiting

- **Limit:** 100 requests per minute per user
- **Headers:**
  - `X-RateLimit-Limit: 100`
  - `X-RateLimit-Remaining: 85`
  - `X-RateLimit-Reset: 1234567890`

---

## Implementation Stack Recommendation

### Backend Framework
- **Node.js** + Express.js
- **Python** + FastAPI/Django
- **Go** + Gin

### Database
- MySQL 8.0+ or PostgreSQL 13+

### Authentication
- JWT tokens
- Refresh token rotation

### File Storage
- AWS S3 or equivalent cloud storage

### Payment Gateway
- Razorpay (for India)

### Email Service
- SendGrid or AWS SES

### SMS Service
- Twilio or AWS SNS

---

**API Version:** 1.0  
**Last Updated:** November 2025  
**Status:** In Development
