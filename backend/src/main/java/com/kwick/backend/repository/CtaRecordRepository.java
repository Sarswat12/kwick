package com.kwick.backend.repository;

import com.kwick.backend.model.CtaRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CtaRecordRepository extends JpaRepository<CtaRecord, Long> {
}
