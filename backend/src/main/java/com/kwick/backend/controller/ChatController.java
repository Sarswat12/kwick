package com.kwick.backend.controller;

import com.kwick.backend.ApiResponse;
import com.kwick.backend.dto.ChatRequest;
import com.kwick.backend.dto.ChatResponse;
import com.kwick.backend.service.ChatbotService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatbotService chatbotService;

    @Autowired
    public ChatController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ChatResponse>> chat(@Valid @RequestBody ChatRequest request) {
        try {
            String message = request.getMessage();
            String language = chatbotService.detectLanguage(message);
            String reply = chatbotService.generateReply(message);

            ChatResponse response = new ChatResponse(reply, language);
            return ResponseEntity.ok(new ApiResponse<ChatResponse>(true, "Chat response generated", response));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ApiResponse<ChatResponse>(false, "Error processing chat: " + e.getMessage(), null));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> health() {
        return ResponseEntity.ok(new ApiResponse<String>(true, "Chatbot is online", "OK"));
    }
}