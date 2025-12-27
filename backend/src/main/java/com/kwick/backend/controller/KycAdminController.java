package com.kwick.backend.controller;

import com.kwick.backend.ApiResponse;
import com.kwick.backend.exception.ResourceNotFoundException;
import com.kwick.backend.model.KycVerification;
import com.kwick.backend.repository.KycRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/kyc")
public class KycAdminController {

    private final KycRepository kycRepository;

    public KycAdminController(KycRepository kycRepository) {
        this.kycRepository = kycRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<KycVerification>> getKycStatus(@PathVariable Long id) {
        KycVerification kyc = kycRepository.findById(java.util.Objects.requireNonNull(id))
            .orElseThrow(() -> new ResourceNotFoundException("KYC record not found"));
        if (kyc == null) {
            throw new ResourceNotFoundException("KYC record not found");
        }
        return ResponseEntity.ok(new ApiResponse<>(kyc));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<KycVerification>> approveKyc(@PathVariable Long id) {
        KycVerification kyc = kycRepository.findById(java.util.Objects.requireNonNull(id))
            .orElseThrow(() -> new ResourceNotFoundException("KYC record not found"));
        if (kyc == null) {
            throw new ResourceNotFoundException("KYC record not found");
        }
        kyc.setVerificationStatus("approved");
        kycRepository.save(kyc);
        return ResponseEntity.ok(new ApiResponse<>(kyc));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<KycVerification>> rejectKyc(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        KycVerification kyc = kycRepository.findById(java.util.Objects.requireNonNull(id))
            .orElseThrow(() -> new ResourceNotFoundException("KYC record not found"));
        if (kyc == null) {
            throw new ResourceNotFoundException("KYC record not found");
        }
        kyc.setVerificationStatus("rejected");
        if (body.containsKey("reason")) {
            kyc.setRejectionReason(body.get("reason"));
        }
        kycRepository.save(kyc);
        return ResponseEntity.ok(new ApiResponse<>(kyc));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<Object>> getUserKycStatus(@PathVariable Long userId) {
        KycVerification kyc = kycRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("No KYC record found for user"));
        if (kyc == null) {
            throw new ResourceNotFoundException("No KYC record found for user");
        }

        return ResponseEntity.ok(new ApiResponse<>(Map.of(
                "kycId", kyc.getId(),
                "userId", kyc.getUserId(),
                "verificationStatus", kyc.getVerificationStatus(),
                "aadhaarFrontUrl", kyc.getAadhaarFrontUrl(),
                "aadhaarBackUrl", kyc.getAadhaarBackUrl(),
                "licenseFrontUrl", kyc.getLicenseFrontUrl(),
                "licenseBackUrl", kyc.getLicenseBackUrl(),
                "selfieUrl", kyc.getSelfieUrl())));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Object>> listPendingKyc(
            @RequestParam(defaultValue = "pending") String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        // Assuming there's a method to find by status
        Page<KycVerification> kycRecords = kycRepository.findAll(pageable);

        return ResponseEntity.ok(new ApiResponse<>(Map.of(
                "content", kycRecords.getContent(),
                "totalPages", kycRecords.getTotalPages(),
                "totalElements", kycRecords.getTotalElements())));
    }
}
