package com.kwick.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.lang.NonNull;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    /**
     * Configure static resource handling and SPA routing.
     * - Serve static assets from standard Spring Boot locations
     * - Forward unmapped requests to index.html for React Router
     * - Exclude /api/** from static resource handling
     */
    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // Serve static assets (CSS, JS, images, etc.)
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/", "classpath:/public/")
                .resourceChain(true);
    }

    /**
     * View controller to forward SPA routes to index.html
     * This replaces the old SpaForwardingController with proper Spring MVC configuration
     */
    @Override
    public void addViewControllers(@NonNull ViewControllerRegistry registry) {
        // Forward single-level SPA routes to index.html
        // e.g., /about, /dashboard, /blog (but not /api/*, /static/*, etc.)
        registry.addViewController("/{path:[^\\.]*}")
                .setViewName("forward:/index.html");
        
        // Forward nested SPA routes to index.html
        // e.g., /blog/post-1, /admin/dashboard
        registry.addViewController("/**/{path:[^\\.]*}")
                .setViewName("forward:/index.html");
    }
}

