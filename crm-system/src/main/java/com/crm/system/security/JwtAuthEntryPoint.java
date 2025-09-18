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
        System.out.println("JwtAuthEntryPoint: Request URL Path: " + request.getRequestURL().toString());
        System.out.println("JwtAuthEntryPoint: Context Path: " + request.getContextPath());
        System.out.println("JwtAuthEntryPoint: Request URI starts with /api/auth/: " + request.getRequestURI().startsWith("/api/auth/"));
        System.out.println("JwtAuthEntryPoint: Request URI matches /api/auth/**: " + request.getRequestURI().matches("/api/auth/.*"));
        
        // Check if this is a login endpoint that should be permitted
        String requestURI = request.getRequestURI();
        boolean isLoginEndpoint = requestURI.endsWith("/api/auth/login") || 
                                 requestURI.endsWith("/api/auth/signin") ||
                                 requestURI.endsWith("/api/login") || 
                                 requestURI.equals("/login") ||
                                 requestURI.equals("/api/auth/test-direct-auth") ||
                                 requestURI.equals("/api/auth/test-auth") ||
                                 requestURI.equals("/api/auth/test-unsecured") ||
                                 requestURI.equals("/api/auth/public");
        
        System.out.println("JwtAuthEntryPoint: isLoginEndpoint = " + isLoginEndpoint);
        
        // Only send 401 for protected endpoints
        if (!isLoginEndpoint) {
            logger.error("Unauthorized error: {}", authException.getMessage());
            logger.error("Request URI: {}", request.getRequestURI());
            logger.error("Request Method: {}", request.getMethod());
            logger.error("Authorization header: {}", request.getHeader("Authorization"));
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Error: Unauthorized");
        } else {
            // For permitted endpoints, let the request continue
            System.out.println("JwtAuthEntryPoint: Allowing request to continue for permitted endpoint");
            response.setStatus(HttpServletResponse.SC_OK);
        }
    }
}