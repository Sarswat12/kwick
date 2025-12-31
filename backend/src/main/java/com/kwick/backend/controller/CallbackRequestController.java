package com.kwick.backend.controller;


import com.kwick.backend.model.CallbackRequest;
import com.kwick.backend.repository.CallbackRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;
import java.util.List;

@RestController
@RequestMapping("/api/callback-requests")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class CallbackRequestController {
    @Autowired
    private CallbackRequestRepository callbackRequestRepository;

    @PostMapping
    public CallbackRequest create(@RequestBody @NonNull CallbackRequest request) {
        return callbackRequestRepository.save(request);
    }

    @GetMapping
    public List<CallbackRequest> getAll() {
        return callbackRequestRepository.findAll();
    }
}
