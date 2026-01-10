package com.kwick.backend.controller;

import com.kwick.backend.model.CtaRecord;
import com.kwick.backend.repository.CtaRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cta-records")
public class CtaRecordController {
    @Autowired
    private CtaRecordRepository ctaRecordRepository;
    @Autowired
    private com.kwick.backend.service.NotificationsPublisher notificationsPublisher;

    @PostMapping
    public CtaRecord createCtaRecord(@RequestBody CtaRecord ctaRecord) {
        ctaRecord.setCreatedAt(java.time.LocalDateTime.now());
        ctaRecord.setStatus("new");
        CtaRecord saved = ctaRecordRepository.save(ctaRecord);
        notificationsPublisher.ctaCreated(saved.getId());
        return saved;
    }

    @GetMapping
    public List<CtaRecord> getAllCtaRecords(
        @RequestParam(required = false, defaultValue = "all") String status,
        @RequestParam(required = false, defaultValue = "") String q,
        @RequestParam(required = false, defaultValue = "0") int page,
        @RequestParam(required = false, defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(size, 1), Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<CtaRecord> p = ctaRecordRepository.findAll(pageable);
        List<CtaRecord> filtered = p.getContent().stream()
            .filter(m -> "all".equalsIgnoreCase(status) || status.equalsIgnoreCase(m.getStatus()))
            .filter(m -> q == null || q.isBlank() || containsIgnoreCase(m.getName(), q) || containsIgnoreCase(m.getEmail(), q) || containsIgnoreCase(m.getPhone(), q) || containsIgnoreCase(m.getLocation(), q))
            .toList();
        return filtered;
    }

    @PutMapping("/{id}/status")
    public Map<String, Object> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.getOrDefault("status", "handled");
        CtaRecord rec = ctaRecordRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Not found"));
        rec.setStatus(status);
        rec.setHandledAt("handled".equalsIgnoreCase(status) ? java.time.LocalDateTime.now() : null);
        ctaRecordRepository.save(rec);
        notificationsPublisher.ctaStatus(id, status);
        return Map.of("ok", true, "id", id, "status", status);
    }

    private boolean containsIgnoreCase(String s, String q) {
        if (s == null) return false;
        return s.toLowerCase().contains(q.toLowerCase());
    }
}
