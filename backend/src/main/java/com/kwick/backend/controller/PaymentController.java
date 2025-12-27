package com.kwick.backend.controller;

import com.kwick.backend.ApiResponse;
import com.kwick.backend.exception.ResourceNotFoundException;
import com.kwick.backend.exception.UnauthorizedException;
import com.kwick.backend.model.Payment;
import com.kwick.backend.repository.PaymentRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentRepository paymentRepository;

    public PaymentController(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    private Long extractUserId(HttpServletRequest request) {
        Object userId = request.getAttribute("userId");
        if (userId == null) {
            throw new UnauthorizedException("User not authenticated");
        }
        return Long.parseLong(userId.toString());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Payment>> initiatePayment(
            HttpServletRequest request,
            @RequestBody Map<String, Object> body) {
        Long userId = extractUserId(request);

        Long rentalId = body.get("rentalId") == null ? null : ((Number) body.get("rentalId")).longValue();
        Double amount = body.get("amount") == null ? null : ((Number) body.get("amount")).doubleValue();
        String method = body.get("method") == null ? null : body.get("method").toString();

        Payment p = new Payment();
        p.setUserId(userId);
        p.setRentalId(rentalId);
        p.setAmount(amount);
        p.setMethod(method);
        p.setStatus("pending");

        // Scanner input for transaction/order ID (demo only)
        try (java.util.Scanner scanner = new java.util.Scanner(System.in)) {
            System.out.print("Enter payment gateway order ID: ");
            String orderId = scanner.nextLine();
            p.setTransactionId(orderId.isEmpty() ? "TXN_" + System.currentTimeMillis() : orderId);
        }

        paymentRepository.save(p);

        return ResponseEntity.ok(new ApiResponse<>(p));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<Object>> verifyPayment(
            @RequestBody Map<String, String> body) {
        String transactionId = body.get("transactionId");
        String razorpayPaymentId = body.get("razorpayPaymentId");

        Payment payment = paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        // Scanner input for verification (demo only)
        try (java.util.Scanner scanner = new java.util.Scanner(System.in)) {
            System.out.print("Verify payment? (yes/no): ");
            String verify = scanner.nextLine();
            if ("yes".equalsIgnoreCase(verify)) {
                payment.setStatus("completed");
                payment.setTransactionId(razorpayPaymentId);
            } else {
                payment.setStatus("failed");
            }
        }

        paymentRepository.save(payment);

        return ResponseEntity.ok(new ApiResponse<>(Map.of("status", "completed")));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Payment>> getPayment(@PathVariable Long id) {
        Payment payment = paymentRepository.findById(java.util.Objects.requireNonNull(id))
            .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
        return ResponseEntity.ok(new ApiResponse<>(payment));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Object>> listPayments(
            HttpServletRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Long userId = extractUserId(request);
        Pageable pageable = PageRequest.of(page, size);
        Page<Payment> payments = paymentRepository.findByUserId(userId, pageable);

        return ResponseEntity.ok(new ApiResponse<>(Map.of(
                "content", payments.getContent(),
                "totalPages", payments.getTotalPages(),
                "totalElements", payments.getTotalElements())));
    }
}
