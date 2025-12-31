package com.kwick.backend.repository;

import com.kwick.backend.model.CallbackRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CallbackRequestRepository extends JpaRepository<CallbackRequest, Long> {
}
