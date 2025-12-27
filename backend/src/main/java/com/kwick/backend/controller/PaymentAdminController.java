package com.kwick.backend.controller;

import com.kwick.backend.ApiResponse;
import com.kwick.backend.exception.ForbiddenException;
import com.kwick.backend.exception.ResourceNotFoundException;
import com.kwick.backend.model.Payment;
import com.kwick.backend.model.User;
import com.kwick.backend.repository.PaymentRepository;
import com.kwick.backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/payments")
public class PaymentAdminController {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    public PaymentAdminController(PaymentRepository paymentRepository, UserRepository userRepository) {
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
    }

    private User requireAdmin(HttpServletRequest request) {
        Object uid = request.getAttribute("userId");
        if (uid == null)
            throw new ForbiddenException("Not authenticated");
        Long userId;
        if (uid instanceof Long) {
            userId = (Long) uid;
        } else {
            userId = Long.parseLong(uid.toString());
        }
        User u = userRepository.findById(userId).orElseThrow(() -> new ForbiddenException("User not found"));
        if (!"admin".equalsIgnoreCase(u.getRole()))
            throw new ForbiddenException("Admin role required");
        return u;
    }

    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<Object>> listPending(HttpServletRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        requireAdmin(request);
        Pageable pageable = PageRequest.of(page, size);
        Page<Payment> payments = paymentRepository.findByStatus("pending", pageable);
        return ResponseEntity.ok(new ApiResponse<>(Map.of(
                "content", payments.getContent(),
                "totalPages", payments.getTotalPages(),
                "totalElements", payments.getTotalElements())));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<Payment>> approvePayment(HttpServletRequest request, @PathVariable Long id) {
        User admin = requireAdmin(request);
        Payment p = paymentRepository.findById(java.util.Objects.requireNonNull(id))
            .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
        p.setStatus("completed");
        p.setVerifiedByAdmin(admin.getId());
        p.setVerifiedAt(Instant.now());
        paymentRepository.save(p);
        return ResponseEntity.ok(new ApiResponse<>(p));
    }

    @PostMapping("/{id}/attach-proof")
    public ResponseEntity<ApiResponse<Payment>> attachProof(HttpServletRequest request,
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        requireAdmin(request);
        Payment p = paymentRepository.findById(java.util.Objects.requireNonNull(id))
            .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
        String proofUrl = body.get("proofUrl");
        if (proofUrl != null)
            p.setProofImageUrl(proofUrl);
        // Admin may optionally mark completed here
        if ("true".equalsIgnoreCase(body.getOrDefault("markCompleted", "false"))) {
            p.setStatus("completed");
            Object uid = request.getAttribute("userId");
            Long adminId;
            if (uid instanceof Long) {
                adminId = (Long) uid;
            } else {
                adminId = Long.parseLong(uid.toString());
            }
            p.setVerifiedByAdmin(adminId);
            p.setVerifiedAt(Instant.now());
        }
        paymentRepository.save(java.util.Objects.requireNonNull(p));
        return ResponseEntity.ok(new ApiResponse<>(p));
    }

    @PostMapping("/create-for-user")
    public ResponseEntity<ApiResponse<Payment>> createForUser(HttpServletRequest request,
            @RequestBody Map<String, Object> body) {
        User admin = requireAdmin(request);
        Long userId = body.get("userId") == null ? null : ((Number) body.get("userId")).longValue();
        Long rentalId = body.get("rentalId") == null ? null : ((Number) body.get("rentalId")).longValue();
        Double amount = body.get("amount") == null ? null : ((Number) body.get("amount")).doubleValue();
        String method = body.get("method") == null ? null : body.get("method").toString();
        String txn = body.get("transactionId") == null ? null : body.get("transactionId").toString();
        String proofUrl = body.get("proofUrl") == null ? null : body.get("proofUrl").toString();

        Payment p = new Payment();
        p.setUserId(userId);
        p.setRentalId(rentalId);
        p.setAmount(amount);
        p.setMethod(method);
        p.setTransactionId(txn != null ? txn : "ADMIN_TX_" + System.currentTimeMillis());
        p.setProofImageUrl(proofUrl);
        p.setStatus("completed");
        p.setVerifiedByAdmin(admin.getId());
        p.setVerifiedAt(Instant.now());

        paymentRepository.save(p);
        return ResponseEntity.ok(new ApiResponse<>(p));
    }

}
