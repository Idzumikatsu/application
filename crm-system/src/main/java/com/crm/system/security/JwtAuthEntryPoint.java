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
        System.out.println("JwtAuthEntryPoint: Unauthorized error: " + authException.getMessage());
        System.out.println("JwtAuthEntryPoint: Request URI: " + request.getRequestURI());
        System.out.println("JwtAuthEntryPoint: Request Method: " + request.getMethod());
        System.out.println("JwtAuthEntryPoint: Authorization header: " + request.getHeader("Authorization"));
        logger.error("Unauthorized error: {}", authException.getMessage());
        logger.error("Request URI: {}", request.getRequestURI());
        logger.error("Request Method: {}", request.getMethod());
        logger.error("Authorization header: {}", request.getHeader("Authorization"));
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Error: Unauthorized");
    }
}