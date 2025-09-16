package com.crm.system.controller.simple;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/simple")
public class SimpleController {

    @GetMapping("/test")
    public String simpleTest() {
        return "Simple test endpoint works!";
    }
}