package com.kwick.backend.service;

import org.springframework.stereotype.Service;

@Service
public class NotificationsPublisher {
    private final NotificationWebSocketHandler handler;

    public NotificationsPublisher(NotificationWebSocketHandler handler) {
        this.handler = handler;
    }

    public void contactCreated(long id) {
        handler.broadcast("{\"type\":\"contact\",\"event\":\"created\",\"id\":" + id + "}");
    }
    public void contactStatus(long id, String status) {
        handler.broadcast("{\"type\":\"contact\",\"event\":\"status\",\"id\":" + id + ",\"status\":\"" + status + "\"}");
    }
    public void callbackCreated(long id) {
        handler.broadcast("{\"type\":\"callback\",\"event\":\"created\",\"id\":" + id + "}");
    }
    public void callbackStatus(long id, String status) {
        handler.broadcast("{\"type\":\"callback\",\"event\":\"status\",\"id\":" + id + ",\"status\":\"" + status + "\"}");
    }
    public void ctaCreated(long id) {
        handler.broadcast("{\"type\":\"cta\",\"event\":\"created\",\"id\":" + id + "}");
    }
    public void ctaStatus(long id, String status) {
        handler.broadcast("{\"type\":\"cta\",\"event\":\"status\",\"id\":" + id + ",\"status\":\"" + status + "\"}");
    }

    public void kycStatus(long kycId, long userId, String status) {
        handler.broadcast("{\"type\":\"kyc\",\"event\":\"status\",\"kycId\":" + kycId + ",\"userId\":" + userId + ",\"status\":\"" + status + "\"}");
    }
}
