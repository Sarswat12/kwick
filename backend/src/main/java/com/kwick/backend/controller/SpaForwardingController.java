package com.kwick.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaForwardingController {
    // Forward only the specific admin-secret-login route to index.html
    // All other SPA routes and API endpoints are handled by their respective controllers
    @RequestMapping(value = "/admin-secret-login")
    public String forwardAdminLogin() {
        return "forward:/index.html";
    }
}
