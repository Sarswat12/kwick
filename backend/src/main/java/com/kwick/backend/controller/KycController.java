package com.kwick.backend.controller;

import com.kwick.backend.ApiResponse;
import com.kwick.backend.model.KycVerification;
import com.kwick.backend.model.User;
import com.kwick.backend.repository.KycRepository;
import com.kwick.backend.repository.UserRepository;
import com.kwick.backend.service.StorageService;
import com.kwick.backend.service.PdfGenerationService;
import com.kwick.backend.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/kyc")
public class KycController {

    private static final Logger logger = LoggerFactory.getLogger(KycController.class);
    private final StorageService storageService;
    private final KycRepository kycRepository;
    private final UserRepository userRepository;
    private final PdfGenerationService pdfGenerationService;
    private final EmailService emailService;

    @Autowired
    public KycController(StorageService storageService, KycRepository kycRepository, UserRepository userRepository,
            PdfGenerationService pdfGenerationService, EmailService emailService) {
        this.storageService = storageService;
        this.kycRepository = kycRepository;
        this.userRepository = userRepository;
        this.pdfGenerationService = pdfGenerationService;
        this.emailService = emailService;
    }

    // Backwards-compatible constructor for tests that only pass StorageService and
    // KycRepository
    public KycController(StorageService storageService, KycRepository kycRepository) {
        this.storageService = storageService;
        this.kycRepository = kycRepository;
        this.userRepository = null;
        this.pdfGenerationService = null;
        this.emailService = null;
    }

    /**
     * Upload Aadhaar Front Document
     */
    private Long getUserId(HttpServletRequest request) {
        Object userIdObj = request.getAttribute("userId");
        if (userIdObj == null) {
            return null;
        }
        try {
            if (userIdObj instanceof Long) {
                return (Long) userIdObj;
            }
            return Long.parseLong(userIdObj.toString());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    /**
     * Upload Aadhaar Front Document
     */
    @PostMapping(value = "/upload/aadhaar-front", consumes = "multipart/form-data")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadAadhaarFront(
            @RequestPart("file") MultipartFile file,
            HttpServletRequest request) throws Exception {
        try {
            Long userId = getUserId(request);
            if (userId == null) {
                return ResponseEntity.status(401).body(new ApiResponse<>("Unauthorized"));
            }
            // File type/size validation
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body(new ApiResponse<>("No file uploaded"));
            }
            String contentType = file.getContentType();
            long maxSize = 5 * 1024 * 1024; // 5MB
            if (file.getSize() > maxSize) {
                return ResponseEntity.badRequest().body(new ApiResponse<>("File too large (max 5MB)"));
            }
            if (contentType == null || !(contentType.equals("image/jpeg") || contentType.equals("image/png") || contentType.equals("application/pdf"))) {
                return ResponseEntity.badRequest().body(new ApiResponse<>("Invalid file type. Only JPEG, PNG, or PDF allowed."));
            }

            String url = storageService.storeFile(file, "kyc/" + userId + "/aadhaar");
            KycVerification kyc = kycRepository.findByUserId(userId).orElseGet(() -> {
                KycVerification k = new KycVerification();
                k.setUserId(userId);
                return k;
            });

            kyc.setAadhaarFrontUrl(url);
            kyc.setAadhaarFrontFilename(file.getOriginalFilename());
            kyc.setAadhaarFrontType(file.getContentType());
            kyc.setAadhaarFrontSize(file.getSize());
            kycRepository.saveAndFlush(kyc);

            logger.info("Aadhaar front uploaded for user: {}", userId);
            return ResponseEntity.ok(new ApiResponse<>(Map.of("message", "Aadhaar front uploaded", "url", url)));
        } catch (Exception e) {
            logger.error("Error uploading Aadhaar front: {}", e.getMessage());
            return ResponseEntity.status(500).body(new ApiResponse<>("Upload failed: " + e.getMessage()));
        }
    }

    /**
     * Upload Aadhaar Back Document
     */
    /**
     * Upload Aadhaar Back Document
     */
    @PostMapping(value = "/upload/aadhaar-back", consumes = "multipart/form-data")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadAadhaarBack(
            @RequestPart("file") MultipartFile file,
            HttpServletRequest request) throws Exception {
        try {
            Long userId = getUserId(request);
            if (userId == null) {
                return ResponseEntity.status(401).body(new ApiResponse<>("Unauthorized"));
            }
            // File type/size validation
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body(new ApiResponse<>("No file uploaded"));
            }
            String contentType = file.getContentType();
            long maxSize = 5 * 1024 * 1024; // 5MB
            if (file.getSize() > maxSize) {
                return ResponseEntity.badRequest().body(new ApiResponse<>("File too large (max 5MB)"));
            }
            if (contentType == null || !(contentType.equals("image/jpeg") || contentType.equals("image/png") || contentType.equals("application/pdf"))) {
                return ResponseEntity.badRequest().body(new ApiResponse<>("Invalid file type. Only JPEG, PNG, or PDF allowed."));
            }

            String url = storageService.storeFile(file, "kyc/" + userId + "/aadhaar");
            KycVerification kyc = kycRepository.findByUserId(userId).orElseGet(() -> {
                KycVerification k = new KycVerification();
                k.setUserId(userId);
                return k;
            });

            kyc.setAadhaarBackUrl(url);
            kyc.setAadhaarBackFilename(file.getOriginalFilename());
            kyc.setAadhaarBackType(file.getContentType());
            kyc.setAadhaarBackSize(file.getSize());
            kycRepository.saveAndFlush(kyc);

            logger.info("Aadhaar back uploaded for user: {}", userId);
            return ResponseEntity.ok(new ApiResponse<>(Map.of("message", "Aadhaar back uploaded", "url", url)));
        } catch (Exception e) {
            logger.error("Error uploading Aadhaar back: {}", e.getMessage());
            return ResponseEntity.status(500).body(new ApiResponse<>("Upload failed: " + e.getMessage()));
        }
    }

