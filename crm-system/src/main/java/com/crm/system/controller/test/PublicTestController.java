package com.crm.system.controller.test;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class PublicTestController {

    @GetMapping("/public")
    public String publicTest() {
        return "Public test endpoint works!";
    }
}