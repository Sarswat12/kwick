package com.kwick.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.lang.NonNull;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    /**
     * Explicitly configure static resource handling to EXCLUDE /api/** routes.
     * This ensures API endpoints are never caught by Spring's static resource handler,
     * guaranteeing they reach RestControllers and other request handlers.
     */
    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // Serve static assets from classpath
        registry.addResourceHandler("/assets/**")
                .addResourceLocations("classpath:/assets/");

        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/");

        // Serve images, CSS, JS, etc.
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/", "classpath:/public/")
                // Exclude /api/** from static handling - let controllers handle it
                .resourceChain(true);
    }
}
