package com.kwick.backend.controller;

import com.kwick.backend.ApiResponse;
import com.kwick.backend.model.KycVerification;
import com.kwick.backend.repository.KycRepository;
import com.kwick.backend.repository.UserRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/kyc/debug")
public class KycDebugPublicController {

    private final JdbcTemplate jdbcTemplate;
    private final DataSource dataSource;
    private final KycRepository kycRepository;
    private final UserRepository userRepository;

    public KycDebugPublicController(JdbcTemplate jdbcTemplate, DataSource dataSource,
                                    KycRepository kycRepository, UserRepository userRepository) {
        this.jdbcTemplate = jdbcTemplate;
        this.dataSource = dataSource;
        this.kycRepository = kycRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/paths/{userId}")
    public ApiResponse<Map<String, Object>> debugPaths(@PathVariable Long userId) {
        try {
            Optional<KycVerification> kycOpt = kycRepository.findByUserId(userId);
            if (kycOpt.isEmpty()) {
                return new ApiResponse<>(Map.of("error", "No KYC found for user " + userId));
            }

            KycVerification kyc = kycOpt.get();
            Map<String, Object> debug = new HashMap<>();
            
            debug.put("userDir", System.getProperty("user.dir"));
            debug.put("userId", userId);
            debug.put("kycId", kyc.getId());
            
            debug.put("aadhaarFront", checkFile(kyc.getAadhaarFrontUrl(), userId, "aadhaar"));
            debug.put("aadhaarBack", checkFile(kyc.getAadhaarBackUrl(), userId, "aadhaar"));
            debug.put("licenseFront", checkFile(kyc.getLicenseFrontUrl(), userId, "license"));
            debug.put("licenseBack", checkFile(kyc.getLicenseBackUrl(), userId, "license"));
            debug.put("selfie", checkFile(kyc.getSelfieUrl(), userId, "selfie"));

            return new ApiResponse<>(debug);
        } catch (Exception e) {
            return new ApiResponse<>(Map.of("error", e.getMessage()));
        }
    }

    private Map<String, Object> checkFile(String storedPath, Long userId, String docType) {
        Map<String, Object> result = new HashMap<>();
        result.put("storedInDb", storedPath);
        
        if (storedPath == null || storedPath.isEmpty()) {
            result.put("exists", false);
            return result;
        }

        try {
            String filename = Paths.get(storedPath).getFileName().toString();
            result.put("extractedFilename", filename);
            
            Path basePath = Paths.get(System.getProperty("user.dir"), "backend-uploads", "kyc", userId.toString(), docType);
            Path expectedPath = basePath.resolve(filename);
            result.put("expectedPath", expectedPath.toString());
            result.put("exists", Files.exists(expectedPath));
            
            if (Files.exists(expectedPath)) {
                result.put("fileSize", Files.size(expectedPath));
            }
        } catch (Exception e) {
            result.put("error", e.getMessage());
            result.put("exists", false);
        }
        
        return result;
    }

    @GetMapping("/env")
    public ApiResponse<Map<String, Object>> env() {
        String url;
        try {
            url = dataSource.getConnection().getMetaData().getURL();
        } catch (Exception e) {
            url = "unknown: " + e.getMessage();
        }

        long kycCount = kycRepository.count();
        long userCount = userRepository.count();
        Long rawKycCount = null;
        try {
            rawKycCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM kyc_verification", Long.class);
        } catch (Exception ignore) { }

        return new ApiResponse<>(Map.of(
                "datasourceUrl", url,
                "jpaKycCount", kycCount,
                "jpaUserCount", userCount,
                "sqlKycCount", rawKycCount
        ));
    }

    @GetMapping("/urls/{userId}")
    public ApiResponse<Map<String, Object>> debugUrls(@PathVariable Long userId) {
        try {
            Optional<KycVerification> kycOpt = kycRepository.findByUserId(userId);
            if (kycOpt.isEmpty()) {
                return new ApiResponse<>(Map.of("error", "No KYC found for user " + userId));
            }

            KycVerification kyc = kycOpt.get();
            Map<String, Object> debug = new HashMap<>();
            
            // Show what URLs would be generated
            debug.put("aadhaarFrontUrl", convertToHttpUrl(kyc.getAadhaarFrontUrl(), userId, "aadhaar"));
            debug.put("aadhaarBackUrl", convertToHttpUrl(kyc.getAadhaarBackUrl(), userId, "aadhaar"));
            debug.put("licenseFrontUrl", convertToHttpUrl(kyc.getLicenseFrontUrl(), userId, "license"));
            debug.put("licenseBackUrl", convertToHttpUrl(kyc.getLicenseBackUrl(), userId, "license"));
            debug.put("selfieUrl", convertToHttpUrl(kyc.getSelfieUrl(), userId, "selfie"));

            return new ApiResponse<>(debug);
        } catch (Exception e) {
            return new ApiResponse<>(Map.of("error", e.getMessage()));
        }
    }

    private String convertToHttpUrl(String filePath, Long userId, String docType) {
        if (filePath == null || filePath.isEmpty()) {
            return null;
        }
        try {
            String filename = Paths.get(filePath).getFileName().toString();
            String encodedFilename = java.net.URLEncoder.encode(filename, java.nio.charset.StandardCharsets.UTF_8);
            return "/api/kyc/file/" + userId + "/" + docType + "/" + encodedFilename;
        } catch (Exception e) {
            return null;
        }
    }
}

