package com.kwick.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import com.kwick.backend.service.NotificationWebSocketHandler;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final @NonNull NotificationWebSocketHandler handler;

    public WebSocketConfig(@NonNull NotificationWebSocketHandler handler) {
        this.handler = handler;
    }

    @Override
    public void registerWebSocketHandlers(@NonNull WebSocketHandlerRegistry registry) {
        registry.addHandler(handler, "/ws/notifications").setAllowedOrigins("*");
    }
}
