package com.crm.system.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenUtil {

    private final Long expiration;
    private final Long refreshExpiration;
    private final Key signingKey;

    public JwtTokenUtil(@Value("${jwt.secret}") String secret,
                        @Value("${jwt.expiration}") Long expiration,
                        @Value("${jwt.refresh.expiration}") Long refreshExpiration) {
        this.expiration = expiration;
        this.refreshExpiration = refreshExpiration;
        this.signingKey = buildKey(secret);
    }

    public String generateRefreshToken(UserDetails userDetails) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + getRefreshExpirationSeconds() * 1000);

        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(signingKey, SignatureAlgorithm.HS512)
                .compact();
    }

    public String generateToken(UserDetails userDetails) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration * 1000);

        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(signingKey, SignatureAlgorithm.HS512)
                .compact();
    }

    public String getEmailFromToken(String token) {
        return parseClaims(token).getBody().getSubject();
    }

    public Date getRefreshExpirationDateFromToken(String token) {
        return parseClaims(token).getBody().getExpiration();
    }

    public Date getExpirationDateFromToken(String token) {
        return parseClaims(token).getBody().getExpiration();
    }

    public boolean validateRefreshToken(String token, UserDetails userDetails) {
        final String email = getEmailFromToken(token);
        return email.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String email = getEmailFromToken(token);
        return email.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    public long getExpirationSeconds() {
        return expiration;
    }

    public long getRefreshExpirationSeconds() {
        return 604800; // 7 days
    }

    private boolean isRefreshTokenExpired(String token) {
        final Date expirationDate = getRefreshExpirationDateFromToken(token);
        return expirationDate.before(new Date());
    }

    public boolean isTokenExpired(String token) {
        final Date expirationDate = getExpirationDateFromToken(token);
        return expirationDate.before(new Date());
    }

    private Jws<Claims> parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token);
    }

    private Key buildKey(String secret) {
        byte[] keyBytes;
        try {
            keyBytes = Decoders.BASE64.decode(secret);
        } catch (IllegalArgumentException ex) {
            keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
