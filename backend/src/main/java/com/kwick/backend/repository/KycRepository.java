package com.kwick.backend.repository;

import com.kwick.backend.model.KycVerification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface KycRepository extends JpaRepository<KycVerification, Long> {
    Optional<KycVerification> findByUserId(Long userId);

    List<KycVerification> findByVerificationStatus(String verificationStatus);
}
