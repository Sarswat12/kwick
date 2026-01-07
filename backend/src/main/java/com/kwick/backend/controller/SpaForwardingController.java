package com.kwick.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import jakarta.servlet.http.HttpServletRequest;

@Controller
public class SpaForwardingController {

    /**
     * Forward ONLY genuine SPA routes (React Router paths) to index.html.
     * All API endpoints (/api/**), static resources, and actuator endpoints are EXCLUDED.
     * This ensures they bypass SPA forwarding and reach their respective handlers.
     */
    @RequestMapping(
        value = "/**",
        method = { RequestMethod.GET, RequestMethod.HEAD },
        produces = "text/html"
    )
    public String forwardSpaRoutes(HttpServletRequest request) {
        String path = request.getRequestURI();
        
        // EXCLUDE: API endpoints
        if (path.startsWith("/api/")) {
            return null; // Let Spring find the API controller
        }
        
        // EXCLUDE: Static resources
        if (path.startsWith("/static/") || path.startsWith("/assets/")) {
            return null;
        }
        
        // EXCLUDE: Files and extensions
        if (path.contains(".") && !path.endsWith(".html")) {
            return null; // Exclude .js, .css, .png, .json, etc.
        }
        
        // EXCLUDE: Root files
        if (path.equals("/") || path.equals("/index.html")) {
            return null; // Let default index.html handling work
        }
        
        // EXCLUDE: Actuator and Spring Boot internals
        if (path.startsWith("/actuator/") || path.startsWith("/error")) {
            return null;
        }
        
        // FORWARD: All other SPA routes to index.html for React Router
        return "forward:/index.html";
    }
}

