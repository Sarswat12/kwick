package com.kwick.backend.controller;

import com.kwick.backend.model.ContactMessage;
import com.kwick.backend.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact-messages")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ContactMessageController {

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @PostMapping
    public ContactMessage create(@RequestBody ContactMessage msg) {
        msg.setCreatedAt(java.time.LocalDateTime.now());
        return contactMessageRepository.save(msg);
    }

    @GetMapping
    public List<ContactMessage> getAll() {
        return contactMessageRepository.findAll();
    }
}
