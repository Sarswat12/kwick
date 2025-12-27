package com.kwick.backend.controller;

import com.kwick.backend.ApiResponse;
import com.kwick.backend.exception.ResourceNotFoundException;
import com.kwick.backend.exception.UnauthorizedException;
import com.kwick.backend.model.Rental;
import com.kwick.backend.model.Vehicle;
import com.kwick.backend.repository.RentalRepository;
import com.kwick.backend.repository.VehicleRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/rentals")
public class RentalController {

    private final RentalRepository rentalRepository;
    private final VehicleRepository vehicleRepository;

    public RentalController(RentalRepository rentalRepository, VehicleRepository vehicleRepository) {
        this.rentalRepository = rentalRepository;
        this.vehicleRepository = vehicleRepository;
    }

    private Long extractUserId(HttpServletRequest request) {
        Object userId = request.getAttribute("userId");
        if (userId == null) {
            throw new UnauthorizedException("User not authenticated");
        }
        return Long.parseLong(userId.toString());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Rental>> createRental(
            HttpServletRequest request,
            @RequestBody Map<String, Object> body) {
        Long userId = extractUserId(request);

        Long vehicleId = body.get("vehicleId") == null ? null : ((Number) body.get("vehicleId")).longValue();
        Vehicle vehicle = vehicleRepository.findById(java.util.Objects.requireNonNull(vehicleId))
            .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

        if (vehicle == null || !vehicle.isAvailable()) {
            throw new IllegalArgumentException("Vehicle is not available");
        }

        Rental r = new Rental();
        r.setUserId(userId);
        r.setVehicleId(vehicleId);
        r.setStatus("pending");
        r.setStartDate(LocalDateTime.now());

        rentalRepository.save(r);

        // Mark vehicle as unavailable
        vehicle.setAvailable(false);
        vehicleRepository.save(vehicle);

        return ResponseEntity.ok(new ApiResponse<>(r));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Rental>> getRental(@PathVariable Long id) {
        Rental rental = rentalRepository.findById(java.util.Objects.requireNonNull(id))
            .orElseThrow(() -> new ResourceNotFoundException("Rental not found"));
        return ResponseEntity.ok(new ApiResponse<>(rental));
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<ApiResponse<Rental>> confirmRental(@PathVariable Long id) {
        Rental rental = rentalRepository.findById(java.util.Objects.requireNonNull(id))
            .orElseThrow(() -> new ResourceNotFoundException("Rental not found"));

        rental.setStatus("confirmed");
        rentalRepository.save(rental);

        return ResponseEntity.ok(new ApiResponse<>(rental));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Rental>> cancelRental(@PathVariable Long id) {
        Rental rental = rentalRepository.findById(java.util.Objects.requireNonNull(id))
            .orElseThrow(() -> new ResourceNotFoundException("Rental not found"));

        rental.setStatus("cancelled");
        rentalRepository.save(rental);

        // Make vehicle available again
        Vehicle vehicle = vehicleRepository.findById(java.util.Objects.requireNonNull(rental.getVehicleId())).orElse(null);
        if (vehicle != null) {
            vehicle.setAvailable(true);
            vehicleRepository.save(vehicle);
        }

        return ResponseEntity.ok(new ApiResponse<>(rental));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<Object>> getUserRentals(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Rental> rentals = rentalRepository.findByUserId(userId, pageable);

        return ResponseEntity.ok(new ApiResponse<>(Map.of(
                "content", rentals.getContent(),
                "totalPages", rentals.getTotalPages(),
                "totalElements", rentals.getTotalElements())));
    }
}
