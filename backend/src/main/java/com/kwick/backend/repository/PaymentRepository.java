package com.kwick.backend.repository;

import com.kwick.backend.model.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Page<Payment> findByUserId(Long userId, Pageable pageable);

    Optional<Payment> findByTransactionId(String transactionId);

    Page<Payment> findByStatus(String status, Pageable pageable);
}
