package com.example.safebag.security;

import io.jsonwebtoken.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import java.util.*;
import java.util.function.Function;

@Component
public class JwtUtil {
	
	    // https://www.youtube.com/watch?v=uZGuwX3St_c&t=221s
		// https://www.youtube.com/watch?v=X80nJ5T7YpE&t=914s
		// https://www.youtube.com/watch?v=oeni_9g7too
        // https://jwt.io/introduction

    private final String secretKey = "isikuniversity2025graduaitonprojectSAFEBAG";

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        
        // rolü alıyoruz
        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElseThrow(() -> new IllegalArgumentException("There is no user role for this type"));
        		claims.put("roles", List.of(role));

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername()) 
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 saat
                .signWith(SignatureAlgorithm.HS512, secretKey) 
                .compact();
    }
    
 
    // YOUTUBE
    public String getEmailFromToken(String token) {
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody().getSubject();
    }

    public String extractUsername(String token) {
    	return extractClaim(token, Claims::getSubject);
    }
    public Date extractExpiration(String token) {
    	return extractClaim(token, Claims::getExpiration);
    }
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    	final Claims claims = extractAllClaims(token);
    	return claimsResolver.apply(claims);
    }
    private Claims extractAllClaims(String token) {
    	return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();
    }
    private Boolean isTokenExpired(String token) {
    	return extractExpiration(token).before(new Date());
    }
    
    public boolean validateToken(String token, UserDetails userDetails) {
    	final String username = extractUsername(token);
    	return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
    
  
}
