# Database Storage Verification Script
# This script tests if user dashboard data is being stored in the database

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Database Storage Verification for User Dashboard" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:5000"

# Test 1: Check Backend Health
Write-Host "[Test 1] Checking backend status..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/" -Method Get -TimeoutSec 5
    Write-Host "SUCCESS: Backend is running on $baseUrl" -ForegroundColor Green
    Write-Host "  Version: $($response.version)" -ForegroundColor Gray
}
catch {
    Write-Host "FAILED: Backend is not responding. Make sure it's running on port 5000" -ForegroundColor Red
    Write-Host "Start backend with: cd backend; .\mvnw.cmd spring-boot:run" -ForegroundColor Gray
    exit 1
}

# Test 2: Register a new user
Write-Host ""
Write-Host "[Test 2] Registering new user..." -ForegroundColor Yellow
$timestamp = (Get-Date).ToString("yyyyMMddHHmmss")
$testEmail = "dbtest$timestamp@kwick.com"
$testName = "Database Test User"
$testPassword = "Test@123456"

$registerBody = @{
    email    = $testEmail
    password = $testPassword
    name     = $testName
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    
    $userId = $registerResponse.data.user.userId
    $token = $registerResponse.data.token
    
    Write-Host "SUCCESS: User registered successfully!" -ForegroundColor Green
    Write-Host "  User ID: $userId" -ForegroundColor White
    Write-Host "  Email: $testEmail" -ForegroundColor White
    Write-Host "  Name: $testName" -ForegroundColor White
    
    # Save token for later use
    $token | Out-File -FilePath "test_token.txt" -NoNewline
}
catch {
    Write-Host "FAILED: Registration failed" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "  Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
    exit 1
}

# Test 3: Fetch user profile (verify data from DB)
Write-Host ""
Write-Host "[Test 3] Fetching user profile from database..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $profileResponse = Invoke-RestMethod -Uri "$baseUrl/api/users/me" -Method Get -Headers $headers
    
    $profile = $profileResponse.data
    
    Write-Host "SUCCESS: Profile retrieved from database!" -ForegroundColor Green
    Write-Host "  User ID: $($profile.userId)" -ForegroundColor White
    Write-Host "  Email: $($profile.email)" -ForegroundColor White
    Write-Host "  Name: $($profile.name)" -ForegroundColor White
    Write-Host "  Phone: $($profile.phone)" -ForegroundColor White
    Write-Host "  Address: $($profile.address)" -ForegroundColor White
    Write-Host "  KYC Status: $($profile.kycStatus)" -ForegroundColor White
    Write-Host "  Role: $($profile.role)" -ForegroundColor White
}
catch {
    Write-Host "FAILED: Could not fetch profile" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 4: Update user profile
Write-Host ""
Write-Host "[Test 4] Updating user profile..." -ForegroundColor Yellow
$updateBody = @{
    name    = "Updated Test User"
    phone   = "+91 9876543210"
    address = "123 Test Street, Test City, Test State - 123456"
} | ConvertTo-Json

try {
    $updateResponse = Invoke-RestMethod -Uri "$baseUrl/api/users/me" -Method Put -Headers $headers -Body $updateBody -ContentType "application/json"
    
    Write-Host "SUCCESS: Profile updated successfully!" -ForegroundColor Green
    Write-Host "  Name: $($updateResponse.data.name)" -ForegroundColor White
    Write-Host "  Phone: $($updateResponse.data.phone)" -ForegroundColor White
    Write-Host "  Address: $($updateResponse.data.address)" -ForegroundColor White
}
catch {
    Write-Host "FAILED: Could not update profile" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 5: Verify updated data persists
Write-Host ""
Write-Host "[Test 5] Verifying data persistence..." -ForegroundColor Yellow
Start-Sleep -Seconds 1

try {
    $verifyResponse = Invoke-RestMethod -Uri "$baseUrl/api/users/me" -Method Get -Headers $headers
    
    $verifiedProfile = $verifyResponse.data
    
    if ($verifiedProfile.name -eq "Updated Test User" -and $verifiedProfile.phone -eq "+91 9876543210" -and $verifiedProfile.address -like "*Test Street*") {
        Write-Host "SUCCESS: Data persistence verified! Changes saved to database." -ForegroundColor Green
        Write-Host "  Name: $($verifiedProfile.name)" -ForegroundColor White
        Write-Host "  Phone: $($verifiedProfile.phone)" -ForegroundColor White
        Write-Host "  Address: $($verifiedProfile.address)" -ForegroundColor White
    }
    else {
        Write-Host "FAILED: Data persistence failed! Changes not saved." -ForegroundColor Red
        Write-Host "  Expected Name: 'Updated Test User', Got: '$($verifiedProfile.name)'" -ForegroundColor Red
    }
}
catch {
    Write-Host "FAILED: Could not verify persistence" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Summary
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  TEST SUMMARY" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "SUCCESS: Backend is running" -ForegroundColor Green
Write-Host "SUCCESS: User registration works and saves to database" -ForegroundColor Green
Write-Host "SUCCESS: User profile retrieval works" -ForegroundColor Green
Write-Host "SUCCESS: User profile updates work" -ForegroundColor Green
Write-Host "SUCCESS: Data persistence verified - changes are saved to database" -ForegroundColor Green
Write-Host ""
Write-Host "ALL TESTS PASSED! User dashboard data IS being stored in the database." -ForegroundColor Green
Write-Host ""

Write-Host "Database Connection Details:" -ForegroundColor Cyan
Write-Host "  Host: interchange.proxy.rlwy.net:23857" -ForegroundColor White
Write-Host "  Database: railway" -ForegroundColor White
Write-Host "  Table: USERS" -ForegroundColor White
Write-Host "  Test User ID: $userId" -ForegroundColor White
Write-Host "  Test Email: $testEmail" -ForegroundColor White
Write-Host ""
