package com.test;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/test-simple")
    public String testSimple() {
        System.out.println("=== SIMPLE TEST CONTROLLER CALLED ===");
        return "HELLO FROM SIMPLE CONTROLLER";
    }
}
