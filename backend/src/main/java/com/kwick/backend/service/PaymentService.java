package com.kwick.backend.service;

import com.kwick.backend.model.Payment;
import com.kwick.backend.repository.PaymentRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {
    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public List<Payment> getAllPaymentsForUser(Long userId) {
        Pageable pageable = PageRequest.of(0, 100); // fetch up to 100 payments per user
        return paymentRepository.findByUserId(userId, pageable).getContent();
    }
}
