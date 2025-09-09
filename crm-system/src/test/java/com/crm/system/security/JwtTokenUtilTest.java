package com.crm.system.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenUtilTest {

    @InjectMocks
    private JwtTokenUtil jwtTokenUtil;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        ReflectionTestUtils.setField(jwtTokenUtil, "secret", "mySecretKey");
        ReflectionTestUtils.setField(jwtTokenUtil, "expiration", 86400L);
    }

    @Test
    void testGenerateToken() {
        // Given
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        User userDetails = new User("test@example.com", "password", authorities);

        // When
        String token = jwtTokenUtil.generateToken(userDetails);

        // Then
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void testGetEmailFromToken() {
        // Given
        String email = "test@example.com";
        String token = Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + 86400 * 1000))
                .signWith(SignatureAlgorithm.HS512, "mySecretKey")
                .compact();

        // When
        String emailFromToken = jwtTokenUtil.getEmailFromToken(token);

        // Then
        assertEquals(email, emailFromToken);
    }

    @Test
    void testValidateToken() {
        // Given
        String email = "test@example.com";
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        User userDetails = new User(email, "password", authorities);

        String token = Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + 86400 * 1000))
                .signWith(SignatureAlgorithm.HS512, "mySecretKey")
                .compact();

        // When
        Boolean isValid = jwtTokenUtil.validateToken(token, userDetails);

        // Then
        assertTrue(isValid);
    }
}