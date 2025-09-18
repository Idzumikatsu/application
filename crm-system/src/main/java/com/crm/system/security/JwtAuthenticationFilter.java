package com.crm.system.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

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

        try {
            String jwt = getJwtFromRequest(request);
            System.out.println("JwtAuthenticationFilter: JWT from request: " + jwt);
            if (StringUtils.hasText(jwt)) {
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
                        log.debug("JWT token validation failed for user: {}", email);
                        System.out.println("JwtAuthenticationFilter: JWT token validation failed for user: " + email);
                    }
                }
            } else {
                System.out.println("JwtAuthenticationFilter: No JWT token found");
            }
        } catch (Exception ex) {
            log.error("Could not set user authentication in security context", ex);
            System.out.println("JwtAuthenticationFilter: Exception: " + ex.getMessage());
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
