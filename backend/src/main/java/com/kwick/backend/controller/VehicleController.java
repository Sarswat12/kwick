package com.kwick.backend.controller;

import com.kwick.backend.ApiResponse;
import com.kwick.backend.exception.ResourceNotFoundException;
import com.kwick.backend.model.Vehicle;
import com.kwick.backend.repository.VehicleRepository;
import com.kwick.backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    public VehicleController(VehicleRepository vehicleRepository, UserRepository userRepository) {
        this.vehicleRepository = vehicleRepository;
        this.userRepository = userRepository;
    }


    @GetMapping
    public ResponseEntity<ApiResponse<Object>> listVehicles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Vehicle> vehicles = vehicleRepository.findAll(pageable);

        return ResponseEntity.ok(new ApiResponse<>(Map.of(
                "content", vehicles.getContent(),
                "totalPages", vehicles.getTotalPages(),
                "totalElements", vehicles.getTotalElements(),
                "currentPage", page)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Vehicle>> getVehicle(@PathVariable Long id) {
        Vehicle vehicle = vehicleRepository.findById(java.util.Objects.requireNonNull(id))
            .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
        if (vehicle == null) {
            throw new ResourceNotFoundException("Vehicle not found");
        }
        return ResponseEntity.ok(new ApiResponse<>(vehicle));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Vehicle>> createVehicle(
            HttpServletRequest request,
            @RequestBody Map<String, Object> body) {

                Object userIdObj = request.getAttribute("userId");
                if (userIdObj == null) {
                    return ResponseEntity.status(401).body(new ApiResponse<>("Unauthorized"));
                }
                Long userId = Long.parseLong(userIdObj.toString());
                // Check if user is admin
                com.kwick.backend.model.User user = userRepository.findById(userId)
                    .orElse(null);
                if (user == null || user.getRole() == null || !"admin".equalsIgnoreCase(user.getRole())) {
                    return ResponseEntity.status(403).body(new ApiResponse<>("Forbidden: Admin access required"));
                }

        Vehicle v = new Vehicle();
        v.setName((String) body.get("name"));
        v.setType((String) body.get("type"));
        v.setBrand((String) body.get("brand"));
        v.setModel((String) body.get("model"));
        v.setRegistrationNumber((String) body.get("registrationNumber"));
        v.setDailyRate((Double) body.get("dailyRate"));
        v.setAvailable(true);

        vehicleRepository.save(v);
        return ResponseEntity.ok(new ApiResponse<>(v));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<Object>> getUserFleet(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Vehicle> vehicles = vehicleRepository.findByOwnerId(userId, pageable);

        return ResponseEntity.ok(new ApiResponse<>(Map.of(
                "content", vehicles.getContent(),
                "totalPages", vehicles.getTotalPages(),
                "totalElements", vehicles.getTotalElements())));
    }
}
