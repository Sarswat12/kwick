
package com.kwick.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "kyc_verification")
public class KycVerification {
    // Aadhaar Front metadata
    @Column(name = "aadhaar_front_filename")
    private String aadhaarFrontFilename;
    @Column(name = "aadhaar_front_type")
    private String aadhaarFrontType;
    @Column(name = "aadhaar_front_size")
    private Long aadhaarFrontSize;

    // Aadhaar Back metadata
    @Column(name = "aadhaar_back_filename")
    private String aadhaarBackFilename;
    @Column(name = "aadhaar_back_type")
    private String aadhaarBackType;
    @Column(name = "aadhaar_back_size")
    private Long aadhaarBackSize;

    // License Front metadata
    @Column(name = "license_front_filename")
    private String licenseFrontFilename;
    @Column(name = "license_front_type")
    private String licenseFrontType;
    @Column(name = "license_front_size")
    private Long licenseFrontSize;

    // License Back metadata
    @Column(name = "license_back_filename")
    private String licenseBackFilename;
    @Column(name = "license_back_type")
    private String licenseBackType;
    @Column(name = "license_back_size")
    private Long licenseBackSize;

    // Selfie metadata
    @Column(name = "selfie_filename")
    private String selfieFilename;
    @Column(name = "selfie_type")
    private String selfieType;
    @Column(name = "selfie_size")
    private Long selfieSize;

    // Aadhaar Front
    public String getAadhaarFrontFilename() { return aadhaarFrontFilename; }
    public void setAadhaarFrontFilename(String f) { this.aadhaarFrontFilename = f; }
    public String getAadhaarFrontType() { return aadhaarFrontType; }
    public void setAadhaarFrontType(String t) { this.aadhaarFrontType = t; }
    public Long getAadhaarFrontSize() { return aadhaarFrontSize; }
    public void setAadhaarFrontSize(Long s) { this.aadhaarFrontSize = s; }

    // Aadhaar Back
    public String getAadhaarBackFilename() { return aadhaarBackFilename; }
    public void setAadhaarBackFilename(String f) { this.aadhaarBackFilename = f; }
    public String getAadhaarBackType() { return aadhaarBackType; }
    public void setAadhaarBackType(String t) { this.aadhaarBackType = t; }
    public Long getAadhaarBackSize() { return aadhaarBackSize; }
    public void setAadhaarBackSize(Long s) { this.aadhaarBackSize = s; }

    // License Front
    public String getLicenseFrontFilename() { return licenseFrontFilename; }
    public void setLicenseFrontFilename(String f) { this.licenseFrontFilename = f; }
    public String getLicenseFrontType() { return licenseFrontType; }
    public void setLicenseFrontType(String t) { this.licenseFrontType = t; }
    public Long getLicenseFrontSize() { return licenseFrontSize; }
    public void setLicenseFrontSize(Long s) { this.licenseFrontSize = s; }

    // License Back
    public String getLicenseBackFilename() { return licenseBackFilename; }
    public void setLicenseBackFilename(String f) { this.licenseBackFilename = f; }
    public String getLicenseBackType() { return licenseBackType; }
    public void setLicenseBackType(String t) { this.licenseBackType = t; }
    public Long getLicenseBackSize() { return licenseBackSize; }
    public void setLicenseBackSize(Long s) { this.licenseBackSize = s; }

    // Selfie
    public String getSelfieFilename() { return selfieFilename; }
    public void setSelfieFilename(String f) { this.selfieFilename = f; }
    public String getSelfieType() { return selfieType; }
    public void setSelfieType(String t) { this.selfieType = t; }
    public Long getSelfieSize() { return selfieSize; }
    public void setSelfieSize(Long s) { this.selfieSize = s; }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "kyc_id")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "aadhaar_number")
    private String aadhaarNumber;

    @Column(name = "driving_license_number")
    private String drivingLicenseNumber;

    @Column(name = "license_expiry_date")
    private LocalDate licenseExpiryDate;

    @Column(name = "street_address")
    private String streetAddress;

    @Column(name = "city")
    private String city;

    @Column(name = "state")
    private String state;

    @Column(name = "pincode")
    private String pincode;

    @Column(name = "aadhaar_front_url")
    private String aadhaarFrontUrl;

    @Column(name = "aadhaar_back_url")
    private String aadhaarBackUrl;

    @Column(name = "license_front_url")
    private String licenseFrontUrl;

    @Column(name = "license_back_url")
    private String licenseBackUrl;

    @Column(name = "selfie_url")
    private String selfieUrl;

    @Column(name = "kyc_pdf_url")
    private String kycPdfUrl;

    // Backwards-compatible generic document fields (legacy)
    @Column(name = "document_type")
    private String documentType;

    @Column(name = "document_url")
    private String documentUrl;

    @Column(name = "verification_status")
    private String verificationStatus = "pending";

    @Column(name = "rejection_reason")
    private String rejectionReason;

    @Column(name = "verified_by_admin")
    private Long verifiedByAdmin;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getAadhaarNumber() {
        return aadhaarNumber;
    }

    public void setAadhaarNumber(String aadhaarNumber) {
        this.aadhaarNumber = aadhaarNumber;
    }

    public String getDrivingLicenseNumber() {
        return drivingLicenseNumber;
    }

    public void setDrivingLicenseNumber(String drivingLicenseNumber) {
        this.drivingLicenseNumber = drivingLicenseNumber;
    }

    public LocalDate getLicenseExpiryDate() {
        return licenseExpiryDate;
    }

    public void setLicenseExpiryDate(LocalDate licenseExpiryDate) {
        this.licenseExpiryDate = licenseExpiryDate;
    }

    public String getStreetAddress() {
        return streetAddress;
    }

    public void setStreetAddress(String streetAddress) {
        this.streetAddress = streetAddress;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public String getAadhaarFrontUrl() {
        return aadhaarFrontUrl;
    }

    public void setAadhaarFrontUrl(String aadhaarFrontUrl) {
        this.aadhaarFrontUrl = aadhaarFrontUrl;
    }

    public String getAadhaarBackUrl() {
        return aadhaarBackUrl;
    }

    public void setAadhaarBackUrl(String aadhaarBackUrl) {
        this.aadhaarBackUrl = aadhaarBackUrl;
    }

    public String getLicenseFrontUrl() {
        return licenseFrontUrl;
    }

    public void setLicenseFrontUrl(String licenseFrontUrl) {
        this.licenseFrontUrl = licenseFrontUrl;
    }

    public String getLicenseBackUrl() {
        return licenseBackUrl;
    }

    public void setLicenseBackUrl(String licenseBackUrl) {
        this.licenseBackUrl = licenseBackUrl;
    }

    public String getSelfieUrl() {
        return selfieUrl;
    }

    public void setSelfieUrl(String selfieUrl) {
        this.selfieUrl = selfieUrl;
    }

    public String getKycPdfUrl() {
        return kycPdfUrl;
    }

    public void setKycPdfUrl(String kycPdfUrl) {
        this.kycPdfUrl = kycPdfUrl;
    }

    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public String getDocumentUrl() {
        return documentUrl;
    }

    public void setDocumentUrl(String documentUrl) {
        this.documentUrl = documentUrl;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(String verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public Long getVerifiedByAdmin() {
        return verifiedByAdmin;
    }

    public void setVerifiedByAdmin(Long verifiedByAdmin) {
        this.verifiedByAdmin = verifiedByAdmin;
    }

    public LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(LocalDateTime verifiedAt) {
        this.verifiedAt = verifiedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
