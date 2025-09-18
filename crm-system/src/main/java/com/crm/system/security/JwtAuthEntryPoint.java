package com.crm.system.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtAuthEntryPoint implements AuthenticationEntryPoint {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthEntryPoint.class);

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {
        System.out.println("=== JwtAuthEntryPoint: Unauthorized error ===");
        System.out.println("JwtAuthEntryPoint: Unauthorized error: " + authException.getMessage());
        System.out.println("JwtAuthEntryPoint: Request URI: " + request.getRequestURI());
        System.out.println("JwtAuthEntryPoint: Request Method: " + request.getMethod());
        System.out.println("JwtAuthEntryPoint: Authorization header: " + request.getHeader("Authorization"));
        System.out.println("JwtAuthEntryPoint: Request URL: " + request.getRequestURL());
        System.out.println("JwtAuthEntryPoint: Servlet Path: " + request.getServletPath());
        System.out.println("JwtAuthEntryPoint: Path Info: " + request.getPathInfo());
        System.out.println("JwtAuthEntryPoint: Query String: " + request.getQueryString());
        logger.error("Unauthorized error: {}", authException.getMessage());
        logger.error("Request URI: {}", request.getRequestURI());
        logger.error("Request Method: {}", request.getMethod());
        logger.error("Authorization header: {}", request.getHeader("Authorization"));
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Error: Unauthorized");
    }
}