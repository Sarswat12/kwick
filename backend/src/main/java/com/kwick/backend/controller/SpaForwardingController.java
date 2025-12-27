package com.kwick.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaForwardingController {
    // Forward only true SPA routes (not static, assets, or index.html)
    @RequestMapping(value = {
        "/admin-secret-login",
        "/{path:^(?!api|static|assets|favicon\\.ico|index\\.html|.*\\.js|.*\\.css|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.json$).*$}"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
