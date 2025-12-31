package com.kwick.backend.controller;

import com.kwick.backend.model.CtaRecord;
import com.kwick.backend.repository.CtaRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cta-records")
public class CtaRecordController {
    @Autowired
    private CtaRecordRepository ctaRecordRepository;

    @PostMapping
    public CtaRecord createCtaRecord(@RequestBody CtaRecord ctaRecord) {
        ctaRecord.setCreatedAt(java.time.LocalDateTime.now());
        return ctaRecordRepository.save(ctaRecord);
    }

    @GetMapping
    public List<CtaRecord> getAllCtaRecords() {
        return ctaRecordRepository.findAll();
    }
}
