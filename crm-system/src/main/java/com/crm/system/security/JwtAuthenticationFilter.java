package com.crm.system.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.ExpiredJwtException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtTokenUtil jwtTokenUtil;
    private final UserDetailsServiceImpl userDetailsService;

    public JwtAuthenticationFilter(JwtTokenUtil jwtTokenUtil, UserDetailsServiceImpl userDetailsService) {
        this.jwtTokenUtil = jwtTokenUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        log.debug("Processing request: {}", request.getRequestURI());
        System.out.println("=== JwtAuthenticationFilter: Processing request ===");
        System.out.println("JwtAuthenticationFilter: Request URI: " + request.getRequestURI());
        System.out.println("JwtAuthenticationFilter: Servlet Path: " + request.getServletPath());
        System.out.println("JwtAuthenticationFilter: Method: " + request.getMethod());
        System.out.println("JwtAuthenticationFilter: Authorization header: " + request.getHeader("Authorization"));
        System.out.println("JwtAuthenticationFilter: Request URL: " + request.getRequestURL());
        System.out.println("JwtAuthenticationFilter: Context Path: " + request.getContextPath());
        System.out.println("JwtAuthenticationFilter: Path Info: " + request.getPathInfo());
        System.out.println("JwtAuthenticationFilter: Query String: " + request.getQueryString());
        
        // Skip authentication for public login endpoints
        String requestURI = request.getRequestURI();
        System.out.println("=== JwtAuthenticationFilter: Checking if requestURI '" + requestURI + "' is a public endpoint ===");
        
        // Проверяем публичные эндпоинты
        boolean isPublicEndpoint = requestURI.endsWith("/api/auth/login") || 
                                 requestURI.endsWith("/api/auth/signin") ||
                                 requestURI.endsWith("/api/login") || 
                                 requestURI.equals("/login") || 
                                 requestURI.equals("/api/auth/login") || 
                                 requestURI.equals("/api/auth/signin") ||
                                 requestURI.startsWith("/static/") ||
                                 requestURI.startsWith("/favicon.ico") ||
                                 requestURI.startsWith("/actuator/");
        
        System.out.println("=== JwtAuthenticationFilter: isPublicEndpoint = " + isPublicEndpoint + " ===");
        if (isPublicEndpoint) {
            System.out.println("=== JwtAuthenticationFilter: Skipping authentication for public endpoint: " + requestURI + " ===");
            log.info("Skipping JWT filter for public endpoint: {}", requestURI);
            filterChain.doFilter(request, response);
            return;
        } else {
            System.out.println("=== JwtAuthenticationFilter: Processing protected endpoint: " + requestURI + " ===");
        }

        try {
            String jwt = getJwtFromRequest(request);
            System.out.println("JwtAuthenticationFilter: JWT from request: " + (jwt != null ? jwt.substring(0, 20) + "..." : "null"));
            if (StringUtils.hasText(jwt)) {
                try {
                    String email = jwtTokenUtil.getEmailFromToken(jwt);
                    log.debug("Token present for user: {}", email);
                    System.out.println("JwtAuthenticationFilter: Token present for user: " + email);

                    if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                        if (jwtTokenUtil.validateToken(jwt, userDetails)) {
                            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities());
                            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                            SecurityContextHolder.getContext().setAuthentication(authentication);
                            log.debug("Authentication set for user: {}", email);
                            System.out.println("JwtAuthenticationFilter: Authentication set for user: " + email);
                        } else {
                            log.warn("JWT token validation failed for user: {}", email);
                            System.out.println("JwtAuthenticationFilter: JWT token validation failed for user: " + email);
                            
                            // Если токен истек, отправляем 401 Unauthorized
                            if (jwtTokenUtil.isTokenExpired(jwt)) {
                                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token expired");
                                return;
                            }
                        }
                    }
                } catch (SignatureException e) {
                    log.error("Invalid JWT signature for request: {}. Possible key mismatch.", request.getRequestURI(), e);
                    System.out.println("=== JwtAuthenticationFilter: Invalid signature - " + e.getMessage() + " ===");
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token signature");
                    return;
                } catch (ExpiredJwtException e) {
                    log.warn("JWT token expired for request: {}", request.getRequestURI());
                    System.out.println("=== JwtAuthenticationFilter: Token expired ===");
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token expired");
                    return;
                } catch (Exception e) {
                    log.error("Error processing JWT token for request: {}", request.getRequestURI(), e);
                    System.out.println("=== JwtAuthenticationFilter: JWT processing error - " + e.getMessage() + " ===");
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
                    return;
                }
            } else {
                System.out.println("JwtAuthenticationFilter: No JWT token found");
                // Для защищенных эндпоинтов без токена отправляем 401
                if (!isPublicEndpoint) {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authentication token required");
                    return;
                }
            }
        } catch (Exception ex) {
            log.error("Could not set user authentication in security context for {}: {}", request.getRequestURI(), ex.getMessage(), ex);
            System.out.println("JwtAuthenticationFilter: General exception: " + ex.getMessage());
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Authentication error");
            return;
        }

        System.out.println("JwtAuthenticationFilter: Continuing filter chain");
        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
