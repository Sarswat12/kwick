package com.kwick.backend.controller;

import com.kwick.backend.model.ContactMessage;
import com.kwick.backend.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contact-messages")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ContactMessageController {

    @Autowired
    private ContactMessageRepository contactMessageRepository;
    @Autowired
    private com.kwick.backend.service.NotificationsPublisher notificationsPublisher;

    @PostMapping
    public ContactMessage create(@RequestBody ContactMessage msg) {
        msg.setCreatedAt(java.time.LocalDateTime.now());
        msg.setStatus("new");
        ContactMessage saved = contactMessageRepository.save(msg);
        notificationsPublisher.contactCreated(saved.getId());
        return saved;
    }

        @GetMapping
        public Map<String, Object> getAll(
            @RequestParam(required = false, defaultValue = "all") String status,
            @RequestParam(required = false, defaultValue = "") String q,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "20") int size) {
        List<ContactMessage> all = contactMessageRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        List<ContactMessage> filtered = all.stream()
            .filter(m -> "all".equalsIgnoreCase(status) || status.equalsIgnoreCase(m.getStatus()))
            .filter(m -> q == null || q.isBlank() || containsIgnoreCase(m.getName(), q) || containsIgnoreCase(m.getEmail(), q) || containsIgnoreCase(m.getPhone(), q) || containsIgnoreCase(m.getSubject(), q))
            .toList();
        int total = filtered.size();
        int p = Math.max(page, 0);
        int s = Math.max(size, 1);
        int from = Math.min(p * s, total);
        int to = Math.min(from + s, total);
        List<ContactMessage> items = filtered.subList(from, to);
        return Map.of("items", items, "total", total, "page", p, "size", s);
        }

    @PutMapping("/{id}/status")
    public Map<String, Object> updateStatus(@PathVariable @NonNull Long id, @RequestBody Map<String, String> payload) {
        String status = payload.getOrDefault("status", "handled");
        ContactMessage msg = contactMessageRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Not found"));
        msg.setStatus(status);
        msg.setHandledAt("handled".equalsIgnoreCase(status) ? java.time.LocalDateTime.now() : null);
        contactMessageRepository.save(msg);
        notificationsPublisher.contactStatus(id, status);
        return Map.of("ok", true, "id", id, "status", status);
    }

    private boolean containsIgnoreCase(String s, String q) {
        if (s == null) return false;
        return s.toLowerCase().contains(q.toLowerCase());
    }
}
