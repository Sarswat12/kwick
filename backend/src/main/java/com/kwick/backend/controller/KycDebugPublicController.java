package com.kwick.backend.controller;

import com.kwick.backend.ApiResponse;
import com.kwick.backend.repository.KycRepository;
import com.kwick.backend.repository.UserRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.util.Map;

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
}
