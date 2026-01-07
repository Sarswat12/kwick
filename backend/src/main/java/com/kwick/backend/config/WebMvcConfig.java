package com.kwick.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.lang.NonNull;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    /**
     * Configure static resource handling.
     * The backend serves as API-only; SPA routing is handled by the frontend (Vercel).
     */
    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // Serve static assets (CSS, JS, images, etc.)
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/", "classpath:/public/")
                .resourceChain(true);
    }


}

