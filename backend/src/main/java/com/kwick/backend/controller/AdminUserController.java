package com.kwick.backend.controller;

import com.kwick.backend.ApiResponse;
import com.kwick.backend.model.User;
import com.kwick.backend.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import com.kwick.backend.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {
    private final UserRepository userRepository;
    private final PaymentService paymentService;

    public AdminUserController(UserRepository userRepository, PaymentService paymentService) {
        this.userRepository = userRepository;
        this.paymentService = paymentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> userPage = userRepository.findAll(pageable);
        List<Map<String, Object>> items = userPage.getContent().stream().map(user -> {
            Map<String, Object> u = new HashMap<>();
            u.put("id", user.getId());
            u.put("email", user.getEmail());
            u.put("name", user.getName());
            u.put("phone", user.getPhone());
            u.put("address", user.getAddress());
            u.put("kycStatus", user.getKycStatus());
            u.put("role", user.getRole());
            // Add payments for this user
            u.put("payments", paymentService.getAllPaymentsForUser(user.getId()));
            return u;
        }).collect(Collectors.toList());
        Map<String, Object> result = new HashMap<>();
        result.put("items", items);
        result.put("total", userPage.getTotalElements());
        result.put("page", userPage.getNumber());
        result.put("size", userPage.getSize());
        return ResponseEntity.ok(new ApiResponse<>(result));
    }
}
