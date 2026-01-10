package com.kwick.backend.controller;


import com.kwick.backend.model.CallbackRequest;
import com.kwick.backend.repository.CallbackRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/callback-requests")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class CallbackRequestController {
    @Autowired
    private CallbackRequestRepository callbackRequestRepository;
    @Autowired
    private com.kwick.backend.service.NotificationsPublisher notificationsPublisher;

    @PostMapping
    public CallbackRequest create(@RequestBody @NonNull CallbackRequest request) {
        request.setStatus("new");
        CallbackRequest saved = callbackRequestRepository.save(request);
        notificationsPublisher.callbackCreated(saved.getId());
        return saved;
    }

    @GetMapping
    public Map<String, Object> getAll(
        @RequestParam(required = false, defaultValue = "all") String status,
        @RequestParam(required = false, defaultValue = "") String q,
        @RequestParam(required = false, defaultValue = "0") int page,
        @RequestParam(required = false, defaultValue = "20") int size
    ) {
        List<CallbackRequest> all = callbackRequestRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        List<CallbackRequest> filtered = all.stream()
            .filter(m -> "all".equalsIgnoreCase(status) || status.equalsIgnoreCase(m.getStatus()))
            .filter(m -> q == null || q.isBlank() || containsIgnoreCase(m.getName(), q) || containsIgnoreCase(m.getEmail(), q) || containsIgnoreCase(m.getPhone(), q) || containsIgnoreCase(m.getLocation(), q))
            .toList();
        int total = filtered.size();
        int p = Math.max(page, 0);
        int s = Math.max(size, 1);
        int from = Math.min(p * s, total);
        int to = Math.min(from + s, total);
        List<CallbackRequest> items = filtered.subList(from, to);
        return Map.of("items", items, "total", total, "page", p, "size", s);
    }

    @PutMapping("/{id}/status")
    public Map<String, Object> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.getOrDefault("status", "handled");
        CallbackRequest req = callbackRequestRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Not found"));
        req.setStatus(status);
        req.setHandledAt("handled".equalsIgnoreCase(status) ? java.time.LocalDateTime.now() : null);
        callbackRequestRepository.save(req);
        notificationsPublisher.callbackStatus(id, status);
        return Map.of("ok", true, "id", id, "status", status);
    }

    private boolean containsIgnoreCase(String s, String q) {
        if (s == null) return false;
        return s.toLowerCase().contains(q.toLowerCase());
    }
}
