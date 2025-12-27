package com.kwick.backend.repository;

import com.kwick.backend.model.Rental;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RentalRepository extends JpaRepository<Rental, Long> {
    Page<Rental> findByUserId(Long userId, Pageable pageable);
}
