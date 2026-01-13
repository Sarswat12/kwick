package com.kwick.backend.controller;

import com.kwick.backend.ApiResponse;
import com.kwick.backend.model.KycVerification;
import com.kwick.backend.model.User;
import com.kwick.backend.repository.KycRepository;
import com.kwick.backend.repository.UserRepository;
import com.kwick.backend.service.EmailService;
import com.kwick.backend.service.NotificationsPublisher;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/admin/kyc")
@PreAuthorize("hasRole('ADMIN')")
public class AdminKycController {

    private static final Logger logger = LoggerFactory.getLogger(AdminKycController.class);

    private final KycRepository kycRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final NotificationsPublisher notificationsPublisher;

    public AdminKycController(KycRepository kycRepository, UserRepository userRepository, EmailService emailService, NotificationsPublisher notificationsPublisher) {
        this.kycRepository = kycRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.notificationsPublisher = notificationsPublisher;
    }

    /**
     * Get all KYC submissions (with optional filtering by status)
     */
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllKycSubmissions(
            @RequestParam(required = false, defaultValue = "pending") String status,
            @RequestParam(required = false, defaultValue = "") String q,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "20") int size,
            HttpServletRequest request) {
        try {
            // Verify admin access
            if (!isAdminUser(request)) {
                return ResponseEntity.status(403).body(new ApiResponse<>("Forbidden: Admin access required"));
            }

            // Fetch all, filter, then paginate (sorted by createdAt desc if available)
            List<KycVerification> kycSubmissions = kycRepository.findAll();
            List<KycVerification> filtered = kycSubmissions.stream()
                    .filter(k -> "all".equalsIgnoreCase(status) || status.equalsIgnoreCase(k.getVerificationStatus()))
                    .filter(k -> {
                        if (q == null || q.isBlank()) return true;
                        String qq = q.toLowerCase();
                        Long userId = k.getUserId();
                        Optional<User> u = userId != null ? userRepository.findById(userId) : Optional.empty();
                        return (u.map(User::getName).orElse("").toLowerCase().contains(qq))
                                || (u.map(User::getEmail).orElse("").toLowerCase().contains(qq))
                                || (k.getCity() != null && k.getCity().toLowerCase().contains(qq))
                                || (k.getState() != null && k.getState().toLowerCase().contains(qq));
                    })
                    .sorted((a,b) -> {
                        java.time.LocalDateTime ac = a.getCreatedAt();
                        java.time.LocalDateTime bc = b.getCreatedAt();
                        if (ac == null && bc == null) return 0;
                        if (ac == null) return 1;
                        if (bc == null) return -1;
                        return bc.compareTo(ac);
                    })
                    .toList();

            // Map to DTO with user info (use mutable map to allow null values)
            int total = filtered.size();
            int p = Math.max(page, 0);
            int s = Math.max(size, 1);
            int from = Math.min(p * s, total);
            int to = Math.min(from + s, total);
            List<KycVerification> pageItems = filtered.subList(from, to);

            List<Map<String, Object>> result = pageItems.stream().map(kyc -> {
                Long userId = kyc.getUserId();
                Optional<User> user = userId != null ? userRepository.findById(userId) : Optional.empty();
                java.util.Map<String, Object> dto = new java.util.HashMap<>();
                dto.put("kycId", kyc.getId());
                dto.put("userId", userId);
                dto.put("userName", user.map(User::getName).orElse("Unknown"));
                dto.put("userEmail", user.map(User::getEmail).orElse("N/A"));
                dto.put("aadhaarLast4", maskNumber(kyc.getAadhaarNumber()));
                dto.put("city", kyc.getCity());
                dto.put("state", kyc.getState());
                dto.put("verificationStatus", kyc.getVerificationStatus());
                dto.put("rejectionReason", kyc.getRejectionReason());
                dto.put("createdAt", kyc.getCreatedAt());
                dto.put("verifiedAt", kyc.getVerifiedAt());
                dto.put("verifiedByAdmin", kyc.getVerifiedByAdmin());
                return dto;
            }).collect(Collectors.toList());

            logger.info("Retrieved {} KYC submissions with status: {} (total: {})", result.size(), status, total);
            return ResponseEntity.ok(new ApiResponse<>(Map.of(
                "items", result,
                "total", total,
                "page", p,
                "size", s
            )));
        } catch (Exception e) {
            logger.error("Error retrieving KYC submissions", e);
            return ResponseEntity.status(500).body(new ApiResponse<>("Error: " + e.getMessage()));
        }
    }

    /**
     * Get details of a specific KYC submission
     */
    @GetMapping("/{kycId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getKycDetails(
            @PathVariable(required = true) Long kycId,
            HttpServletRequest request) {
        try {
            if (!isAdminUser(request)) {
                return ResponseEntity.status(403).body(new ApiResponse<>("Forbidden: Admin access required"));
            }

            Optional<KycVerification> kycOpt = kycRepository.findById(java.util.Objects.requireNonNull(kycId));
            if (kycOpt.isEmpty()) {
                return ResponseEntity.status(404).body(new ApiResponse<>("KYC submission not found"));
            }

            KycVerification kyc = kycOpt.get();
            Optional<User> user = userRepository.findById(java.util.Objects.requireNonNull(kyc.getUserId()));

            Map<String, Object> details = new java.util.HashMap<>();
            details.put("kycId", kyc.getId());
            details.put("userId", kyc.getUserId());
            details.put("userName", user.map(User::getName).orElse("Unknown"));
            details.put("userEmail", user.map(User::getEmail).orElse("N/A"));
            details.put("userPhone", user.map(User::getPhone).orElse("N/A"));
            details.put("aadhaarNumber", maskNumber(kyc.getAadhaarNumber()));
            details.put("drivingLicenseNumber", maskNumber(kyc.getDrivingLicenseNumber()));
            details.put("licenseExpiryDate", kyc.getLicenseExpiryDate());
            details.put("streetAddress", kyc.getStreetAddress());
            details.put("city", kyc.getCity());
            details.put("state", kyc.getState());
            details.put("pincode", kyc.getPincode());
            details.put("verificationStatus", kyc.getVerificationStatus());
            details.put("rejectionReason", kyc.getRejectionReason());
            details.put("createdAt", kyc.getCreatedAt());
            details.put("verifiedAt", kyc.getVerifiedAt());
            details.put("verifiedByAdmin", kyc.getVerifiedByAdmin());
            details.put("kycPdfUrl", kyc.getKycPdfUrl());

            logger.info("Retrieved KYC details for kycId: {}, userId: {}", kycId, kyc.getUserId());
            return ResponseEntity.ok(new ApiResponse<>(details));
        } catch (Exception e) {
            logger.error("Error retrieving KYC details for kycId: {}", kycId, e);
            return ResponseEntity.status(500).body(new ApiResponse<>("Error: " + e.getMessage()));
        }
    }

    /**
     * Approve KYC submission
     */
    @PostMapping("/{kycId}/approve")
    public ResponseEntity<ApiResponse<Map<String, Object>>> approveKyc(
            @PathVariable(required = true) Long kycId,
            HttpServletRequest request) {
        try {
            Long adminId = getAdminId(request);
            if (adminId == null) {
                return ResponseEntity.status(403).body(new ApiResponse<>("Forbidden: Admin access required"));
            }

            Optional<KycVerification> kycOpt = kycRepository.findById(java.util.Objects.requireNonNull(kycId));
            if (kycOpt.isEmpty()) {
                return ResponseEntity.status(404).body(new ApiResponse<>("KYC submission not found"));
            }

            KycVerification kyc = kycOpt.get();
            Optional<User> user = userRepository.findById(java.util.Objects.requireNonNull(kyc.getUserId()));

            if (user.isEmpty()) {
                return ResponseEntity.status(404).body(new ApiResponse<>("User not found"));
            }

            // Update KYC status
            kyc.setVerificationStatus("approved");
            kyc.setVerifiedByAdmin(adminId);
            kyc.setVerifiedAt(LocalDateTime.now());
            kycRepository.save(kyc);

            // Update user KYC status
            User userData = user.get();
            userData.setKycStatus("approved");
            userRepository.save(userData);

            // Send approval email
            emailService.sendKycApprovalNotification(userData.getName(), userData.getEmail());

                logger.info("KYC {} approved by admin {}", kycId, adminId);
                try { notificationsPublisher.kycStatus(kyc.getId(), userData.getId(), "approved"); } catch (Exception ignore) {}
            return ResponseEntity.ok(new ApiResponse<>(Map.of(
                    "message", "KYC approved successfully",
                    "kycId", kycId,
                    "verificationStatus", "approved",
                    "approvedAt", kyc.getVerifiedAt())));
        } catch (Exception e) {
            logger.error("Error approving KYC {}", kycId, e);
            return ResponseEntity.status(500).body(new ApiResponse<>("Error: " + e.getMessage()));
        }
    }

    /**
     * Reject KYC submission
     */
    @PostMapping("/{kycId}/reject")
    public ResponseEntity<ApiResponse<Map<String, Object>>> rejectKyc(
            @PathVariable(required = true) Long kycId,
            @RequestBody Map<String, String> payload,
            HttpServletRequest request) {
        try {
            Long adminId = getAdminId(request);
            if (adminId == null) {
                return ResponseEntity.status(403).body(new ApiResponse<>("Forbidden: Admin access required"));
            }

            String rejectionReason = payload.getOrDefault("rejectionReason", "Documents do not meet requirements");

            Optional<KycVerification> kycOpt = kycRepository.findById(java.util.Objects.requireNonNull(kycId));
            if (kycOpt.isEmpty()) {
                return ResponseEntity.status(404).body(new ApiResponse<>("KYC submission not found"));
            }

            KycVerification kyc = kycOpt.get();
            Optional<User> user = userRepository.findById(java.util.Objects.requireNonNull(kyc.getUserId()));

            if (user.isEmpty()) {
                return ResponseEntity.status(404).body(new ApiResponse<>("User not found"));
            }

            // Update KYC status
            kyc.setVerificationStatus("rejected");
            kyc.setRejectionReason(rejectionReason);
            kyc.setVerifiedByAdmin(adminId);
            kyc.setVerifiedAt(LocalDateTime.now());
            kycRepository.save(kyc);

            // Update user KYC status
            User userData = user.get();
            userData.setKycStatus("rejected");
            userRepository.save(userData);

            // Send rejection email
            emailService.sendKycRejectionNotification(userData.getName(), userData.getEmail(), rejectionReason);

                logger.info("KYC {} rejected by admin {} with reason: {}", kycId, adminId, rejectionReason);
                try { notificationsPublisher.kycStatus(kyc.getId(), userData.getId(), "rejected"); } catch (Exception ignore) {}
            return ResponseEntity.ok(new ApiResponse<>(Map.of(
                    "message", "KYC rejected successfully",
                    "kycId", kycId,
                    "verificationStatus", "rejected",
                    "rejectionReason", rejectionReason)));
        } catch (Exception e) {
            logger.error("Error rejecting KYC {}", kycId, e);
            return ResponseEntity.status(500).body(new ApiResponse<>("Error: " + e.getMessage()));
        }
    }

    /**
     * Download KYC PDF for admin review
     */
    @GetMapping("/{kycId}/pdf")
    public ResponseEntity<?> getKycPdf(
            @PathVariable(required = true) Long kycId,
            HttpServletRequest request) {
        try {
            if (!isAdminUser(request)) {
                return ResponseEntity.status(403).body(new ApiResponse<>("Forbidden: Admin access required"));
            }

            Optional<KycVerification> kycOpt = kycRepository.findById(java.util.Objects.requireNonNull(kycId));
            if (kycOpt.isEmpty()) {
                return ResponseEntity.status(404).body(new ApiResponse<>("KYC submission not found"));
            }

            KycVerification kyc = kycOpt.get();
            String pdfUrl = kyc.getKycPdfUrl();

            if (pdfUrl == null || pdfUrl.isEmpty()) {
                return ResponseEntity.status(404).body(new ApiResponse<>("PDF not available for this KYC"));
            }

            // Load PDF from file system
            if (pdfUrl.startsWith("backend-uploads")) {
                Path filePath = Paths.get(pdfUrl);
                if (Files.exists(filePath) && Files.isRegularFile(filePath)) {
                    byte[] pdfBytes = Files.readAllBytes(filePath);
                    return ResponseEntity.ok()
                            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=kyc_" + kycId + ".pdf")
                            .contentType(java.util.Objects.requireNonNull(MediaType.APPLICATION_PDF))
                            .body(pdfBytes);
                }
            }

            return ResponseEntity.status(404).body(new ApiResponse<>("PDF file not found"));
        } catch (Exception e) {
            logger.error("Error downloading KYC PDF for kycId: {}", kycId, e);
            return ResponseEntity.status(500).body(new ApiResponse<>("Error: " + e.getMessage()));
        }
    }

    /**
     * Helper method to check if request is from admin user
     */
    private boolean isAdminUser(HttpServletRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated()) {
                boolean hasAdmin = authentication.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .anyMatch(auth -> "ROLE_ADMIN".equalsIgnoreCase(auth));
                if (hasAdmin) {
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            logger.warn("Error in isAdminUser", e);
            return false;
        }
    }

    /**
     * Helper method to get admin ID from request
     */
    private Long getAdminId(HttpServletRequest request) {
        try {
            Object userIdObj = request.getAttribute("userId");
            if (userIdObj == null) {
                return null;
            }
            if (userIdObj instanceof Long) {
                return (Long) userIdObj;
            }
            return Long.parseLong(userIdObj.toString());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    /**
     * Mask sensitive numbers - show only last 4 digits
     */
    private String maskNumber(String number) {
        if (number == null || number.length() <= 4) {
            return number;
        }
        return "**** **** " + number.substring(number.length() - 4);
    }
}