    /**
     * Upload License Front Document
     */
    /**
     * Upload License Front Document
     */
    @PostMapping(value = "/upload/license-front", consumes = "multipart/form-data")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadLicenseFront(
            @RequestPart("file") MultipartFile file,
            HttpServletRequest request) throws Exception {
        try {
            Long userId = getUserId(request);
            if (userId == null) {
                return ResponseEntity.status(401).body(new ApiResponse<>("Unauthorized"));
            }
            // File type/size validation
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body(new ApiResponse<>("No file uploaded"));
            }
            String contentType = file.getContentType();
            long maxSize = 5 * 1024 * 1024; // 5MB
            if (file.getSize() > maxSize) {
                return ResponseEntity.badRequest().body(new ApiResponse<>("File too large (max 5MB)"));
            }
            if (contentType == null || !(contentType.equals("image/jpeg") || contentType.equals("image/png") || contentType.equals("application/pdf"))) {
                return ResponseEntity.badRequest().body(new ApiResponse<>("Invalid file type. Only JPEG, PNG, or PDF allowed."));
            }

            String url = storageService.storeFile(file, "kyc/" + userId + "/license");
            KycVerification kyc = kycRepository.findByUserId(userId).orElseGet(() -> {
                KycVerification k = new KycVerification();
                k.setUserId(userId);
                return k;
            });

            kyc.setLicenseFrontUrl(url);
            kyc.setLicenseFrontFilename(file.getOriginalFilename());
            kyc.setLicenseFrontType(file.getContentType());
            kyc.setLicenseFrontSize(file.getSize());
            kycRepository.saveAndFlush(kyc);

            logger.info("License front uploaded for user: {}", userId);
            return ResponseEntity.ok(new ApiResponse<>(Map.of("message", "License front uploaded", "url", url)));
        } catch (Exception e) {
            logger.error("Error uploading License front: {}", e.getMessage());
            return ResponseEntity.status(500).body(new ApiResponse<>("Upload failed: " + e.getMessage()));
        }
    }

    /**
     * Upload License Back Document
     */
    /**
     * Upload License Back Document
     */
    @PostMapping(value = "/upload/license-back", consumes = "multipart/form-data")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadLicenseBack(
            @RequestPart("file") MultipartFile file,
            HttpServletRequest request) throws Exception {
        try {
            Long userId = getUserId(request);
            if (userId == null) {
                return ResponseEntity.status(401).body(new ApiResponse<>("Unauthorized"));
            }
            // File type/size validation
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body(new ApiResponse<>("No file uploaded"));
            }
            String contentType = file.getContentType();
            long maxSize = 5 * 1024 * 1024; // 5MB
            if (file.getSize() > maxSize) {
                return ResponseEntity.badRequest().body(new ApiResponse<>("File too large (max 5MB)"));
            }
            if (contentType == null || !(contentType.equals("image/jpeg") || contentType.equals("image/png") || contentType.equals("application/pdf"))) {
                return ResponseEntity.badRequest().body(new ApiResponse<>("Invalid file type. Only JPEG, PNG, or PDF allowed."));
            }

            String url = storageService.storeFile(file, "kyc/" + userId + "/license");
            KycVerification kyc = kycRepository.findByUserId(userId).orElseGet(() -> {
                KycVerification k = new KycVerification();
                k.setUserId(userId);
                return k;
            });

            kyc.setLicenseBackUrl(url);
            kyc.setLicenseBackFilename(file.getOriginalFilename());
            kyc.setLicenseBackType(file.getContentType());
            kyc.setLicenseBackSize(file.getSize());
            kycRepository.saveAndFlush(kyc);

            logger.info("License back uploaded for user: {}", userId);
            return ResponseEntity.ok(new ApiResponse<>(Map.of("message", "License back uploaded", "url", url)));
        } catch (Exception e) {
            logger.error("Error uploading License back: {}", e.getMessage());
            return ResponseEntity.status(500).body(new ApiResponse<>("Upload failed: " + e.getMessage()));
        }
    }

    /**
     * Upload Selfie Document
     */
    /**
     * Upload Selfie Document
     */
    @PostMapping(value = "/upload/selfie", consumes = "multipart/form-data")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadSelfie(
            @RequestPart("file") MultipartFile file,
            HttpServletRequest request) throws Exception {
        try {
            Long userId = getUserId(request);
            if (userId == null) {
                return ResponseEntity.status(401).body(new ApiResponse<>("Unauthorized"));
            }
            // File type/size validation
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body(new ApiResponse<>("No file uploaded"));
            }
            String contentType = file.getContentType();
            long maxSize = 5 * 1024 * 1024; // 5MB
            if (file.getSize() > maxSize) {
                return ResponseEntity.badRequest().body(new ApiResponse<>("File too large (max 5MB)"));
            }
            if (contentType == null || !(contentType.equals("image/jpeg") || contentType.equals("image/png") || contentType.equals("application/pdf"))) {
                return ResponseEntity.badRequest().body(new ApiResponse<>("Invalid file type. Only JPEG, PNG, or PDF allowed."));
            }

            String url = storageService.storeFile(file, "kyc/" + userId + "/selfie");
            KycVerification kyc = kycRepository.findByUserId(userId).orElseGet(() -> {
                KycVerification k = new KycVerification();
                k.setUserId(userId);
                return k;
            });

            kyc.setSelfieUrl(url);
            kyc.setSelfieFilename(file.getOriginalFilename());
            kyc.setSelfieType(file.getContentType());
            kyc.setSelfieSize(file.getSize());
            kycRepository.saveAndFlush(kyc);

            logger.info("Selfie uploaded for user: {}", userId);
            return ResponseEntity.ok(new ApiResponse<>(Map.of("message", "Selfie uploaded", "url", url)));
        } catch (Exception e) {
            logger.error("Error uploading Selfie: {}", e.getMessage());
            return ResponseEntity.status(500).body(new ApiResponse<>("Upload failed: " + e.getMessage()));
        }
    }

    /**
     * Submit KYC with Personal Details
     */
    /**
     * Submit KYC with Personal Details
     */
    @PostMapping("/submit")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> submitKyc(
            @RequestBody Map<String, Object> payload,
            HttpServletRequest request) {
        try {
            logger.info("=== KYC Submit Request Received ===");
            logger.info("Request URI: {}", request.getRequestURI());
            logger.info("Payload: {}", payload);

            // Check Authorization header
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                logger.error("Missing or invalid Authorization header");
                return ResponseEntity.status(401).body(new ApiResponse<>("Unauthorized - Missing token"));
            }

            Long userId = getUserId(request);
            if (userId == null) {
                logger.error("UNAUTHORIZED: userId is null");
                return ResponseEntity.status(401).body(new ApiResponse<>("Unauthorized - User ID not found"));
            }

            // Validate required fields
            String[] requiredFields = {"aadhaarNumber", "licenseNumber", "address", "city", "state", "pincode"};
            for (String field : requiredFields) {
                if (!payload.containsKey(field) || payload.get(field) == null || payload.get(field).toString().trim().isEmpty()) {
                    logger.warn("Validation failed: missing field {}", field);
                    return ResponseEntity.badRequest().body(new ApiResponse<>("Missing required field: " + field));
                }
            }

            // Always create or update a 'pending' KYC record
            KycVerification kyc = kycRepository.findByUserId(userId).orElseGet(() -> {
                KycVerification k = new KycVerification();
                k.setUserId(userId);
                return k;
            });
            kyc.setAadhaarNumber((String) payload.get("aadhaarNumber"));
            kyc.setDrivingLicenseNumber((String) payload.get("licenseNumber"));
            kyc.setStreetAddress((String) payload.get("address"));
            kyc.setCity((String) payload.get("city"));
            kyc.setState((String) payload.get("state"));
            kyc.setPincode((String) payload.get("pincode"));
            kyc.setVerificationStatus("pending");
            kyc.setUpdatedAt(java.time.LocalDateTime.now());
            logger.info("Saving KYC record for user: {}", userId);
            kycRepository.saveAndFlush(kyc);

            // Update user KYC status
            User u = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            u.setKycStatus("pending");
            userRepository.save(u);
            logger.info("Updated user {} KYC status to pending", userId);

            // Generate and store PDF
            try {
                byte[] pdfBytes = pdfGenerationService.generateKycPdf(kyc, u);
                String pdfFileName = "kyc_" + userId + "_" + System.currentTimeMillis() + ".pdf";
                Path uploadDir = Paths.get("backend-uploads", "kyc", userId.toString());
                Files.createDirectories(uploadDir);
                Path filePath = uploadDir.resolve(pdfFileName);
                Files.write(filePath, pdfBytes);
                String relativeUrl = "backend-uploads/kyc/" + userId + "/" + pdfFileName;
                kyc.setKycPdfUrl(relativeUrl);
                kycRepository.saveAndFlush(kyc);
                logger.info("KYC PDF generated and saved for user {} at: {}", userId, filePath.toString());
            } catch (Exception pdfEx) {
                logger.warn("Could not generate KYC PDF for user {}: {}", userId, pdfEx.getMessage());
            }

            // Send submission notification email to admin
            try {
                if (emailService != null) {
                    emailService.sendKycSubmissionNotification(u.getName(), u.getEmail(), userId);
                }
            } catch (Exception emailEx) {
                logger.warn("Could not send KYC submission email for user {}: {}", userId, emailEx.getMessage());
            }

            logger.info("✅ KYC submitted successfully for user: {} with status: pending", userId);
            return ResponseEntity.ok(new ApiResponse<>(Map.of(
                    "message", "KYC submitted for verification",
                    "kycId", kyc.getId(),
                    "userId", userId)));
        } catch (Exception e) {
            logger.error("❌ Error submitting KYC: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(new ApiResponse<>("KYC submission failed: " + e.getMessage()));
        }
    }

    /**
     * Get KYC Status
     */
    /**
     * Get KYC Status
     */
    @GetMapping("/status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getKycStatus(HttpServletRequest request) {
        try {
            Long userId = getUserId(request);
            if (userId == null) {
                return ResponseEntity.status(401).body(new ApiResponse<>("Unauthorized"));
            }

            var kyc = kycRepository.findByUserId(userId);
            if (kyc.isEmpty()) {
                // Auto-create an empty KYC record for the user to ensure persistence and
                // a single row to update as documents are uploaded.
                KycVerification created = new KycVerification();
                created.setUserId(userId);
                created.setVerificationStatus("incomplete");
                kycRepository.saveAndFlush(created);
                KycVerification k = created;
                return ResponseEntity.ok(new ApiResponse<>(Map.of(
                        "status", k.getVerificationStatus(),
                        "kycId", k.getId(),
                        "aadhaarNumber", "",
                        "licenseNumber", "",
                        "address", "",
                        "city", "",
                        "state", "",
                        "pincode", "")));
            }

            KycVerification k = kyc.get();
            return ResponseEntity.ok(new ApiResponse<>(Map.of(
                    "status", k.getVerificationStatus(),
                    "kycId", k.getId(),
                    "aadhaarNumber", k.getAadhaarNumber() != null ? k.getAadhaarNumber() : "",
                    "licenseNumber", k.getDrivingLicenseNumber() != null ? k.getDrivingLicenseNumber() : "",
                    "address", k.getStreetAddress() != null ? k.getStreetAddress() : "",
                    "city", k.getCity() != null ? k.getCity() : "",
                    "state", k.getState() != null ? k.getState() : "",
                    "pincode", k.getPincode() != null ? k.getPincode() : "")));
        } catch (Exception e) {
            logger.error("Error getting KYC status: {}", e.getMessage());
            return ResponseEntity.status(500).body(new ApiResponse<>("Failed to get KYC status: " + e.getMessage()));
        }
    }

    /**
     * Download KYC PDF
     */
    @GetMapping("/download-pdf")
    public ResponseEntity<?> downloadKycPdf(HttpServletRequest request) {
        try {
            Long userId = getUserId(request);
            if (userId == null) {
                return ResponseEntity.status(401).body(new ApiResponse<>("Unauthorized"));
            }

            var kycOpt = kycRepository.findByUserId(userId);
            if (kycOpt.isEmpty()) {
                return ResponseEntity.status(404).body(new ApiResponse<>("KYC not found"));
            }

            KycVerification kyc = kycOpt.get();
            User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

            byte[] pdfBytes = null;

            // Try to load from stored file first
            if (kyc.getKycPdfUrl() != null && kyc.getKycPdfUrl().startsWith("backend-uploads")) {
                try {
                    Path filePath = Paths.get(kyc.getKycPdfUrl());
                    if (Files.exists(filePath)) {
                        pdfBytes = Files.readAllBytes(filePath);
                        logger.info("KYC PDF loaded from file for user: {}", userId);
                    }
                } catch (Exception e) {
                    logger.warn("Failed to load stored KYC PDF for user {}: {}", userId, e.getMessage());
                }
            }

            // If no stored file, generate PDF on-the-fly
            if (pdfBytes == null) {
                pdfBytes = pdfGenerationService.generateKycPdf(kyc, user);
                logger.info("KYC PDF generated on-the-fly for user: {}", userId);
            }

            logger.info("KYC PDF downloaded for user: {}", userId);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"kyc-" + userId + ".pdf\"")
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PDF_VALUE)
                    .body(pdfBytes);
        } catch (Exception e) {
            logger.error("Error downloading KYC PDF: {}", e.getMessage());
            return ResponseEntity.status(500).body(new ApiResponse<>("Failed to download KYC PDF: " + e.getMessage()));
        }
    }

    /**
     * Serve KYC document files
     * Usage: /api/kyc/file/{userId}/aadhaar/filename
     * Handles URL-encoded filenames with spaces and special characters
     */
    @GetMapping("/file/{userId}/{docType}/{filename:.+}")
    public ResponseEntity<?> getKycFile(
            @PathVariable String userId,
            @PathVariable String docType,
            @PathVariable String filename) {
        try {
            // Decode URL-encoded filename (e.g., "file%20name.jpg" -> "file name.jpg")
            String decodedFilename = java.net.URLDecoder.decode(filename, java.nio.charset.StandardCharsets.UTF_8);
            
            // Construct the file path safely - use user.dir to match LocalStorageService
            Path basePath = Paths.get(System.getProperty("user.dir"), "backend-uploads", "kyc", userId, docType);
            Path filePath = basePath.resolve(decodedFilename).normalize();

            // Security check: ensure the file is within the intended directory
            if (!filePath.getParent().equals(basePath)) {
                logger.warn("Attempted path traversal attack: {}", filePath);
                return ResponseEntity.status(403).body(new ApiResponse<>("Forbidden"));
            }

            if (!Files.exists(filePath)) {
                logger.warn("KYC file not found: {}", filePath);
                // Return a default SVG image for not found
                String svg = "<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200'><rect width='100%' height='100%' fill='#f8d7da'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='20' fill='#721c24'>Image not found</text></svg>";
                return ResponseEntity.status(200)
                        .header(HttpHeaders.CONTENT_TYPE, "image/svg+xml")
                        .body(svg);
            }

            byte[] fileContent = Files.readAllBytes(filePath);
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            logger.info("Serving KYC file: {}", filePath);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, contentType)
                    .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(fileContent.length))
                    .body(fileContent);
        } catch (Exception e) {
            logger.error("Error serving KYC file: {}", e.getMessage());
            return ResponseEntity.status(500).body(new ApiResponse<>("Error serving file: " + e.getMessage()));
        }
    }
}
